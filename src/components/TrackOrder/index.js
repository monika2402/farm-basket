// src/components/TrackOrder/index.js
import React, { Component } from 'react';
import Header from '../Header';
import Cookies from 'js-cookie';
import './index.css';

const statusSteps = ['Pending', 'In Progress', 'Delivered'];

class TrackOrder extends Component {
  state = {
    orders: [],
    loading: true,
  };

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      this.setState({ loading: false });
      return;
    }

    try {
      const token = Cookies.get('jwt_token');
      const response = await fetch(`http://localhost:5000/api/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        this.setState({ orders: data, loading: false });
      } else {
        console.error('Failed to fetch orders');
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error('Error:', error);
      this.setState({ loading: false });
    }
  };

  render() {
    const { orders, loading } = this.state;

    if (loading) return <p>Loading orders...</p>;
    if (orders.length === 0) return <p>No orders found.</p>;

    return (
      <>
        <Header />
        <div className="track-order-container">
          <h2 className="track-your-order">Track Your Orders</h2>
          {orders.map((order) => {
            const currentStatusIndex = statusSteps.indexOf(order.status);

            return (
              <div key={order.id} className="track-order-card">
                <h3 className='order-id'>Order ID: {order.id}</h3>
                <p className='details-heading'>Buyer Name: {order.buyer_name}</p>
                <p className='details-heading'>Contact: {order.buyer_contact}</p>
                <p className='details-heading'>Address: {order.delivery_address}</p>
                <div className="order-items">
                  <h4 className='order-id'>Items:</h4>
                  <ul className='items-list'>
                    {order.items.map((item, idx) => (
                      <li key={idx} className="item-row">
                        <img src={item.image_url} alt={item.title} className="item-img" />
                        <div className="item-details">
                          <p><strong>{item.title}</strong></p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ₹{item.price} per kg</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timeline */}
                <div className="timeline-container">
                  <div className="timeline-status">{statusSteps[currentStatusIndex]}</div>
                  <div className="timeline">
                    {statusSteps.map((status, index) => {
                      const isDone = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;

                      return (
                        <div
                          key={status}
                          className={`timeline-step ${
                            isDone ? 'done' : ''
                          } ${isCurrent ? 'current' : ''}`}
                        >
                          <div className="circle">
                            {isDone ? '✔' : ''}
                          </div>
                          <p className={isCurrent ? 'active-status' : ''}>
                            {status}
                          </p>
                          {index <= statusSteps.length - 1 && <div className="line"></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default TrackOrder;
