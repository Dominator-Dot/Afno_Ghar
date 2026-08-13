import { useState, useEffect } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, vendorsRes, buyersRes, ordersRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/dashboard/stats', { credentials: 'include' }),
        fetch('http://localhost:5000/api/admin/vendors', { credentials: 'include' }),
        fetch('http://localhost:5000/api/admin/users', { credentials: 'include' }),
        fetch('http://localhost:5000/api/admin/orders', { credentials: 'include' })
      ]);

      if (!statsRes.ok || !vendorsRes.ok || !buyersRes.ok || !ordersRes.ok) {
        throw new Error('Failed to fetch admin data');
      }

      const statsData = await statsRes.json();
      const vendorsData = await vendorsRes.json();
      const buyersData = await buyersRes.json();
      const ordersData = await ordersRes.json();

      setStats(statsData);
      setVendors(vendorsData);
      setBuyers(buyersData.filter(user => user.role === 'buyer'));
      setOrders(ordersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVendor = async (vendorId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/vendors/${vendorId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error verifying vendor:', err);
    }
  };

  if (loading) return <div className="loading">Loading Admin Dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage vendors, buyers, and monitor platform activity</p>
      </div>

      {/* Overview Cards */}
      {activeTab === 'overview' && (
        <div className="overview-cards">
          <div className="card">
            <h3>Total Vendors</h3>
            <p className="stat-number">{stats?.total_sellers || 0}</p>
          </div>
          <div className="card">
            <h3>Total Buyers</h3>
            <p className="stat-number">{stats?.total_buyers || 0}</p>
          </div>
          <div className="card">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats?.total_orders || 0}</p>
          </div>
          <div className="card">
            <h3>Total Revenue</h3>
            <p className="stat-number">₹{stats?.total_revenue || 0}</p>
          </div>
          <div className="card">
            <h3>Active Rentals</h3>
            <p className="stat-number">{stats?.total_rentals || 0}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'vendors' ? 'active' : ''}`}
          onClick={() => setActiveTab('vendors')}
        >
          Vendors
        </button>
        <button 
          className={`tab ${activeTab === 'buyers' ? 'active' : ''}`}
          onClick={() => setActiveTab('buyers')}
        >
          Buyers
        </button>
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {/* Vendors Section */}
      {activeTab === 'vendors' && (
        <div className="admin-section">
          <h2>Vendor Management</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Shop Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Products</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(vendor => (
                <tr key={vendor.id}>
                  <td>{vendor.shop_name}</td>
                  <td>{vendor.location}</td>
                  <td>
                    <span className={`badge ${vendor.is_verified ? 'verified' : 'pending'}`}>
                      {vendor.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>0</td>
                  <td>
                    {!vendor.is_verified && (
                      <button 
                        className="btn btn-small"
                        onClick={() => handleVerifyVendor(vendor.id)}
                      >
                        Verify
                      </button>
                    )}
                    <button className="btn btn-small">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Buyers Section */}
      {activeTab === 'buyers' && (
        <div className="admin-section">
          <h2>Buyer Management</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Join Date</th>
                <th>Total Orders</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map(buyer => (
                <tr key={buyer.id}>
                  <td>{buyer.email}</td>
                  <td>{new Date(buyer.created_at).toLocaleDateString()}</td>
                  <td>0</td>
                  <td>
                    <button className="btn btn-small">View Orders</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Section */}
      {activeTab === 'orders' && (
        <div className="admin-section">
          <h2>All Orders</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>User {order.user_id}</td>
                  <td>Vendor {order.seller_id}</td>
                  <td>₹{order.total_price}</td>
                  <td>
                    <span className={`badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${order.payment_status}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
