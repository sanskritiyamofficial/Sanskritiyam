import React, { useState, useEffect, useCallback } from "react";
import {
  getAllOrders,
  getOrdersByStatus,
  getOrderStatistics,
  updateOrderStatus,
  ORDER_STATUS,
} from "../../firebase/orderService";
import { formatOrderForDisplay } from "../../firebase/orderUtils";
import AdminLayout from "../../components/AdminLayout";
import * as XLSX from "xlsx";

const OrderDashboard = () => {
  // const { } = useGetAuth(); // Not needed for this component
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [exportLoading, setExportLoading] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    userWise: false,
    mandirWise: false,
    eventWise: false,
    selectedUser: "",
    selectedMandir: "",
    selectedEvent: "",
  });
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [uniqueMandirs, setUniqueMandirs] = useState([]);
  const [uniqueEvents, setUniqueEvents] = useState([]);

  const extractUniqueValues = useCallback((orders) => {
    const users = [
      ...new Set(orders.map((order) => order.customer?.email).filter(Boolean)),
    ];
    const mandirs = [
      ...new Set(orders.map((order) => order.temple?.name).filter(Boolean)),
    ];
    const events = [
      ...new Set(orders.map((order) => order.package?.name).filter(Boolean)),
    ];

    setUniqueUsers(users);
    setUniqueMandirs(mandirs);
    setUniqueEvents(events);
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      let ordersData;

      if (selectedStatus === "all") {
        ordersData = await getAllOrders();
      } else {
        ordersData = await getOrdersByStatus(selectedStatus);
      }

      const formattedOrders = ordersData.map(formatOrderForDisplay);
      setOrders(formattedOrders);
      extractUniqueValues(formattedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, extractUniqueValues]);

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
      if (showUserMenu && !event.target.closest(".user-menu")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

  const filterOrdersByDateRange = (orders, startDate, endDate) => {
    if (!startDate && !endDate) return orders;

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const start = startDate ? new Date(startDate) : new Date("1900-01-01");
      const end = endDate ? new Date(endDate) : new Date("2100-12-31");

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

      // Apply filters
      let filteredOrders = formattedOrders;

      // Filter by date range if specified
      filteredOrders = filterOrdersByDateRange(
        filteredOrders,
        dateRange.startDate,
        dateRange.endDate
      );

      // Apply user-wise filter
      if (exportFilters.userWise && exportFilters.selectedUser) {
        filteredOrders = filteredOrders.filter(
          (order) => order.customer?.email === exportFilters.selectedUser
        );
      }

      // Apply mandir-wise filter
      if (exportFilters.mandirWise && exportFilters.selectedMandir) {
        filteredOrders = filteredOrders.filter(
          (order) => order.temple?.name === exportFilters.selectedMandir
        );
      }

      // Apply event-wise filter
      if (exportFilters.eventWise && exportFilters.selectedEvent) {
        filteredOrders = filteredOrders.filter(
          (order) => order.package?.name === exportFilters.selectedEvent
        );
      }

      if (filteredOrders.length === 0) {
        alert("No orders found for the selected criteria.");
        return;
      }

      // Prepare data for Excel
      const excelData = filteredOrders.map((order) => ({
        "Order Number": order.orderNumber,
        "Order Date": order.createdAt,
        "Customer Name": order.customer?.name || "",
        "Customer Email": order.customer?.email || "",
        "Customer Phone": order.customer?.phone || "",
        "Customer Gotra": order.customer?.gotra || "",
        "Temple Name": order.temple?.name || "",
        "Temple Location": order.temple?.location || "",
        "Package Name": order.package?.name || "",
        "Package Price": order.package?.price || 0,
        "Total Amount": order.totalAmount || 0,
        Status: order.statusText || "",
        "Items Count": order.itemsCount || 0,
        "Items Details":
          order.items
            ?.map((item) => `${item.name} (Qty: ${item.quantity})`)
            .join(", ") || "",
        "Family Members":
          order.familyMembers
            ?.map((member) => `${member.name} (${member.relation})`)
            .join(", ") || "",
        "Additional Names": order.additionalNames || "",
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
        { wch: 50 }, // Items Details
        { wch: 30 }, // Family Members
        { wch: 30 }, // Additional Names
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Orders");

      // Generate filename with filters
      let filename = "Orders_Export";
      if (dateRange.startDate) filename += `_from_${dateRange.startDate}`;
      if (dateRange.endDate) filename += `_to_${dateRange.endDate}`;
      if (selectedStatus !== "all") filename += `_${selectedStatus}`;
      if (exportFilters.userWise && exportFilters.selectedUser) {
        const userEmail = exportFilters.selectedUser.split("@")[0];
        filename += `_user_${userEmail}`;
      }
      if (exportFilters.mandirWise && exportFilters.selectedMandir) {
        const mandirName = exportFilters.selectedMandir.replace(/\s+/g, "_");
        filename += `_mandir_${mandirName}`;
      }
      if (exportFilters.eventWise && exportFilters.selectedEvent) {
        const eventName = exportFilters.selectedEvent.replace(/\s+/g, "_");
        filename += `_event_${eventName}`;
      }
      filename += `_${new Date().toISOString().split("T")[0]}.xlsx`;

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
    <AdminLayout>
      <div className="space-y-4 lg:space-y-6">
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <h3 className="text-sm lg:text-lg font-semibold text-gray-600">
                Total Orders
              </h3>
              <p className="text-2xl lg:text-3xl font-bold text-orange-600">
                {statistics.total}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <h3 className="text-sm lg:text-lg font-semibold text-gray-600">
                Pending
              </h3>
              <p className="text-2xl lg:text-3xl font-bold text-yellow-600">
                {statistics.pending}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <h3 className="text-sm lg:text-lg font-semibold text-gray-600">
                Completed
              </h3>
              <p className="text-2xl lg:text-3xl font-bold text-green-600">
                {statistics.completed}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 lg:p-6">
              <h3 className="text-sm lg:text-lg font-semibold text-gray-600">
                Total Revenue
              </h3>
              <p className="text-2xl lg:text-3xl font-bold text-blue-600">
                ₹{statistics.totalRevenue?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}

        {/* Filter and Actions */}
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadOrders}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex-1 sm:flex-none"
              >
                Refresh
              </button>
              {orders.length > 0 && (
                <button
                  onClick={() => setShowExportModal(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2 flex-1 sm:flex-none"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Export to Excel</span>
                  <span className="sm:hidden">Export</span>
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
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Customer
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Temple & Package
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.createdAt}
                          </div>
                          {/* Show customer info on mobile */}
                          <div className="sm:hidden mt-1">
                            <div className="text-xs text-gray-500">
                              {order.customer?.name} - {order.customer?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
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
                      <td className="px-3 lg:px-6 py-4 hidden md:table-cell">
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
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.formattedAmount}
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.statusText}
                        </span>
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-orange-600 hover:text-orange-900 text-xs sm:text-sm"
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
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
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

              <div className="space-y-6">
                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
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
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Filter Options */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">
                    Export Filters
                  </h4>

                  {/* User-wise Filter */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="userWise"
                      checked={exportFilters.userWise}
                      onChange={(e) =>
                        setExportFilters((prev) => ({
                          ...prev,
                          userWise: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="userWise"
                      className="text-sm font-medium text-gray-700"
                    >
                      Export by specific user
                    </label>
                  </div>

                  {exportFilters.userWise && (
                    <div className="ml-7">
                      <select
                        value={exportFilters.selectedUser}
                        onChange={(e) =>
                          setExportFilters((prev) => ({
                            ...prev,
                            selectedUser: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select User</option>
                        {uniqueUsers.map((user, index) => (
                          <option key={index} value={user}>
                            {user}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Mandir-wise Filter */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="mandirWise"
                      checked={exportFilters.mandirWise}
                      onChange={(e) =>
                        setExportFilters((prev) => ({
                          ...prev,
                          mandirWise: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="mandirWise"
                      className="text-sm font-medium text-gray-700"
                    >
                      Export by specific temple
                    </label>
                  </div>

                  {exportFilters.mandirWise && (
                    <div className="ml-7">
                      <select
                        value={exportFilters.selectedMandir}
                        onChange={(e) =>
                          setExportFilters((prev) => ({
                            ...prev,
                            selectedMandir: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Temple</option>
                        {uniqueMandirs.map((mandir, index) => (
                          <option key={index} value={mandir}>
                            {mandir}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Event-wise Filter */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="eventWise"
                      checked={exportFilters.eventWise}
                      onChange={(e) =>
                        setExportFilters((prev) => ({
                          ...prev,
                          eventWise: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="eventWise"
                      className="text-sm font-medium text-gray-700"
                    >
                      Export by specific event/puja
                    </label>
                  </div>

                  {exportFilters.eventWise && (
                    <div className="ml-7">
                      <select
                        value={exportFilters.selectedEvent}
                        onChange={(e) =>
                          setExportFilters((prev) => ({
                            ...prev,
                            selectedEvent: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select Event</option>
                        {uniqueEvents.map((event, index) => (
                          <option key={index} value={event}>
                            {event}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Export includes:</strong> Order details, customer
                    information, temple & package details, items, family
                    members, and status.
                    <br />
                    <strong>Current filter:</strong>{" "}
                    {selectedStatus === "all"
                      ? "All orders"
                      : selectedStatus.charAt(0).toUpperCase() +
                        selectedStatus.slice(1)}{" "}
                    orders
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
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
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
    </AdminLayout>
  );
};

export default OrderDashboard;
