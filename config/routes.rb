Project2::Application.routes.draw do

	resource :session, only: [:new, :create, :destroy]
	
	get 'users/' => 'users#index', as: :users
	
	get 'users/new' => 'users#new', as: :new_user
	
	get 'users/:id' => 'users#show', as: :user
	
	post 'users/' => 'users#create'
	
	get 'users/:id/edit' => 'users#edit', as: :edit_user
	
	patch 'users/:id' => 'users#update'
	
	delete 'users/:id' => 'users#destroy'
	
	get 'users/:id/reactivate' => 'users#reactivate', as: :reactivate_user
	
	get 'questions/' => 'questions#index', as: :questions
	
    get 'questions/new' => 'questions#new', as: :new_question
	
	post 'questions/' => 'questions#create'
	
	get 'questions/:id' => 'questions#show', as: :question
	
	get 'answers/' => 'answers#index', as: :answers
	
	get 'answers/new' => 'answers#new', as: :new_answer
	
	post 'answers/' => 'answers#create'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
	
	root 'users#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
