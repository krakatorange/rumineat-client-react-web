Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html


  # This needs to be the last route in this file!
  match '*path', to: 'pages#home', via: :all
end
