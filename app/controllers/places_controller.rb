class PlacesController < ApplicationController
  def index
    session_id = params[:session_id]
    @places = Place.where(session_id: session_id).order(:id)
    json_response = {places: []}
    @places.each do |place|
      json_response[:places] << place.as_json.merge(image_url: place.image_url)
    end
  end
end