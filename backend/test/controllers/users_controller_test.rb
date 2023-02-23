require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:pepe)
  end

  test "should create user" do
    user_data = {email: "juan@gmail.com", username: "juan09", password: "testme"}
    assert_difference("User.count") do
      post users_create_path, params: user_data
    end

    result = @response.parsed_body

    assert_response :success
    assert_not_nil result["token"]
    assert_not_nil result["refresh_token"]
    assert_equal result["user"]["username"], user_data[:username]
    assert_equal result["user"]["email"], user_data[:email]
  end

  test "should login" do
    user_data = {username: @user.username, password: "testme"}
    post login_path	user_data

    result = @response.parsed_body

    assert_response :success
    assert_not_nil result["token"]
    assert_not_nil result["refresh_token"]
    assert_equal result["user"]["username"], @user.username
    assert_equal result["user"]["email"], @user.email
  end

  test "should auto login" do
    user_data = {username: @user.username, password: "testme"}
    post login_path	user_data

    result = @response.parsed_body
    get auto_login_path, headers: { Authorization: "Bearer #{result["token"]}" }

    assert_response :success
  end

  test "it should not auto login after a moment" do
    user_data = {username: @user.username, password: "testme"}
    post login_path	user_data

    sleep ENV["JWT_SECONDS_EXPIRATION_TOKEN"].to_i

    result = @response.parsed_body
    get auto_login_path, headers: { Authorization: "Bearer #{result["token"]}" }

    assert_response :unauthorized
  end

  test "the refresh token should generate a new token" do
    user_data = {username: @user.username, password: "testme"}
    post login_path	user_data

    result = @response.parsed_body

    get refresh_login_path, headers: { Authorization: "Bearer #{result["refresh_token"]}" }
    result = @response.parsed_body

    assert_response :success
    assert_not_nil result["token"]
    assert_not_nil result["refresh_token"]
    assert_equal result["user"]["username"], @user.username
    assert_equal result["user"]["email"], @user.email
  end

  test "refresh token should not work after a while" do
    user_data = {username: @user.username, password: "testme"}
    post login_path	user_data

    sleep ENV["JWT_SECONDS_EXPIRATION_REFRESH_TOKEN"].to_i

    result = @response.parsed_body
    get refresh_login_path, headers: { Authorization: "Bearer #{result["refresh_token"]}" }

    assert_response :unauthorized
  end
end
