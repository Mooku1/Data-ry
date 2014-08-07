class AnswersController < ApplicationController
	
	def show
	
	end
	
	def new
		@answer = Answer.new
	end
	
	def create
		@answer = Answer.new(params.require(:answer).permit(:value, :date, :note))
		@answer.question = @question
		if @answer.save
			redirect_to questions_path
		else
			render :new
		end
	end
	
	def edit
	
	end
	
	def update
	
	end
	
	def destroy
	
	end
	
end
