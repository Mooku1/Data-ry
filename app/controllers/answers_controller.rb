class AnswersController < ApplicationController
	before_action :get_question

	def new
		@answer = Answer.new
	end
	
	def create
		answer = Answer.new(params.require(:answer).permit(:value, :date, :note))
		answer.question = @question
		if answer.save
			redirect_to question_path(@question.id)
		else
			render :new
		end
	end
	
	def edit
		@answer = Answer.find(params[:id])
	end
	
	def update
		@answer = Answer.find(params[:id])
		if @answer.update_attributes(params.require(:answer).permit(:value, :date, :note))
			redirect_to question_path(@question.id)
		else
			render :edit
		end
	end
	
	def destroy
		Answer.find(params[:id]).destroy
		redirect_to question_path(@question.id)
	end

private
	def get_question
		@question = Question.find(params[:question_id])
	end
	
end
