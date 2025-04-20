import React from 'react';
import './index.css';

class OrderCard extends React.Component {
  handleStatusChange = (event) => {
    const { order, onStatusChange } = this.props;
    const newStatus = event.target.value;
    onStatusChange(order.id, newStatus);
  };

  render() {
    const { order, statusUpdates, onDelete, onStatusUpdate } = this.props;
    const currentStatus = statusUpdates?.[order.id] || order.status || "Pending";

    return (
      <div className="order-card">
        <h3>Order ID: {order.id}</h3>
        <p><strong>Buyer Name:</strong> {order.buyerName}</p>
        <p><strong>Buyer Contact:</strong> {order.buyerContact}</p>
        <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>

        <p><strong>Items:</strong></p>
        <ul>
          {Array.isArray(order.items) && order.items.map((item, index) => (
            <li key={index} className="order-item">
              <img src={item.image_url} alt={item.name} className="item-image" />
              <span>{item.name} - Quantity: {item.quantity}</span>
            </li>
          ))}
        </ul>

        <p><strong>Status:</strong> {order.status}</p>

        <div className="status-update-section">
          <label htmlFor={`status-${order.id}`}>Change Status:</label>
          <select
            id={`status-${order.id}`}
            value={currentStatus}
            onChange={this.handleStatusChange}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Delivered">Delivered</option>
          </select>
          <button
            className="update-button"
            onClick={() => onStatusUpdate(order.id)}
          >
            Update
          </button>
        </div>

        <div className="order-buttons">
          <button
            className="delete-button"
            onClick={() => onDelete(order.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}

export default OrderCard;
