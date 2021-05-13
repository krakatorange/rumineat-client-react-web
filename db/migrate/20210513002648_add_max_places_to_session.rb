class AddMaxPlacesToSession < ActiveRecord::Migration[6.1]
  def change
    add_column :sessions, :max_places, :integer
  end
end
