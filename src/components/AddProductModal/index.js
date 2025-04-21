import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './index.css'; // Import the corresponding CSS file for AddProductModal

class AddProductModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      price: '',
      rating: '',
      imageUrl: '',
      availability: '',
      brand: '',
      category: '',
      quantity: '',
      totalReviews: '',
      error: null,
    };
  }

  // Handle changes in form inputs
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // Submit the form and add a new product
  handleSubmit = async (event) => {
    event.preventDefault();
    const {
      title, description, price, rating, imageUrl, availability, brand, category, quantity, totalReviews,
    } = this.state;
    const { onClose, onProductAdd } = this.props;

    try {
      const jwtToken = Cookies.get('jwt_token'); // Use Cookies to get the JWT token
      const response = await fetch('https://bulk-ordering-app-backend.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price), // Ensure price is a number
          rating: parseFloat(rating), // Ensure rating is a number
          image_url: imageUrl,
          availability,
          brand,
          category,
          quantity: parseInt(quantity), // Ensure quantity is an integer
          total_reviews: totalReviews, // Ensure totalReviews is passed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      const newProduct = await response.json();

      // CamelCase conversion for the added product
      const formattedData = {
        id: newProduct.id,
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price,
        availability: newProduct.availability,
        brand: newProduct.brand,
        imageUrl: newProduct.image_url, // Converted to camelCase
        rating: newProduct.rating,
        totalReviews: newProduct.total_reviews, // Converted to camelCase
        category: newProduct.category,
        quantity: newProduct.quantity,
      };

      onProductAdd(formattedData); // Call the callback to add the product
      onClose(); // Close the modal
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    const {
      title, description, price, rating, imageUrl, availability, brand, category, quantity, totalReviews, error,
    } = this.state;
    const { onClose } = this.props;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Add New Product</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={this.handleSubmit}>
            <div className="modal-field">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="modal-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="modal-field">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="modal-field">
              <label htmlFor="rating">Rating</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={rating}
                onChange={this.handleChange}
                max="5"
                min="0.1"
                step="0.1" // Allow decimal values
                required
              />
            </div>

            <div className="modal-field">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={imageUrl}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="modal-field">
              <label htmlFor="availability">Availability</label>
              <input
                type="text"
                id="availability"
                name="availability"
                value={availability}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="modal-field">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={brand}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="modal-field">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={category}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="modal-field">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="modal-field">
              <label htmlFor="totalReviews">Total Reviews</label>
              <input
                type="number"
                id="totalReviews"
                name="totalReviews"
                value={totalReviews}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="modal-buttons">
              <button type="button" onClick={onClose} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AddProductModal;
