import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './index.css';
import OrderCard from '../OrderCard';

class OrderManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      error: null,
      statusUpdates: {},
    };
  }

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders = async () => {
    try {
      const jwtToken = Cookies.get('jwt_token');
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching orders');
      }

      const data = await response.json();

      const updatedData = data.map(order => ({
        id: order.id,
        buyerName: order.buyer_name,
        buyerContact: order.buyer_contact,
        deliveryAddress: order.delivery_address,
        items: order.items || [],
        status: order.status || "Pending",
        userId: order.user_id,
      }));

      const statusUpdates = {};
      updatedData.forEach(order => {
        statusUpdates[order.id] = order.status;
      });

      this.setState({ orders: updatedData, statusUpdates, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  deleteOrder = async (id) => {
    try {
      const jwtToken = Cookies.get('jwt_token');
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error deleting order');
      }

      this.setState(prevState => ({
        orders: prevState.orders.filter((order) => order.id !== id),
      }));

      window.alert(`Order ID ${id} has been deleted successfully.`);
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  handleStatusChange = (orderId, newStatus) => {
    this.setState(prevState => ({
      statusUpdates: {
        ...prevState.statusUpdates,
        [orderId]: newStatus,
      },
    }));
  };

  updateStatus = async (orderId) => {
    const newStatus = this.state.statusUpdates[orderId];
    try {
      const jwtToken = Cookies.get('jwt_token');
      const response = await fetch(`https://bulk-ordering-app-backend.vercel.app/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      this.setState(prevState => ({
        orders: prevState.orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ),
      }));
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    const { orders, loading, error, statusUpdates } = this.state;

    return (
      <div className="order-management-container">
        {loading && <p>Loading orders...</p>}
        {error && <p className="error-message">Error: {error}</p>}

        <div className="order-column-container">
          {!loading && !error &&
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                statusUpdates={statusUpdates}
                onDelete={this.deleteOrder}
                onStatusChange={this.handleStatusChange}
                onStatusUpdate={this.updateStatus}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default OrderManagement;
