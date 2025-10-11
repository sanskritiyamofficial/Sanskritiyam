import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGetAuth } from '../contexts/useGetAuth';
import { FaBars, FaTimes, FaHome } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useGetAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActiveLink = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname === path;
  };

  const getLinkClass = (path) => {
    return `w-full text-left px-4 py-2 rounded-lg transition block ${
      isActiveLink(path)
        ? 'bg-orange-100 text-orange-800' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin</h1>
                <p className="text-xs text-gray-600">Dashboard</p>
              </div>
            </div>
            <Link
              to="/"
              className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition text-sm"
            >
              <FaHome className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="bg-white shadow hidden lg:block">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage Pujas, Chadhavas, and Orders</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {currentUser?.email}</span>
              <Link
                to="/"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg min-h-screen transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4">
            <div className="space-y-2">
              <Link
                to="/admin/dashboard"
                className={getLinkClass('/admin/dashboard')}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-tachometer-alt mr-2"></i>
                Overview
              </Link>
              <Link
                to="/admin/orders"
                className={getLinkClass('/admin/orders')}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-shopping-bag mr-2"></i>
                Orders
              </Link>
              <Link
                to="/admin/donations"
                className={getLinkClass('/admin/donations')}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-donate mr-2"></i>
                Donations
              </Link>
              <button
                className="w-full text-left px-4 py-2 rounded-lg transition text-gray-600 hover:bg-gray-100"
                disabled
              >
                <i className="fas fa-om mr-2"></i>
                Pujas
              </button>
              <Link
                to="/admin/blogs"
                className={getLinkClass('/admin/blogs')}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="fas fa-blog mr-2"></i>
                Blog Management
              </Link>
              <button
                className="w-full text-left px-4 py-2 rounded-lg transition text-gray-600 hover:bg-gray-100"
                disabled
              >
                <i className="fas fa-gift mr-2"></i>
                Chadhavas
              </button>
              <button
                className="w-full text-left cursor-pointer px-4 py-2 rounded-lg transition text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  logout();
                  setSidebarOpen(false);
                }}
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
