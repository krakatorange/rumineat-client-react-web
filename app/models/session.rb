class Session < ApplicationRecord
  has_many :users
  has_many :places

  def range_in_meters
    range * 1609.344
  end
end
