import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab: propActiveTab, setActiveTab }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActiveLink = (path: string) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname === path;
  };

  const activeTab = useMemo(() => {
    // If props are provided (for AdminDashboard with internal tabs), use them
    if (propActiveTab) return propActiveTab;
    
    // Otherwise, determine active tab from location
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const adminIndex = pathSegments.indexOf('admin');
    
    if (adminIndex === -1) return 'overview';
    
    // Get the segment after 'admin'
    const tab = pathSegments[adminIndex + 1];
    
    // Map specific routes to tab names
    if (tab === 'dashboard' || tab === '') return 'overview';
    if (tab === 'blogs') return 'blog-management';
    if (tab === 'orders') return 'orders';
    
    return tab || 'overview';
  }, [location.pathname, propActiveTab]);

  const handleTabClick = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab);
    } else {
      navigate(`/admin/${tab}`);
    }
  };

  const getButtonClass = (tab: string) => {
    return `w-full text-left px-4 py-2 rounded-lg transition ${
      activeTab === tab 
        ? 'bg-orange-100 text-orange-800' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;
  };

  const getLinkClass = (path: string) => {
    return `w-full text-left px-4 py-2 rounded-lg transition block ${
      isActiveLink(path)
        ? 'bg-orange-100 text-orange-800' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;
  };

  return (
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
            onClick={() => handleTabClick('pujas')}
            className={getButtonClass('pujas')}
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
            onClick={() => handleTabClick('chadhavas')}
            className={getButtonClass('chadhavas')}
          >
            <i className="fas fa-gift mr-2"></i>
            Chadhavas
          </button>
          <button
            onClick={() => handleTabClick('blogs')}
            className={getButtonClass('blogs')}
          >
            <i className="fas fa-blog mr-2"></i>
            Blogs
          </button>
          <button
            onClick={() => handleTabClick('users')}
            className={getButtonClass('users')}
          >
            <i className="fas fa-users mr-2"></i>
            Users
          </button>
          <button
            onClick={() => handleTabClick('settings')}
            className={getButtonClass('settings')}
          >
            <i className="fas fa-cog mr-2"></i>
            Settings
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
