class QuestionsController < ApplicationController
	
	before_action :check_user

	def index
		@questions = current_user.questions
	end
	
	def show
		@question = Question.find(params[:id])
		@answers = @question.answers.sort_by &:date
		gon.watch.question_json = @answers
		gon.watch.units = @question.units
		if @answers.length > 1
			if @answers.last.date == Date.today
				@today_answer = @answers.last.value
			elsif @answers.last.date == Date.today.advance(:days => -1)
				@yesterday_answer = @answers.last.value
			end
		end
		if (!current_user) || (@question.user != current_user)
			redirect_to new_session_path
			return
		end
	end
	
	def new
		@question = Question.new
	end
	
	def create
		@question = current_user.questions.new(params.require(:question).permit(:text, :units))
		if @question.save
			redirect_to questions_path
		else
			render :new
		end
	end
	
	def edit
		@question = Question.find(params[:id])
		if (!current_user) || (@question.user != current_user)
			redirect_to new_session_path
			return
		end
	end
	
	def update
		@question = Question.find(params[:id])
		@question.user = current_user
		if (!current_user) || (@question.user != current_user)
			redirect_to new_session_path
			return
		elsif (@question.user == current_user)
			if @question.update_attributes(params.require(:question).permit(:text, :units))
				redirect_to questions_path
			else
				render :edit
			end
		else
			redirect_to new_session_path
			return
		end
	end
	
	def destroy
		Question.find(params[:id]).destroy
		redirect_to questions_path
	end

private
	def check_user
		if !current_user
			redirect_to new_session_path
			return
		end
	end	

end
