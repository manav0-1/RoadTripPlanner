import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Map, Compass, PlusCircle, Route, User, LogOut, LogIn, UserPlus } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Map },
  { path: '/trips', label: 'Explore', icon: Compass },
];

const authNavItems = [
  { path: '/route-lab', label: 'Route Lab', icon: Route },
  { path: '/mytrips', label: 'My Trips', icon: User },
  { path: '/create-trip', label: 'Create', icon: PlusCircle },
];

const AnimatedNavbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const allNavItems = auth.isAuthenticated
    ? [...navItems, ...authNavItems]
    : navItems;

  return (
    <nav
      className={`sticky top-4 z-40 rounded-[2rem] px-5 py-3 transition-all duration-500 ${
        scrolled
          ? 'border border-white/15 bg-[rgba(10,12,28,0.85)] shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl'
          : 'border border-white/10 bg-[rgba(255,255,255,0.08)] shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl'
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <motion.div
            className="brand-badge"
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            RT
          </motion.div>
          <div className="hidden sm:block">
            <p className="font-display text-lg font-bold text-white transition-colors group-hover:text-white/90">
              RoadTrip Planner
            </p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/50">
              ✦ Premium Travel Edition
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {allNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link-animated group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={15} strokeWidth={2} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[#84ffd8]' : ''}`} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full border border-white/20 bg-white/10"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {auth.isAuthenticated ? (
            <motion.button
              onClick={handleLogout}
              className="secondary-button group flex items-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <LogOut size={16} className="transition-transform group-hover:-translate-x-0.5" />
              Logout
            </motion.button>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                <LogIn size={15} />
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/register" className="primary-button flex items-center gap-2">
                  <UserPlus size={15} />
                  Register
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <motion.button
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden lg:hidden"
          >
            <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
              {allNavItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-[#84ffd8]' : ''} />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="border-t border-white/10 pt-3">
                {auth.isAuthenticated ? (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: allNavItems.length * 0.06 }}
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-300 hover:bg-white/10"
                  >
                    <LogOut size={18} />
                    Logout
                  </motion.button>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="secondary-button flex-1 justify-center">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="primary-button flex-1 justify-center">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default AnimatedNavbar;
