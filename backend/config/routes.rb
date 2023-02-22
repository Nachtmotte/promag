Rails.application.routes.draw do
  post "/login", to: "users#login"
  post "/create", to: "users#create"
  get "/auto_login", to: "users#auto_login"
end
