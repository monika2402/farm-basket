import CartItem from '../CartItem'
import OrderContext from '../../context/OrderContext'

import './index.css'

const CartListView = () => (
  <OrderContext.Consumer>
    {value => {
      const {orderItems} = value

      return (
        <ul className="cart-list">
          {orderItems.map(eachOrderItem => (
            <CartItem key={eachOrderItem.id} cartItemDetails={eachOrderItem} />
          ))}
        </ul>
      )
    }}
  </OrderContext.Consumer>
)

export default CartListView
