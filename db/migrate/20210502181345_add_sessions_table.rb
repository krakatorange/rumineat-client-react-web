class AddSessionsTable < ActiveRecord::Migration[6.1]
  def change
    create_table :auth_session_table do |t|
      t.string :session_id, :null => false
      t.text :data
      t.timestamps
    end

    add_index :auth_session_table, :session_id, :unique => true
    add_index :auth_session_table, :updated_at
  end
end
