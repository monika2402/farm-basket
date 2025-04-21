import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './index.css';

class EditProductModal extends Component {
  constructor(props) {
    super(props);
    const { title, description, price, availability, brand, imageUrl, category, quantity, rating } = props.product;
    this.state = {
      title,
      description,
      price,
      availability,
      brand,
      imageUrl,
      category,
      quantity,
      rating,
      error: null,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { title, description, price, availability, brand, imageUrl, category, quantity, rating } = this.state;
    const { onClose, productId, onProductUpdate } = this.props;

    try {
      const jwtToken = Cookies.get('jwt_token');
      const response = await fetch(`https://bulk-ordering-app-backend.onrender.com/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price), // Ensuring numeric format
          availability,
          brand,
          image_url: imageUrl,
          category,
          quantity: parseInt(quantity), // Ensuring integer format
          rating: parseFloat(rating), // Ensuring numeric format
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }

      const product = await response.json();

      const formattedData = {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        availability: product.availability,
        brand: product.brand,
        imageUrl: product.image_url, // Converted
        rating: product.rating,
        totalReviews: product.total_reviews, // Converted
        category: product.category,
        quantity: product.quantity,
      };

      onProductUpdate(formattedData);
      onClose();
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    const { title, description, price, availability, brand, imageUrl, category, quantity, rating, error } = this.state;
    const { onClose } = this.props;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit Product</h2>
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
              <label htmlFor="price">Price (per kg)</label>
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
              <label htmlFor="rating">Rating</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={rating}
                onChange={this.handleChange}
                max="5"
                min="1"
                step="0.1"
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

            <div className="modal-buttons">
              <button type="button" onClick={onClose} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EditProductModal;
