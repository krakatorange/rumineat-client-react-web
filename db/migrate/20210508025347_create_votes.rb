class CreateVotes < ActiveRecord::Migration[6.1]
  def change
    create_table :votes do |t|
      t.integer :session_id
      t.integer :place_id
      t.integer :user_id
      t.integer :time_ms
      t.boolean :selected

      t.timestamps
    end
  end
end
