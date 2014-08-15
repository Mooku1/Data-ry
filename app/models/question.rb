class Question
  include Mongoid::Document
  field :text, type: String
  field :type, type: String
  field :frequency, type: String
  field :units, type: String
  belongs_to :user
  
  has_many :answers

  validates :text, presence: true

  validates :units, presence: true
  
end
