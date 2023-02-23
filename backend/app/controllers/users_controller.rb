class UsersController < ApplicationController
  before_action :authorized, only: [:auto_login, :refresh_login]

  def create
    @user = User.create(user_params)
    if @user.valid?
      render json: {user: @user, token: token, refresh_token: refresh_token}
    else
      render json: {error: @user.errors.objects.first.full_message}, status: :unauthorized
    end
  end

  def login
    @user = User.find_by(username: params[:username])

    if @user&.authenticate(params[:password])
      render json: {user: @user, token: token, refresh_token: refresh_token}
    else
      render json: {error: "Invalid username or password"}, status: :unauthorized
    end
  end

  def auto_login
    render json: @user
  end

  def refresh_login
    render json: {user: @user, token: token, refresh_token: refresh_token}
  end

  private

  def user_params
    params.permit(:email, :username, :password)
  end

  def token
    token_expiration = Time.now.to_i + ENV["JWT_SECONDS_EXPIRATION_TOKEN"].to_i
    encode_token({iss: "Promag", sub: @user.username, exp: token_expiration })
  end

  def refresh_token
    refresh_token_expiration = Time.now.to_i + ENV["JWT_SECONDS_EXPIRATION_REFRESH_TOKEN"].to_i
    encode_token({iss: "Promag", sub: @user.username, exp: refresh_token_expiration })
  end
end
