import React, { useState, useEffect, useCallback } from "react";
import {
  getAllDonations,
  getDonationStatistics,
  updateDonationStatus,
  DONATION_STATUS,
} from "../../firebase/donationService";
import { syncLocalDonations, getLocalDonationsCount } from "../../firebase/syncService";
import NotificationTest from "../../components/NotificationTest";
import { FaEye, FaEdit, FaTrash, FaFilter, FaDownload, FaSync, FaBell } from "react-icons/fa";

const DonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [localDonationsCount, setLocalDonationsCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [showNotificationTest, setShowNotificationTest] = useState(false);

  useEffect(() => {
    loadDonations();
    loadStatistics();
    checkLocalDonations();
  }, []);

  const checkLocalDonations = () => {
    const count = getLocalDonationsCount();
    setLocalDonationsCount(count);
  };

  useEffect(() => {
    filterDonations();
  }, [filterDonations]);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const donationsData = await getAllDonations(100);
      setDonations(donationsData);
    } catch (error) {
      console.error("Error loading donations:", error);
      alert("Error loading donations");
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getDonationStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  };

  const filterDonations = useCallback(() => {
    let filtered = donations;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((donation) => donation.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (donation) =>
          donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.templeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.typeName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDonations(filtered);
  }, [donations, filterStatus, searchTerm]);

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      await updateDonationStatus(donationId, newStatus);
      await loadDonations();
      alert("Donation status updated successfully");
    } catch (error) {
      console.error("Error updating donation status:", error);
      alert("Error updating donation status");
    }
  };

  const handleSyncLocalDonations = async () => {
    try {
      setSyncing(true);
      const result = await syncLocalDonations();
      
      if (result.synced > 0) {
        alert(`Successfully synced ${result.synced} local donations to Firebase`);
        await loadDonations();
        checkLocalDonations();
      } else if (result.failed > 0) {
        alert(`Failed to sync ${result.failed} donations. Please check Firebase permissions.`);
      } else {
        alert("No local donations to sync");
      }
    } catch (error) {
      console.error("Error syncing local donations:", error);
      alert("Error syncing local donations");
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const exportDonations = () => {
    const csvContent = [
      ["Donor Name", "Email", "Phone", "Type", "Temple", "Amount", "Status", "Date"],
      ...filteredDonations.map((donation) => [
        donation.donorName || "",
        donation.donorEmail || "",
        donation.donorPhone || "",
        donation.typeName || "",
        donation.templeName || "",
        donation.amount || 0,
        donation.status || "",
        formatDate(donation.createdAt),
      ]),
    ].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
          Donation Management
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          Manage and track all temple donations
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaEye className="text-blue-600 text-lg lg:text-xl" />
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">{statistics.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-lg lg:text-xl font-bold">₹</span>
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                ₹{statistics.totalAmount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-lg lg:text-xl font-bold">⏳</span>
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Pending</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">{statistics.pending || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-lg lg:text-xl font-bold">✓</span>
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Completed</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">{statistics.completed || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-600 text-lg lg:text-xl font-bold">✗</span>
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">{statistics.cancelled || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 lg:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {localDonationsCount > 0 && (
              <button
                onClick={handleSyncLocalDonations}
                disabled={syncing}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex-1 sm:flex-none"
              >
                <FaSync className={syncing ? "animate-spin" : ""} />
                <span className="hidden sm:inline">
                  {syncing ? "Syncing..." : `Sync Local (${localDonationsCount})`}
                </span>
                <span className="sm:hidden">
                  {syncing ? "Syncing..." : `Sync (${localDonationsCount})`}
                </span>
              </button>
            )}
            <button
              onClick={() => setShowNotificationTest(!showNotificationTest)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex-1 sm:flex-none"
            >
              <FaBell />
              <span className="hidden sm:inline">
                {showNotificationTest ? 'Hide Test' : 'Test Notifications'}
              </span>
              <span className="sm:hidden">
                {showNotificationTest ? 'Hide' : 'Test'}
              </span>
            </button>
            <button
              onClick={exportDonations}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex-1 sm:flex-none"
            >
              <FaDownload />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Test */}
      {showNotificationTest && (
        <div className="mb-8">
          <NotificationTest />
        </div>
      )}

      {/* Donations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Type
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Temple
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {donation.donorName || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {donation.donorEmail || "N/A"}
                      </div>
                      {/* Show type and temple on mobile */}
                      <div className="sm:hidden mt-1">
                        <div className="text-xs text-gray-500">
                          {donation.typeName} - {donation.templeName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-900">
                      {donation.typeName || "N/A"}
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-900">
                      {donation.templeName || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {donation.templeLocation || "N/A"}
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{donation.amount?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(donation.status)}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {formatDate(donation.createdAt)}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <button
                        onClick={() => {
                          setSelectedDonation(donation);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                      >
                        <FaEye />
                      </button>
                      <select
                        value={donation.status}
                        onChange={(e) => handleStatusUpdate(donation.id, e.target.value)}
                        className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDonations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No donations found</p>
          </div>
        )}
      </div>

      {/* Donation Detail Modal */}
      {showModal && selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Donation Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Donor Name</label>
                  <p className="text-sm text-gray-900">{selectedDonation.donorName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{selectedDonation.donorEmail || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm text-gray-900">{selectedDonation.donorPhone || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-sm text-gray-900">₹{selectedDonation.amount?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-sm text-gray-900">{selectedDonation.typeName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedDonation.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Temple</label>
                  <p className="text-sm text-gray-900">{selectedDonation.templeName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-sm text-gray-900">{selectedDonation.templeLocation || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Offering Date</label>
                  <p className="text-sm text-gray-900">{selectedDonation.offeringDate || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedDonation.createdAt)}</p>
                </div>
              </div>

              {selectedDonation.donorMessage && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Message</label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded">
                    {selectedDonation.donorMessage}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationManagement;
