class CreatePlaces < ActiveRecord::Migration[6.1]
  def change
    create_table :places do |t|
      t.decimal :latitude
      t.decimal :longitude
      t.string :name
      t.integer :open
      t.decimal :rating
      t.string :google_places_id
      t.string :google_id
      t.string :vicinity
      t.integer :price_level
      t.integer :session_id

      t.timestamps
    end
  end
end
