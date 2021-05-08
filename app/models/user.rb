class User < ApplicationRecord
  belongs_to :session
  has_many :votes
end
