class UsersController < ApplicationController
  before_action :authorized, only: [:auto_login]

  def create
    @user = User.create(user_params)
    if @user.valid?
      token = encode_token({user_id: @user.id})
      render json: {user: @user, token: token}
    else
      render json: {error: @user.errors.objects.first.full_message}, status: :unauthorized
    end
  end

  def login
    @user = User.find_by(username: params[:username])

    if @user&.authenticate(params[:password])
      token = encode_token({iss: "Promag", sub: @user.username, exp: Time.now.to_i + 4 * 3600 })
      render json: {user: @user, token: token}
    else
      render json: {error: "Invalid username or password"}, status: :unauthorized
    end
  end

  def auto_login
    render json: @user
  end

  private

  def user_params
    params.permit(:email, :username, :password)
  end
end
