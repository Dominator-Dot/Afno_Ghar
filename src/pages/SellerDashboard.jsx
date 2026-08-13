import { useState, useEffect } from 'react';
import './SellerDashboard.css';

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    rentalAvailable: false,
    rentalPrice: ''
  });

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const [dashRes, invRes, ordRes, rentRes] = await Promise.all([
        fetch('http://localhost:5000/api/seller/dashboard', { credentials: 'include' }),
        fetch('http://localhost:5000/api/seller/inventory', { credentials: 'include' }),
        fetch('http://localhost:5000/api/seller/orders', { credentials: 'include' }),
        fetch('http://localhost:5000/api/seller/rentals', { credentials: 'include' })
      ]);

      if (!dashRes.ok || !invRes.ok || !ordRes.ok || !rentRes.ok) {
        throw new Error('Failed to fetch seller data');
      }

      const dashData = await dashRes.json();
      const invData = await invRes.json();
      const ordData = await ordRes.json();
      const rentData = await rentRes.json();

      setDashboardData(dashData);
      setInventory(invData);
      setOrders(ordData);
      setRentals(rentData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/seller/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        setShowAddProduct(false);
        setNewProduct({
          name: '',
          description: '',
          price: '',
          category: '',
          stock: '',
          rentalAvailable: false,
          rentalPrice: ''
        });
        fetchSellerData();
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/seller/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchSellerData();
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const handleVerifyRental = async (rentalId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/seller/rentals/${rentalId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchSellerData();
      }
    } catch (err) {
      console.error('Error verifying rental:', err);
    }
  };

  if (loading) return <div className="loading">Loading Seller Dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="seller-dashboard">
      <div className="seller-header">
        <h1>Seller Dashboard</h1>
        <p>Shop: {dashboardData?.vendor?.shop_name}</p>
        <p>Location: {dashboardData?.vendor?.location}</p>
      </div>

      {/* Overview Stats */}
      {activeTab === 'overview' && (
        <div className="seller-stats">
          <div className="stat-card">
            <h3>Products Listed</h3>
            <p className="stat-number">{dashboardData?.stats?.totalProducts || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-number">{dashboardData?.stats?.totalOrders || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Orders</h3>
            <p className="stat-number">{dashboardData?.stats?.pendingOrders || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Completed Orders</h3>
            <p className="stat-number">{dashboardData?.stats?.completedOrders || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">₹{dashboardData?.stats?.totalRevenue || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Rental Requests</h3>
            <p className="stat-number">{dashboardData?.stats?.totalRentals || 0}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="seller-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={`tab ${activeTab === 'rentals' ? 'active' : ''}`}
          onClick={() => setActiveTab('rentals')}
        >
          Rental Requests
        </button>
      </div>

      {/* Inventory Section */}
      {activeTab === 'inventory' && (
        <div className="seller-section">
          <div className="section-header">
            <h2>Current Inventory</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddProduct(!showAddProduct)}
            >
              {showAddProduct ? 'Cancel' : '+ Add Product'}
            </button>
          </div>

          {showAddProduct && (
            <form className="add-product-form" onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}>
                    <option value="">Select Category</option>
                    <option value="sofas">Sofas</option>
                    <option value="chairs">Chairs</option>
                    <option value="tables">Tables</option>
                    <option value="beds">Beds</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newProduct.rentalAvailable}
                      onChange={(e) => setNewProduct({...newProduct, rentalAvailable: e.target.checked})}
                    />
                    Available for Rental
                  </label>
                </div>
                {newProduct.rentalAvailable && (
                  <div className="form-group">
                    <label>Rental Price (₹/month)</label>
                    <input
                      type="number"
                      value={newProduct.rentalPrice}
                      onChange={(e) => setNewProduct({...newProduct, rentalPrice: e.target.value})}
                    />
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary">Add Product</button>
            </form>
          )}

          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Rental</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.category}</td>
                  <td>{product.rental_available ? '✓' : '-'}</td>
                  <td>
                    <button className="btn btn-small">Edit</button>
                    <button className="btn btn-small">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Section */}
      {activeTab === 'orders' && (
        <div className="seller-section">
          <h2>Orders</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>User {order.user_id}</td>
                  <td>₹{order.total_price}</td>
                  <td>
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${order.payment_status}`}>
                      {order.payment_method}
                    </span>
                  </td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-small">Track</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rentals Section */}
      {activeTab === 'rentals' && (
        <div className="seller-section">
          <h2>Rental Requests</h2>
          <table className="rentals-table">
            <thead>
              <tr>
                <th>Rental ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Location</th>
                <th>Verification</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map(rental => (
                <tr key={rental.id}>
                  <td>#{rental.id}</td>
                  <td>User {rental.user_id}</td>
                  <td>Product {rental.product_id}</td>
                  <td>{rental.rental_location}</td>
                  <td>
                    <span className={`badge ${rental.verification_status}`}>
                      {rental.verification_status}
                    </span>
                  </td>
                  <td>
                    {rental.verification_status === 'pending' && (
                      <>
                        <button 
                          className="btn btn-small"
                          onClick={() => handleVerifyRental(rental.id, 'approved')}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-small danger"
                          onClick={() => handleVerifyRental(rental.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
