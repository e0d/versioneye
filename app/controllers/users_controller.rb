class UsersController < ApplicationController

  before_filter :authenticate, :only => [:update, :destroy, :index]
  before_filter :correct_user, :only => [:update]
  before_filter :admin_user,   :only => [:destroy, :index]
  before_filter :set_locale

  force_ssl :only => [:new, :create, :activate] if Rails.env.production?
  # before_filter :force_http , :only => [:show, :favoritepackages, :comments]

  def home
    if signed_in?
      redirect_to user_path current_user
    else
      redirect_to root_path
    end
  end

  def index
    @users = User.find_all(params[:page])
  end

  def new
    @user = User.new
  end

  def created
    render 'create'
  end

  def create
    @user = User.new(params[:user])
    if !User.email_valid?(@user.email)
      flash.now[:error] = t(:page_signup_error_email)
      render 'new'
    elsif @user.fullname.nil? || @user.fullname.empty?
      flash.now[:error] = t(:page_signup_error_fullname)
      render 'new'
    elsif @user.password.nil? || @user.password.empty? || @user.password.size < 5
      flash.now[:error] = t(:page_signup_error_password)
      render 'new'
    elsif @user.terms != true
      flash.now[:error] = t(:page_signup_error_terms)
      render 'new'
    else
      @user = User.new(params[:user])
      @user.datenerhebung = true
      @user.create_username
      @user.create_verification
      refer_name = cookies.signed[:veye_refer]
      check_refer( refer_name, @user )
      if @user.save
        @user.send_verification_email
        User.new_user_email(@user)
        @page = "user_created"
      else
        flash.now[:error] = t(:general_error)
        render 'new'
      end
    end
  end

  def show
    @user = User.find_by_username(params[:id])
    @page = "profile"

    if @user
      @userlinkcollection = Userlinkcollection.find_all_by_user( @user.id )

      @products = Array.new
      if has_permission_to_see_products( @user, current_user ) && !@user.nil?
        @products = @user.products.paginate(:page => params[:page], :per_page => 3)
      end

      @comments = Array.new
      if has_permission_to_see_comments( @user, current_user ) && !@user.nil?
        @comments = Versioncomment.find_by_user_id( @user.id ).paginate(:page => params[:page], :per_page => 3)
        @comments_count = Versioncomment.count_by_user_id( @user.id )
        @comments_count = 0 if @comments_count.nil?
      end
    else
      flash.now[:error] = "There is no user with the given username"
    end
  end

  def favoritepackages
    @user = User.find_by_username(params[:id])
    @products = Array.new
    respond_to do |format|
      format.html {
        @page = "profile"
        @userlinkcollection = Userlinkcollection.find_all_by_user( @user.id )
        if has_permission_to_see_products( @user, current_user ) && !@user.nil?
          @products = @user.products.paginate(:page => params[:page])
          @count = @user.products.count
        end
      }
      format.json {
        render :json => "Please use our API at https://www.versioneye.com/api"
      }
      format.rss {
        if has_permission_to_see_products( @user, current_user ) && !@user.nil?
          @notifications = Notification.by_user_id(@user.id)
          my_updated_products = Product.find(@notifications.map(&:product_id)) unless @notifications.nil?
          @products = Hash.new
          my_updated_products.each do |prod|
            @products[prod._id.to_s] = prod
          end
        end
        render  :layout => false
      }
    end
  end

  def comments
    @page = "profile"
    @user = User.find_by_username(params[:id])
    @userlinkcollection = Userlinkcollection.find_all_by_user( @user.id )
    @comments = Array.new
    if has_permission_to_see_comments( @user, current_user ) && !@user.nil?
      @comments = Versioncomment.find_by_user_id( @user.id ).paginate(:page => params[:page])
      @count = Versioncomment.count_by_user_id( @user.id )
    end
  end

  def activate
    verification = params[:verification]
    if User.activate!(verification)
      flash.now[:success] = "Congratulation. Your Account is activated. Please Sign In."
      return
    end
    if UserEmail.activate!(verification)
      flash.now[:success] = "Congratulation. Your E-Mail Address is now verified."
      return
    end
    flash.now[:error] = "The activation code could not be found. Maybe your Account is already activated."
  end

  def users_location
    user = User.find_by_username(params[:id])
    location = "Berlin"
    if user
      location = user.location
    end
    respond_to do |format|
      format.json {
        render :json => "{\"location\": \"#{location}\"}"
      }
    end
  end

  def iforgotmypassword
  end

  def resetpassword
    email = params[:email]
    user = User.find_by_email(email)
    if user.nil?
      flash[:error] = "A user with the given E-Mail address could not be found."
    else
      user.reset_password
      flash[:success] = "Please check your E-Mails. You should receive an E-Mail with a new password."
    end
    redirect_to iforgotmypassword_path
  end

  def destroy
    User.find_by_username(params[:id]).delete_user
    flash[:success] = "User deleted"
    redirect_to users_path
  end

  private

    def correct_user
      @user = User.find_by_username(params[:id])
      redirect_to(root_path) unless current_user?(@user)
    end

    def admin_user
      redirect_to(root_path) unless current_user.admin?
    end

    def check_refer(refer_name, user)
      if refer_name
        refer = Refer.get_by_name(refer_name)
        if refer
          user.refer_name = refer.name
        end
      end
    rescue => e
      logger.error "ERROR in check_refer: #{e}"
      return nil
    end

end
