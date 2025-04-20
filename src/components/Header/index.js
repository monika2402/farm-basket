import { Link, withRouter } from 'react-router-dom'
import Cookies from 'js-cookie'

import OrderContext from '../../context/OrderContext'

import './index.css'

const Header = (props) => {
  const onClickLogout = () => {
    const { history } = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const renderOrderItemsCount = () => (
    <OrderContext.Consumer>
      {value => {
        const { orderItems } = value
        const orderItemsCount = orderItems.length

        return (
          <>
            {orderItemsCount > 0 ? (
              <span className="cart-count-badge">{orderItemsCount}</span>
            ) : null}
          </>
        )
      }}
    </OrderContext.Consumer>
  )

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <Link to="/">
            <img className="website-logo" src='https://i.postimg.cc/Gpn2SVB4/Screenshot-2025-04-19-232208.png' border='0' alt='Screenshot-2025-04-19-232208'/>
          </Link>

          <button
            type="button"
            className="nav-mobile-btn"
            onClick={onClickLogout}
          >
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
              alt="nav logout"
              className="nav-bar-img"
            />
          </button>
        </div>

        <div className="nav-bar-large-container">
          <Link to="/">
            <img className="website-logo" src='https://i.postimg.cc/Gpn2SVB4/Screenshot-2025-04-19-232208.png' border='0' alt='Screenshot-2025-04-19-232208'/>
          </Link>
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>

            <li className="nav-menu-item">
              <Link to="/products" className="nav-link">
                Products
              </Link>
            </li>

            <li className="nav-menu-item">
              <Link to="/cart" className="nav-link">
                Cart
                {renderOrderItemsCount()}
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/track-order" className="nav-link">
                Track Orders
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/admin-dash" className="nav-link">
                Admin Dashboard
              </Link>
            </li>
            
          </ul>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="nav-menu-mobile">
        <ul className="nav-menu-list-mobile">
          <li className="nav-menu-item-mobile">
            <Link to="/" className="nav-link">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-icon.png"
                alt="nav home"
                className="nav-bar-img"
              />
            </Link>
          </li>

          <li className="nav-menu-item-mobile">
            <Link to="/products" className="nav-link">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-products-icon.png"
                alt="nav products"
                className="nav-bar-img"
              />
            </Link>
          </li>
          <li className="nav-menu-item-mobile">
            <Link to="/cart" className="nav-link">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-icon.png"
                alt="nav cart"
                className="nav-bar-img"
              />
              {renderOrderItemsCount()}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default withRouter(Header)
