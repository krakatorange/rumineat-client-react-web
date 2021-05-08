class Vote < ApplicationRecord
  belongs_to :session
  belongs_to :place
  belongs_to :user
end
