class VotesController < ApplicationController
  def create
    session_id = params[:session_id]
    place_id = params[:place_id]
    user_id = current_user.id
    time_ms = params[:time_ms]
    selected = params[:selected]

    begin
      Vote.create!(session_id: session_id,
                   place_id: place_id,
                   user_id: user_id,
                   time_ms: time_ms,
                   selected: selected)
      render json: {success: true}, status: :created
    rescue => e
      render json: {success: false}, status: :internal_server_error
    end
  end
end