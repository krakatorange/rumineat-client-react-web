require 'httparty'
require 'logger'

class PlaceFetcher
  extend self
  GOOGLE_API_KEY = Rails.application.credentials.google.api_key
  MAX_DECISIONS = 20

  def get_places(session, count=0, next_page_token=nil)
    latitude = session.latitude || '39.2842392'
    longitude = session.longitude || '-76.5937014'
    radius = session.range_in_meters
    price_level = session.price_level || nil

    response = HTTParty.get(BASE_URL, query: enrich_parameters(latitude, longitude, radius, next_page_token, price_level))
    next_page_token = response['next_page_token']
    response.fetch('results', []).each do |place_data|
      if build_place(session, place_data)
        count + 1
      else
        Rails.logger.error("Failed to save place #{place_data}")
      end
      break if count == MAX_DECISIONS
    end

    if next_page_token.nil? || count >= MAX_DECISIONS
      session.max_decisions = count
      session.max_decisions = count
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
end