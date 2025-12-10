import { HiBars3, HiBell, HiMagnifyingGlass } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const Header = ({ onMenuClick, title = 'Dashboard' }) => {
  return (
    <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            <HiBars3 className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors hidden sm:flex"
          >
            <HiMagnifyingGlass className="w-5 h-5" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <HiBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
          </motion.button>

          {/* Profile */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm">A</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-500">admin@figma.market</p>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
