class QuestionsController < ApplicationController
	
	def index
		@questions = Question.all
		@answers = Question.find(params[:id]).answers
	end
	
	def show
		@question = Question.find(params[:id])
	end
	
	def new
		@question = Question.new
	end
	
	def create
		@question = Question.new(params.require(:question).permit(:text))
		if @question.save
			redirect_to question_path
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
