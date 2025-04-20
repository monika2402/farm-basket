import { Component } from 'react'
import Cookies from 'js-cookie'

import Header from '../Header'
import CartListView from '../CartListView'
import OrderContext from '../../context/OrderContext'
import EmptyCartView from '../EmptyCartView'
import './index.css'

class Cart extends Component {
  state = {
    name: '',
    contact: '',
    address: '',
    orderPlaced: false,
  }

  onChangeName = event => {
    this.setState({ name: event.target.value })
  }

  onChangeContact = event => {
    this.setState({ contact: event.target.value })
  }

  onChangeAddress = event => {
    this.setState({ address: event.target.value })
  }

  handlePlaceOrder = (orderItems, clearOrder) => async event => {
    event.preventDefault()

    const { name, contact, address } = this.state
    const userId = localStorage.getItem('userId') // ✅ Fetch userId from localStorage

    if (!userId) {
      alert('User not logged in!')
      return
    }

    const payload = {
      buyer_name: name,
      buyer_contact: contact,
      delivery_address: address,
      user_id: userId,
      items: orderItems.map(item => ({
        product_id: item.id,
        name: item.title,
        quantity: item.quantity,
        image_url: item.imageUrl,
      })),
    }

    const response = await fetch('https://bulk-ordering-app-backend.vercel.app/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('jwt_token')}`,
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      this.setState({ orderPlaced: true })
      clearOrder()
    } else {
      alert('Order failed!')
    }
  }

  renderOrderSummary = orderItems => {
    let totalAmount = 0
    orderItems.forEach(item => {
      totalAmount += item.price * item.quantity
    })

    return (
      <div className="summary">
        <h1 className="total">
        Order Total: <span className="amount">Rs {totalAmount.toFixed(2)}/-</span>
        </h1>
        <p className="items-in-cart">{orderItems.length} items in cart</p>
        <button type="submit" className="checkout">Place Order
        </button>
      </div>
    )
  }

  render() {
    const { name, contact, address, orderPlaced } = this.state

    return (
      <OrderContext.Consumer>
        {value => {
          const { orderItems, clearOrder } = value
          const showEmptyView = orderItems.length === 0

          const onRemoveAllOrderItems = () => {
            clearOrder()
          }

          return (
            <>
              <Header />
              <div className="cart-container">
                {showEmptyView ? (
                  <EmptyCartView />
                ) : (
                  <div className="cart-content-container">
                    <h1 className="cart-heading">My Cart</h1>
                    <button
                      type="button"
                      className="remove-all"
                      onClick={onRemoveAllOrderItems}
                    >
                      Remove All
                    </button>
                    <CartListView />
                      <form className="place-order-container" onSubmit={this.handlePlaceOrder(orderItems, clearOrder)}>
                      <div className='place-order-form'>
                        <>
                          <h2>Ship to</h2>
                          <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={this.onChangeName}
                            required
                          />
                          <input
                            type="text"
                            placeholder="Contact"
                            value={contact}
                            onChange={this.onChangeContact}
                            required
                          />
                          <textarea
                            placeholder="Delivery Address"
                            value={address}
                            onChange={this.onChangeAddress}
                            required
                          />
                          {orderPlaced && <p className="order-success">Order Placed Successfully!</p>}
                        </>
                        
                        {this.renderOrderSummary(orderItems)}
                       </div>
                      </form>

                    
                  </div>
                )}
              </div>
            </>
          )
        }}
      </OrderContext.Consumer>
    )
  }
}

export default Cart

