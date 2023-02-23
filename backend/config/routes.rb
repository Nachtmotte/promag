Rails.application.routes.draw do
  post "/login", to: "users#login"
  post "/users/create", to: "users#create"
  get "/auto_login", to: "users#auto_login"
  get "/refresh_login", to: "users#refresh_login"
end
