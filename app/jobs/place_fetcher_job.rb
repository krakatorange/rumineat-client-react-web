class PlaceFetcherJob < ApplicationJob
  queue_as :default

  def perform(session_id)
    session = Session.find(session_id)
    PlaceFetcher.get_places(session)
  end
end

