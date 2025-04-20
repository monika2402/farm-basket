import React, { useState } from 'react';
import InventoryManagement from '../InventoryManagement';
import OrderManagement from '../OrderManagement'; // make sure this exists
import './index.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="admin-dashboard">
      <div className="tabs">
        <button
          className={activeTab === 'inventory' ? 'active' : ''}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory Management
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Order Management
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'inventory' && <InventoryManagement />}
        {activeTab === 'orders' && <OrderManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
