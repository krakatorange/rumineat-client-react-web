ActiveRecord::SessionStore::Session.table_name = 'auth_session_table'
Rails.application.config.session_store :active_record_store, :key => 'rumineat_ss'