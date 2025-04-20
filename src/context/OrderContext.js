// src/context/OrderContext/index.js
import React from 'react'

const OrderContext = React.createContext({
  orderItems: [],
  addOrderItem: () => {},
  removeOrderItem: () => {},
  updateOrderItemQuantity: () => {},
  clearOrder: () => {},
})

export default OrderContext
