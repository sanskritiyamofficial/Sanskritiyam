import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAuth } from '../../contexts/useGetAuth';
import { getAllOrders, getOrderStatistics } from '../../firebase/orderService';
import AdminLayout from '../../components/AdminLayout';
import { FaRupeeSign } from "react-icons/fa";

const AdminDashboard = () => {
  const { currentUser, isAdmin } = useGetAuth();
  const [activeTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    loadDashboardData();
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        getAllOrders(50),
        getOrderStatistics()
      ]);
      setOrders(ordersData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4 lg:space-y-6">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              
              {/* Statistics Cards */}
              {statistics && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <i className="fas fa-shopping-bag text-blue-600 text-lg lg:text-xl"></i>
                      </div>
                      <div className="ml-3 lg:ml-4">
                        <p className="text-xs lg:text-sm text-gray-600">Total Orders</p>
                        <p className="text-lg lg:text-2xl font-bold text-gray-900">{statistics.total}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <i className="fas fa-check-circle text-green-600 text-lg lg:text-xl"></i>
                      </div>
                      <div className="ml-3 lg:ml-4">
                        <p className="text-xs lg:text-sm text-gray-600">Completed</p>
                        <p className="text-lg lg:text-2xl font-bold text-gray-900">{statistics.completed}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <i className="fas fa-clock text-yellow-600 text-lg lg:text-xl"></i>
                      </div>
                      <div className="ml-3 lg:ml-4">
                        <p className="text-xs lg:text-sm text-gray-600">Pending</p>
                        <p className="text-lg lg:text-2xl font-bold text-gray-900">{statistics.pending}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 lg:p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FaRupeeSign className="text-orange-600 text-lg lg:text-xl" />
                      </div>
                      <div className="ml-3 lg:ml-4">
                        <p className="text-xs lg:text-sm text-gray-600">Total Revenue</p>
                        <p className="text-lg lg:text-2xl font-bold text-gray-900">₹{statistics.totalRevenue?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                </div>
                <div className="p-6">
                  {orders.slice(0, 5).map((order, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{order.eventName}</p>
                        <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">₹{order.totalAmount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Orders</h2>
                <Link
                  to="/admin/orders"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  View All Orders
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.eventName}</div>
                            <div className="text-sm text-gray-500">#{order.orderNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customer?.name}</div>
                          <div className="text-sm text-gray-500">{order.customer?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{order.totalAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pujas Tab */}
          {activeTab === 'pujas' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Puja Management</h2>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                  Add New Puja
                </button>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Puja management features will be implemented here.</p>
              </div>
            </div>
          )}

          {/* Chadhavas Tab */}
          {activeTab === 'chadhavas' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Chadhava Management</h2>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                  Add New Chadhava
                </button>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Chadhava management features will be implemented here.</p>
              </div>
            </div>
          )}

          {/* Blogs Tab */}
          {activeTab === 'blogs' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                  Add New Blog
                </button>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Blog management features will be implemented here.</p>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">User management features will be implemented here.</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">System settings will be implemented here.</p>
              </div>
            </div>
          )}
    </AdminLayout>
  );
};

export default AdminDashboard;
