class ApplicationController < ActionController::API
  before_action :authorized

  def encode_token(payload)
    JWT.encode(payload, ENV["JWT_SECRET"])
  end

  def auth_header
    request.headers["Authorization"]
  end

  def decoded_token
    if auth_header
      token = auth_header.split(" ")[1]
      begin
        JWT.decode(token, ENV["JWT_SECRET"], true, algorithm: "HS256")
      rescue JWT::ExpiredSignature, JWT::DecodeError => e
        nil
      end
    end
  end

  def logged_in_user
    if decoded_token
      username = decoded_token[0]["sub"]
      @user = User.find_by(username: username)
    end
  end

  def logged_in?
    !!logged_in_user
  end

  def authorized
    render json: { message: "Please log in" }, status: :unauthorized unless
    logged_in?
  end
end
