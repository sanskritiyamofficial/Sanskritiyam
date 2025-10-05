import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getAllOrders,
  getOrdersByStatus,
  getOrderStatistics,
  updateOrderStatus,
  ORDER_STATUS,
} from "../../firebase/orderService";
import { formatOrderForDisplay } from "../../firebase/orderUtils";
import * as XLSX from 'xlsx';

const OrderDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [exportLoading, setExportLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      let ordersData;

      if (selectedStatus === "all") {
        ordersData = await getAllOrders();
      } else {
        ordersData = await getOrdersByStatus(selectedStatus);
      }

      setOrders(ordersData.map(formatOrderForDisplay));
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  const loadStatistics = useCallback(async () => {
    try {
      const stats = await getOrderStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadStatistics();
  }, [loadOrders, loadStatistics]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
      await loadStatistics();
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out");
    }
  };

  const filterOrdersByDateRange = (orders, startDate, endDate) => {
    if (!startDate && !endDate) return orders;
    
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');
      
      return orderDate >= start && orderDate <= end;
    });
  };

  const exportToExcel = async () => {
    try {
      setExportLoading(true);
      
      // Get all orders for export (not just filtered ones)
      let allOrdersData;
      if (selectedStatus === "all") {
        allOrdersData = await getAllOrders();
      } else {
        allOrdersData = await getOrdersByStatus(selectedStatus);
      }
      
      const formattedOrders = allOrdersData.map(formatOrderForDisplay);
      
      // Filter by date range if specified
      const filteredOrders = filterOrdersByDateRange(
        formattedOrders, 
        dateRange.startDate, 
        dateRange.endDate
      );
      
      if (filteredOrders.length === 0) {
        alert("No orders found for the selected criteria.");
        return;
      }
      
      // Prepare data for Excel
      const excelData = filteredOrders.map(order => ({
        'Order Number': order.orderNumber,
        'Order Date': order.createdAt,
        'Customer Name': order.customer?.name || '',
        'Customer Email': order.customer?.email || '',
        'Customer Phone': order.customer?.phone || '',
        'Customer Gotra': order.customer?.gotra || '',
        'Temple Name': order.temple?.name || '',
        'Temple Location': order.temple?.location || '',
        'Package Name': order.package?.name || '',
        'Package Price': order.package?.price || 0,
        'Total Amount': order.totalAmount || 0,
        'Status': order.statusText || '',
        'Items Count': order.itemsCount || 0,
        'Items Details': order.items?.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ') || ''
      }));
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths
      const colWidths = [
        { wch: 15 }, // Order Number
        { wch: 20 }, // Order Date
        { wch: 20 }, // Customer Name
        { wch: 30 }, // Customer Email
        { wch: 15 }, // Customer Phone
        { wch: 15 }, // Customer Gotra
        { wch: 25 }, // Temple Name
        { wch: 30 }, // Temple Location
        { wch: 25 }, // Package Name
        { wch: 15 }, // Package Price
        { wch: 15 }, // Total Amount
        { wch: 15 }, // Status
        { wch: 10 }, // Items Count
        { wch: 50 }  // Items Details
      ];
      ws['!cols'] = colWidths;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Orders');
      
      // Generate filename with date range
      const startDateStr = dateRange.startDate ? `_from_${dateRange.startDate}` : '';
      const endDateStr = dateRange.endDate ? `_to_${dateRange.endDate}` : '';
      const statusStr = selectedStatus !== 'all' ? `_${selectedStatus}` : '';
      const filename = `Orders_Export${statusStr}${startDateStr}${endDateStr}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Save file
      XLSX.writeFile(wb, filename);
      
      setShowExportModal(false);
      alert(`Successfully exported ${filteredOrders.length} orders to Excel!`);
      
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting to Excel. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Order Dashboard
            </h1>
            
            {/* User Menu */}
            <div className="relative user-menu">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-700">
                    {currentUser?.displayName || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.email}
                  </p>
                </div>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{currentUser?.displayName || 'Admin'}</p>
                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-600">
                Total Orders
              </h3>
              <p className="text-3xl font-bold text-orange-600">
                {statistics.total}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-600">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {statistics.pending}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-600">Completed</h3>
              <p className="text-3xl font-bold text-green-600">
                {statistics.completed}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-600">
                Total Revenue
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                ₹{statistics.totalRevenue?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}

        {/* Filter and Actions */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button
              onClick={loadOrders}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
            >
              Refresh
            </button>
            {orders.length > 0 && (
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export to Excel
              </button>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temple & Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.createdAt}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer?.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer?.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.temple?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.package?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.itemsCount} items
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.formattedAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.statusText}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          View
                        </button>
                        {order.status === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "confirmed")
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Confirm
                          </button>
                        )}
                        {order.status === "confirmed" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "in_progress")
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Start
                          </button>
                        )}
                        {order.status === "in_progress" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "completed")
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Details - {selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">
                    Customer Information
                  </h4>
                  <p>
                    <strong>Name:</strong> {selectedOrder.customer?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.customer?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.customer?.phone}
                  </p>
                  <p>
                    <strong>Gotra:</strong> {selectedOrder.customer?.gotra}
                  </p>
                  {selectedOrder.customer?.address && (
                    <div>
                      <strong>Address:</strong>
                      <p className="ml-4">
                        {selectedOrder.customer.address.street}
                      </p>
                      <p className="ml-4">
                        {selectedOrder.customer.address.city},{" "}
                        {selectedOrder.customer.address.state} -{" "}
                        {selectedOrder.customer.address.pincode}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">
                    Temple & Package
                  </h4>
                  <p>
                    <strong>Temple:</strong> {selectedOrder.temple?.name}
                  </p>
                  <p>
                    <strong>Location:</strong> {selectedOrder.temple?.location}
                  </p>
                  <p>
                    <strong>Package:</strong> {selectedOrder.package?.name}
                  </p>
                  <p>
                    <strong>Package Price:</strong> ₹
                    {selectedOrder.package?.price}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between border-b pb-2"
                      >
                        <span>
                          {item.name} (Qty: {item.quantity})
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="font-bold text-lg mt-2">
                    Total: {selectedOrder.formattedAmount}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">Order Status</h4>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.statusText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Export Orders to Excel
                </h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Export includes:</strong> Order details, customer information, temple & package details, items, and status.
                    <br />
                    <strong>Current filter:</strong> {selectedStatus === 'all' ? 'All orders' : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} orders
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={exportToExcel}
                    disabled={exportLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {exportLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export to Excel
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDashboard;
