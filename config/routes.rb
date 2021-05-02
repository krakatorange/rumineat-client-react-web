Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  scope :api do
    scope :v1 do
      post 'create', to: 'session#create'
      post 'join', to: 'session#join'
    end
  end

  # This needs to be the last route in this file!
  match '*path', to: 'pages#home', via: :all
end
