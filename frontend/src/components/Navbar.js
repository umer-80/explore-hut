import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { toast } from 'react-toastify';
import { 
  FiHome, 
  FiPlusCircle, 
  FiUser, 
  FiLogOut, 
  FiLogIn, 
  FiUserPlus,
  FiMenu,
  FiX,
  FiUsers,
  FiSearch
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { activeUsers } = useSocket();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navItems = user
    ? [
        { to: '/', icon: FiHome, label: 'Home' },
        { to: '/search', icon: FiSearch, label: 'Search' },
        { to: '/create-listing', icon: FiPlusCircle, label: 'Add Listing' },
      ]
    : [
        { to: '/', icon: FiHome, label: 'Home' },
        { to: '/search', icon: FiSearch, label: 'Search' },
      ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/50 shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-3xl"
            >
              🏠
            </motion.div>
            <span className="text-2xl font-bold gradient-text">
              Explore Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Active Users Counter */}
            {activeUsers > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-full border border-emerald-500/30"
              >
                <FiUsers className="text-emerald-400" />
                <span className="text-sm font-medium text-slate-300">
                  {activeUsers} online
                </span>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </motion.div>
            )}

            {/* Nav Links */}
            {navItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.to}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 transition-all duration-300"
                >
                  <item.icon className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            ))}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <FiUser className="text-emerald-400" />
                  <span className="text-sm font-medium text-slate-300">
                    {user.username}
                  </span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-600/30 transition-all duration-300"
                >
                  <FiLogOut />
                  <span className="font-medium">Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-emerald-400 transition-all duration-300"
                  >
                    <FiLogIn />
                    <span className="font-medium">Login</span>
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FiUserPlus />
                    <span>Sign Up</span>
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800/50"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-800/50 bg-slate-900/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Active Users (Mobile) */}
              {activeUsers > 0 && (
                <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-emerald-500/30">
                  <FiUsers className="text-emerald-400" />
                  <span className="text-sm font-medium text-slate-300">
                    {activeUsers} online
                  </span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </div>
              )}

              {/* Nav Links (Mobile) */}
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 transition-all duration-300"
                >
                  <item.icon className="text-xl" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              {/* User Menu (Mobile) */}
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <FiUser className="text-emerald-400 text-xl" />
                    <span className="font-medium text-slate-300">{user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-600/30 transition-all duration-300"
                  >
                    <FiLogOut />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                  >
                    <FiLogIn />
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <FiUserPlus />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
