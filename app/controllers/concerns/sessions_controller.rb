class SessionsController < ApplicationController
	def new
		# Presents an empty login form
		@user = User.new
		@is_login = true
	end

	def create
		# Find the user that is trying to log in
		u = User.where(email: params[:user][:email]).first
		if u && u.authenticate(params[:user][:password])
			if u.is_active == false
				redirect_to reactivate_user_path(u.id)
			else
				# Store as a cookie in the user's browser the ID of them,
				# indicating that they are logged in
				session[:user_id] = u.id.to_s
				redirect_to users_path
			end
		else
			redirect_to new_session_path
		end
	end

	def destroy
		reset_session
		redirect_to users_path
	end
end