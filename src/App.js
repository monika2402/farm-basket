import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import ProductCatalogue from './components/ProductCatalogue'
import ProtectedRoute from './components/ProtectedRoute'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import RegistrationForm from './components/RegistrationForm'
import TrackOrder from './components/TrackOrder';
import AdminDashboard from './components/AdminDashboard'

import OrderContext from './context/OrderContext'
import UserContext from './context/UserContext'

import './App.css'

class App extends Component {
  state = {
    orderItems: [],
    isAdmin: false,
  }

  addOrderItem = item => {
    this.setState(prevState => {
      const isPresent = prevState.orderItems.find(each => each.id === item.id)
      if (!isPresent) return {orderItems: [...prevState.orderItems, item]}
      const updatedList = prevState.orderItems.map(each =>
        each.id === item.id
          ? {...each, quantity: each.quantity + item.quantity}
          : each
      )
      return {orderItems: updatedList}
    })
  }

  removeOrderItem = id => {
    this.setState(prevState => ({
      orderItems: prevState.orderItems.filter(each => each.id !== id),
    }))
  }

  updateOrderItemQuantity = (id, quantity) => {
    this.setState(prevState => {
      const updatedList = prevState.orderItems.map(each =>
        each.id === id ? {...each, quantity} : each
      )
      return {orderItems: updatedList}
    })
  }

  incrementOrderItemQuantity = id => {
    this.setState(prevState => ({
      orderItems: prevState.orderItems.map(item =>
        item.id === id ? {...item, quantity: item.quantity + 1} : item
      ),
    }))
  }

  decrementOrderItemQuantity = id => {
    this.setState(prevState => ({
      orderItems: prevState.orderItems
        .map(item =>
          item.id === id && item.quantity > 1
            ? {...item, quantity: item.quantity - 1}
            : item
        )
        .filter(item => item.quantity > 0),
    }))
  }

  clearOrder = () => {
    this.setState({orderItems: []})
  }

  setIsAdmin = isAdmin => {
    this.setState({isAdmin})
  }

  render() {
    const {orderItems, isAdmin, userId} = this.state

    return (
      <UserContext.Provider
        value={{
          isAdmin,
          setIsAdmin: this.setIsAdmin,
          userId, 
          setUserId: this.setUserId, 
        }}
      >
        <OrderContext.Provider
          value={{
            orderItems,
            addOrderItem: this.addOrderItem,
            removeOrderItem: this.removeOrderItem,
            updateOrderItemQuantity: this.updateOrderItemQuantity,
            incrementOrderItemQuantity: this.incrementOrderItemQuantity,
            decrementOrderItemQuantity: this.decrementOrderItemQuantity,
            clearOrder: this.clearOrder,
          }}
        >
          <Switch>
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/register" component={RegistrationForm} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/products" component={ProductCatalogue} />
            <ProtectedRoute
              exact
              path="/products/:id"
              component={ProductItemDetails}
            />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <Route exact path="/track-order" component={TrackOrder} />
            <Route exact path="/admin-dash" component={AdminDashboard} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </OrderContext.Provider>
      </UserContext.Provider>
    )
  }
}

export default App
