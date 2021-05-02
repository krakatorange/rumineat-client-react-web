class CreateSessions < ActiveRecord::Migration[6.1]
  def change
    create_table :sessions do |t|
      t.string :access_code
      t.string :latitude
      t.string :longitude
      t.integer :range
      t.integer :price_level

      t.timestamps
    end
  end
end
