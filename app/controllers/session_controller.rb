class SessionController < ApplicationController
  skip_before_action :verify_authenticity_token
  skip_before_action :authenticate, only: [:create, :join]
  PRICE_LEVEL_MAP = {
    '$' => '1',
    '$$' => '2',
    '$$$' => '3'
  }.freeze

  def details
    data = {}
    @session = current_user.session
    data[:user_count] = @session.users.count
    data[:place_count] = @session.places.count
    data[:done_fetching] = @session.max_places.present?
    data[:users] = @session.users.map{|x|x.username}
    data[:access_code] = @session.access_code
    render json: data, status: :ok
  end

  def create
    @session = Session.new
    @session.access_code = SecureRandom.uuid.to_s
    @session.latitude = params[:latitude]
    @session.longitude = params[:longitude]
    @session.range = params[:range]
    @session.price_level = PRICE_LEVEL_MAP.fetch(params[:price_level], '2')

    @user = User.new
    @user.username =  Haikunator.haikunate(9999) # generate username
    @user.signature = '' # generate signature

    success = false
    ActiveRecord::Base.transaction do
      begin
        if @session.save!
          @user.session = @session
          if @user.save!
            success = true
          end
        end
      rescue => _e
        logger.error("Error creating session #{_e}")
      end
    end

    PlaceFetcherJob.perform_now(@session.id)

    session[:user_id] = @user.id if success
    render json: {
      success: success,
      message: success ? "Successfully created session" : "Error creating session"
    }, status: :ok
  end

  def join
    raw_access_code = params.fetch(:access_code, nil)
    access_code = /[0-9a-zA-Z]{8}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{4}\-[0-9a-zA-Z]{12}/.match(raw_access_code.to_s)
    access_code = access_code.to_s
    @session = Session.where(access_code: access_code).first if access_code

    unless access_code && @session
      logger.warn("Unable to find group with access code: #{raw_access_code}")
      render json: {message: 'Unable to find session'}, status: :bad_request
      return
    end

    user = User.create(session_id: @session.id, username: Haikunator.haikunate(9999))
    if user.save
      session[:user_id] = user.id
      render json: { user: user.as_json, message: 'Welcome'}, status: :ok
    else
      logger.error("Unable to save user #{user.errors}")
      render json: {message: 'Unable to join that session at this time'}, status: :internal_server_error
    end
  end
end