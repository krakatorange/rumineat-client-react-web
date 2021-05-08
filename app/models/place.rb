class Place < ApplicationRecord
  belongs_to :session
  has_one_attached :image
  has_many :votes

  acts_as_taggable_on :types

  def image_url
    return nil unless self.image.attached?
    base_url = ENV['RAILS_ENV'] == 'production' ? 'https://rumineat-api.herokuapp.com' : 'http://localhost:3000'
    path = Rails.application.routes.url_helpers.rails_blob_path(self.image, only_path: true)
    return "#{base_url}#{path}"
  end
end
