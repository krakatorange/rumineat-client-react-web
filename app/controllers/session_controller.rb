class SessionController < ApplicationController
  skip_before_action :verify_authenticity_token
  PRICE_LEVEL_MAP = {
    '$' => '1',
    '$$' => '2',
    '$$$' => '3'
  }.freeze

  def create
    @session = Session.new
    @session.access_code = SecureRandom.uuid.to_s
    @session.latitude = params[:latitude]
    @session.longitude = params[:longitude]
    @session.range = params[:range]

    @user = User.new
    @user.username =  Haikunator.haikunate(9999) # generate username
    @user.signature = '' # generate signature
    ActiveRecord::Base.transaction do
      begin
        if @session.save!
          @user.session = @session
          if @user.save!
            session[:user_id] = @user.id
            render json: {
              success: true
            }, status: :ok
            return
          end
        end
      rescue => _e
        render json: {success: false, message: 'Error creating session'}, status: :internal_server_error
      end
    end
  end

  def join
    render json: {
      user: current_user.id
    }
  end
end