import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-heading">Fresh Produce Delivered to Your Doorstep</h1>
        <img
          src="https://images.fineartamerica.com/images-medium-large-5/1-selection-of-fresh-fruit-and-vegetables-science-photo-library.jpg"
          alt="fresh fruits and vegetables"
          className="home-mobile-img"
        />
        <p className="home-description">
          Eating fresh has never been easier! We bring you handpicked, high-quality fruits and vegetables directly from trusted farms — in bulk, at the best prices. Whether you're a home chef or a business, order in minutes and enjoy fast delivery, guaranteed freshness, and unbeatable value.
        </p>

        <Link to="/products">
          <button type="button" className="shop-now-button">
            Shop Now
          </button>
        </Link>
      </div>
      <img
        src="https://images.fineartamerica.com/images-medium-large-5/1-selection-of-fresh-fruit-and-vegetables-science-photo-library.jpg"
        alt="clothes that get you noticed"
        className="home-desktop-img"
      />
    </div>
  </>
)

export default Home