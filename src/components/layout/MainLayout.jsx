import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles = {
  '/': 'Dashboard',
  '/designs': 'Designs',
  '/designs/new': 'Add New Design',
  '/categories': 'Categories',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

const MainLayout = () => {
  // Check if screen is large (lg breakpoint)
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get page title based on current path
  const getPageTitle = () => {
    if (location.pathname.startsWith('/designs/') && location.pathname !== '/designs/new') {
      return 'Edit Design';
    }
    return pageTitles[location.pathname] || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle()}
        />

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
