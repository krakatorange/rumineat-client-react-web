class Place < ApplicationRecord
  belongs_to :session
  has_one_attached :image
end
