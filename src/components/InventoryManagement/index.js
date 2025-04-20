import React, { Component } from 'react';
import Cookies from 'js-cookie';
import AddProductModal from '../AddProductModal';
import EditProductModal from '../EditProductModal';
import './index.css'; // Import the CSS file

class InventoryManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      error: null,
      editingProduct: null, // Store the product being edited
      showAddProductModal: false, // Control visibility of the Add Product Modal
    };
  }

  // Fetch products when the component mounts
  componentDidMount() {
    this.fetchProducts();
  }

  // Function to fetch products
  fetchProducts = async () => {
    try {
      const jwtToken = Cookies.get('jwt_token');
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error fetching products');
      }
  
      const data = await response.json();
  
      const updatedData = data.map(product => ({
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
      }));
  
      this.setState({ products: updatedData, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };
  

  // Function to delete a product
  deleteProduct = async (id) => {
    try {
      const jwtToken = Cookies.get('jwt_token');
      const response = await fetch(`https://bulk-ordering-app-backend.vercel.app/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error deleting product');
      }

      this.setState({
        products: this.state.products.filter((product) => product.id !== id),
      });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  // Function to handle opening the edit modal
  openEditModal = (product) => {
    this.setState({ editingProduct: product });
  };

  // Function to handle closing the edit modal
  closeEditModal = () => {
    this.setState({ editingProduct: null });
  };

  // Function to handle opening the add product modal
  openAddProductModal = () => {
    this.setState({ showAddProductModal: true });
  };

  // Function to handle closing the add product modal
  closeAddProductModal = () => {
    this.setState({ showAddProductModal: false });
  };

  // Function to update the product in the state after editing
  handleProductUpdate = (updatedProduct) => {
    this.setState({
      products: this.state.products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      ),
    });
  };

  // Function to add a new product to the state after creation
  handleProductAdd = (newProduct) => {
    this.setState({
      products: [...this.state.products, newProduct],
    });
  };

  render() {
    const { products, loading, error, editingProduct, showAddProductModal } = this.state;

    return (
      <div className="product-management-container">
        {/* Add Product Button */}
        <div className="add-product-button">
          <button onClick={this.openAddProductModal}>Add Product</button>
        </div>

        {/* Loading and Error Messages */}
        {loading && <p>Loading products...</p>}
        {error && <p className="error-message">Error: {error}</p>}

        {/* Product Cards */}
        <div className="product-cards-container">
          {!loading && !error &&
            products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.imageUrl} alt={product.title} />
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p><strong>Price:</strong> Rs {product.price}/-</p>
                <p><strong>Rating:</strong> {product.rating}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Available Quantity:</strong> {product.quantity}</p>
                <p><strong>Total Reviews:</strong> {product.totalReviews}</p>

                {/* Edit and Delete buttons */}
                <div className="product-buttons">
                  <button
                    className="edit-button"
                    onClick={() => this.openEditModal(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => this.deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Render Add Product Modal */}
        {showAddProductModal && (
          <AddProductModal
            onClose={this.closeAddProductModal}
            onProductAdd={this.handleProductAdd}
          />
        )}

        {/* Render Edit Product Modal */}
        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            productId={editingProduct.id}
            onClose={this.closeEditModal}
            onProductUpdate={this.handleProductUpdate}
          />
        )}
      </div>
    );
  }
}

export default InventoryManagement;
