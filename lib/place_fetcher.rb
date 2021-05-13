require 'httparty'
require 'logger'

module PlaceFetcher
  extend self
  GOOGLE_API_KEY = Rails.application.credentials.dig(:google, :api_key)
  MAX_PLACES = 20
  BASE_URI = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'.freeze
  BASE_PHOTO_URI = 'https://maps.googleapis.com/maps/api/place/photo?photoreference='.freeze
  IGNORED_TAGS = %w(PLACE_OF_INTEREST ESTABLISHMENT)

  def get_places(session, count=0, next_page_token=nil)
    latitude = session.latitude || '39.2842392'
    longitude = session.longitude || '-76.5937014'
    radius = session.range_in_meters
    price_level = session.price_level || nil

    response = HTTParty.get(BASE_URI, query: enrich_parameters(latitude, longitude, radius, next_page_token, price_level))
    next_page_token = response['next_page_token']
    response.fetch('results', []).each do |place_data|
      if build_place(session, place_data)
        count + 1
      else
        Rails.logger.error("Failed to save place #{place_data}")
      end
      break if count == MAX_PLACES
    end

    if next_page_token.nil? || count >= MAX_PLACES
      session.max_places = count
      if session.save
        Rails.logger.debug('Successfully updated session max decision count')
        return
      else
        Rails.logger.error('Failed to updated session max decision count')
      end
    end

    sleep(2)
    get_places(session, count, next_page_token)
  end

  def enrich_parameters lat, long, radius, token, price_level
    data = {
      location: "#{lat},#{long}",
      radius: radius.to_s,
      type: 'restaurant',
      opennow: true,
      key: GOOGLE_API_KEY,
      pagetoken: token
    }
    if price_level
      data[:minprice]=price_level
      data[:maxprice]=price_level
    end
    data
  end

  def self.build_place session, google_place_json
    geo_location = google_place_json.fetch('geometry',{}).fetch('location', {})
    latitude = geo_location.fetch('lat', nil)
    longitude = geo_location.fetch('lng', nil)
    types = google_place_json.fetch('types', [])
    types.reject!{|t|IGNORED_TAGS.include?(t)}

    name = google_place_json.fetch('name', '')
    open = google_place_json.fetch('opening_hours', {}).fetch('open_now', false)
    rating = google_place_json.fetch('rating', 0.0)
    google_place_id = google_place_json.fetch('place_id', nil)
    price_level = google_place_json.fetch('price_level', -1)
    google_id = google_place_json.fetch('id', nil)
    vicinity = google_place_json.fetch('vicinity', nil)
    one_photo = google_place_json.fetch('photos', [])&.first&.fetch('photo_reference', nil)

    image_data = get_photo(one_photo)

    place = Place.new(latitude: latitude,
                      longitude: longitude,
                      name: name,
                      open: open,
                      rating: rating,
                      google_places_id: google_place_id,
                      google_id: google_id,
                      vicinity: vicinity,
                      session: session,
                      price_level: price_level,
                      type_list: types)

    if place.save
      if image_data
        begin
          place.image.attach(io: StringIO.new(image_data), filename: 'image.png')
          if place.save
            return true
          else
            return false
          end
        rescue => e
          puts e
          puts 'Error attaching image'
          return true
        end
      end
      return true
    else
      false
    end
  end


  def self.get_photo one_photo
    # https://maps.googleapis.com/maps/api/place/photo?photoreference=PHOTO_REFERENCE&key=YOUR_API_KEY
    url = "#{BASE_PHOTO_URI}#{one_photo}&maxwidth=400&key=#{GOOGLE_API_KEY}"
    result = nil
    begin
      result = HTTParty.get(url)
    rescue => e
      puts 'Error retrieving image'
      return nil
    end
    image_data = result&.body
    return image_data
  end
end