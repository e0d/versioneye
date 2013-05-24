class ProductService

  # languages have to be an array of strings.
  def self.search(q, group_id = nil, languages = nil, page_count = 1)
    ProductElastic.search(q, group_id, languages, page_count)
  rescue => e
    Rails.logger.error e.message
    Rails.logger.error e.backtrace.first
    Rails.logger.info  "Dam. We don't give up. Not yet! Start alternative search on awesome MongoDB."
    Product.find_by(q, "", group_id, languages, 300).paginate(:page => page_count)
  end


  def self.follow(prod_key, user)
    result = false
    product = Product.find_by_key prod_key
    if product && user && !product.users.include?( user )
      product.users.push user
      product.followers += 1
      result = product.save
    end
    result
  end


  def self.unfollow(prod_key, user)
    result = false
    product = Product.find_by_key prod_key
    if product && user && product.users.include?( user )
      product.users.delete(user)
      product.followers -= 1
      result = product.save
    end
    result
  end

end
