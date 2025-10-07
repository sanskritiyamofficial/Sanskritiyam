import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGetAuth } from '../contexts/useGetAuth';

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useGetAuth();
  const location = useLocation();

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
      {/* Header */}
      <div className="bg-white shadow">
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
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              <Link
                to="/admin/dashboard"
                className={getLinkClass('/admin/dashboard')}
              >
                <i className="fas fa-tachometer-alt mr-2"></i>
                Overview
              </Link>
              <Link
                to="/admin/orders"
                className={getLinkClass('/admin/orders')}
              >
                <i className="fas fa-shopping-bag mr-2"></i>
                Orders
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
              {/* <button
                className="w-full text-left px-4 py-2 rounded-lg transition text-gray-600 hover:bg-gray-100"
                disabled
              >
                <i className="fas fa-users mr-2"></i>
                Users
              </button> */}
              <button
                className="w-full text-left cursor-pointer px-4 py-2 rounded-lg transition text-gray-600 hover:bg-gray-100"
                disabled
                onClick={() => logout()}
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
