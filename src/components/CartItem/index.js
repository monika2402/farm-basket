import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {AiFillCloseCircle} from 'react-icons/ai'
import {Component} from 'react'

import OrderContext from '../../context/OrderContext'

import './index.css'

class CartItem extends Component {
  render() {
    return (
      <OrderContext.Consumer>
        {value => {
          const {
            removeOrderItem,
            incrementOrderItemQuantity,
            decrementOrderItemQuantity,
          } = value
          const {cartItemDetails} = this.props
          const {id, title, brand, quantity, price, imageUrl} = cartItemDetails
          
          const onRemoveOrderItem = () => {
            removeOrderItem(id)
          }

          const onIncrementQuantity = () => {
            incrementOrderItemQuantity(id)
          }

          const onDecrementQuantity = () => {
            decrementOrderItemQuantity(id)
          }

          return (
            <li className="cart-item">
              <img className="cart-product-image" src={imageUrl} alt={title} />
              <div className="cart-item-details-container">
                <div className="cart-product-title-brand-container">
                  <p className="cart-product-title">{title}</p>
                  <p className="cart-product-brand">by {brand}</p>
                </div>
                <div className="cart-quantity-container">
                  <button
                    type="button"
                    className="quantity-controller-button"
                    onClick={onDecrementQuantity}
                    data-testid="minus"
                  >
                    <BsDashSquare color="#52606D" size={12} />
                  </button>
                  <p className="cart-quantity">{quantity}</p>
                  <button
                    type="button"
                    className="quantity-controller-button"
                    onClick={onIncrementQuantity}
                    data-testid="plus"
                  >
                    <BsPlusSquare color="#52606D" size={12} />
                  </button>
                </div>
                <div className="total-price-remove-container">
                  <p className="cart-total-price">Rs {price * quantity}/-</p>
                  <button
                    className="remove-button"
                    type="button"
                    onClick={onRemoveOrderItem}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <button
                className="delete-bn"
                type="button"
                onClick={onRemoveOrderItem}
                data-testid="remove"
              >
                <AiFillCloseCircle color="#616E7C" size={20} />
              </button>
            </li>
          )
        }}
      </OrderContext.Consumer>
    )
  }
}

export default CartItem
