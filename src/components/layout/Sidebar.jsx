import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlinePlusCircle,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineTag,
  HiKey,
  HiXMark,
} from 'react-icons/hi2';

const menuItems = [
  {
    path: '/',
    icon: HiOutlineHome,
    label: 'Dashboard',
  },
  {
    path: '/designs',
    icon: HiOutlineSquares2X2,
    label: 'Designs',
  },
  {
    path: '/designs/new',
    icon: HiOutlinePlusCircle,
    label: 'Add Design',
  },
  {
    path: '/categories',
    icon: HiOutlineTag,
    label: 'Categories',
  },
  {
    path: '/analytics',
    icon: HiOutlineChartBar,
    label: 'Analytics',
  },
  {
    path: '/settings',
    icon: HiOutlineCog6Tooth,
    label: 'Settings',
  },
  {
    path: '/access-token',
    icon: HiKey,
    label: 'Access Token',
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px]
          bg-gradient-to-b from-gray-900/95 to-gray-950/95
          backdrop-blur-xl border-r border-white/10
          flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Figma Market</h1>
              <span className="text-xs text-gray-500">Admin Panel</span>
            </div>
          </NavLink>
          
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => !isDesktop && onClose()}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-500/20 to-indigo-500/20 text-white border border-violet-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : ''}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
            <p className="text-xs text-gray-400">Version 1.0.0</p>
            <p className="text-xs text-violet-400">Development Mode</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
