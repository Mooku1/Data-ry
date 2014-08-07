class Answer
  include Mongoid::Document
  field :value, type: Float
  field :date, type: Date
  field :note, type: String
  belongs_to :question
end
