import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import OrderContext from '../../context/OrderContext'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        params: {id},
      },
    } = this.props
    if (id !== prevProps.match.params.id) {
      this.getProductData()
    }
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://bulk-ordering-app-backend.onrender.com/api/products/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <p>Loading...</p>
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">Continue Shopping</button>
      </Link>
    </div>
  )

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductDetailsView = () => (
    <OrderContext.Consumer>
      {value => {
        const {productData, quantity, similarProductsData} = this.state
        const {
          brand,
          description,
          imageUrl,
          price,
          rating,
          title,
          totalReviews,
        } = productData

        const {addOrderItem} = value  // from OrderContext

        const onClickAddToOrder = () => {
          addOrderItem({...productData, quantity})
        }

        return (
          <div className="product-details-success-view">
            <div className="product-details-container">
              <img src={imageUrl} alt="product" className="product-image" />
              <div className="product">
                <h1 className="product-name">{title}</h1>
                <p className="price-details">Rs {price} /Kg</p>
                <div className="rating-and-reviews-count">
                  <div className="rating-container">
                    <p className="rating">{rating}</p>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                      alt="star"
                      className="star"
                    />
                  </div>
                  <p className="reviews-count">{totalReviews} Reviews</p>
                </div>
                <p className="product-description">{description}</p>
                <div className="label-value-container">
                  <p className="label">Quantity:</p>
                  <p className="value">{quantity} Kgs</p>
                </div>
                <div className="label-value-container">
                  <p className="label">Brand:</p>
                  <p className="value">{brand}</p>
                </div>
                <hr className="horizontal-line" />
                <div className="quantity-container">
                  <button
                    type="button"
                    className="quantity-controller-button"
                    onClick={this.onDecrementQuantity}
                    data-testid="minus"
                  >
                    <BsDashSquare className="quantity-controller-icon" />
                  </button>
                  <p className="quantity">{quantity}</p>
                  <button
                    type="button"
                    className="quantity-controller-button"
                    onClick={this.onIncrementQuantity}
                    data-testid="plus"
                  >
                    <BsPlusSquare className="quantity-controller-icon" />
                  </button>
                </div>
                <button
                  type="button"
                  className="button add-to-cart-btn"
                  onClick={onClickAddToOrder}
                >
                  ADD TO ORDER
                </button>
              </div>
            </div>
            <h1 className="similar-products-heading">Similar Products</h1>
            <ul className="similar-products-list">
              {similarProductsData.map(eachSimilarProduct => (
                <SimilarProductItem
                  productDetails={eachSimilarProduct}
                  key={eachSimilarProduct.id}
                />
              ))}
            </ul>
          </div>
        )
      }}
    </OrderContext.Consumer>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
