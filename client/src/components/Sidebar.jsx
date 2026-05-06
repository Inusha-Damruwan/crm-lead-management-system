import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/leads',
      label: 'Leads',
      icon: Users,
    },
  ];

  const userInitials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'AU';

  // CLOSE PROFILE WHEN CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  // SIDEBAR CONTENT
  const sidebarContent = (
    <div className="relative flex flex-col h-full overflow-hidden">

      {/* GLOW EFFECTS */}
      <div className="absolute top-[-120px] left-[-120px] w-64 h-64 bg-cyan-400/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-140px] right-[-100px] w-72 h-72 bg-pink-500/20 blur-3xl rounded-full"></div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col h-full">

        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-b border-white/10 bg-black/10 backdrop-blur-xl px-4 py-3"
        >

          <div className="flex items-center gap-2.5">

            {/* ICON */}
            <div className="relative rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 p-2.5 shadow-lg shadow-cyan-500/30">

              <ShieldCheck className="h-6 w-6 text-white" />

            </div>

            {/* TEXT */}
            <div>

              <h1 className="text-2xl font-black bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                CRM
              </h1>

              <p className="text-xs text-white/60">
                Lead Manager
              </p>

            </div>

          </div>
        </motion.div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-4 space-y-2">

          {navItems.map((item, idx) => {
            const Icon = item.icon;

            const active = isActive(item.path);

            return (
              <motion.div
                key={item.path}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: idx * 0.1,
                }}
              >

                <Link
                  to={item.path}
                  onClick={() =>
                    setIsMobileOpen(false)
                  }
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl overflow-hidden transition-all duration-300 group ${
                    active
                      ? 'text-white shadow-2xl shadow-cyan-500/20'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >

                  {/* ACTIVE BG */}
                  {active && (
                    <motion.div
                      layoutId="activeSidebar"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl"
                    />
                  )}

                  {/* ICON */}
                  <Icon
                    className={`relative z-10 h-5 w-5 ${
                      active
                        ? 'scale-110'
                        : 'group-hover:scale-105'
                    } transition-transform`}
                  />

                  {/* LABEL */}
                  <span className="relative z-10 font-semibold text-base">
                    {item.label}
                  </span>

                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* USER SECTION */}
        <div className="border-t border-white/10 bg-black/10 backdrop-blur-xl p-3">

          <div
            ref={profileRef}
            className="relative"
          >

            {/* PROFILE BUTTON */}
            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                setIsProfileOpen(
                  !isProfileOpen
                )
              }
              className="w-full flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl px-3 py-2.5 hover:bg-white/15 transition-all"
            >

              <div className="flex items-center gap-2.5">

                {/* AVATAR */}
                <div className="relative">

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-lg">
                    {userInitials}
                  </div>

                  {/* ONLINE DOT */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></div>

                </div>

                {/* USER INFO */}
                <div className="text-left">

                  <h3 className="text-white font-bold text-sm">
                    {user?.name || 'Admin User'}
                  </h3>

                  <p className="text-white/60 text-xs">
                    {user?.role || 'admin'}
                  </p>

                </div>

              </div>

              {/* CHEVRON */}
              <motion.div
                animate={{
                  rotate: isProfileOpen
                    ? 180
                    : 0,
                }}
              >
                <ChevronDown className="text-white/60 h-4 w-4" />
              </motion.div>

            </motion.button>

            {/* DROPDOWN */}
            <AnimatePresence>

              {isProfileOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95,
                  }}
                  className="absolute bottom-full left-0 right-0 mb-3 z-50"
                >

                  <div className="rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-2xl overflow-hidden shadow-2xl">

                    {/* HEADER */}
                    <div className="border-b border-white/10 px-3 py-3">

                      <h3 className="text-white font-semibold text-sm">
                        {user?.name}
                      </h3>

                      <p className="text-white/60 text-xs mt-1">
                        {user?.email}
                      </p>

                    </div>

                    {/* MENU */}
                    <div className="p-2 space-y-1">

                      {/* PROFILE */}
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all"
                      >

                        <UserIcon className="h-4 w-4" />

                        <span>
                          My Profile
                        </span>

                      </button>

                      {/* LOGOUT */}
                      <button
                        onClick={
                          handleLogout
                        }
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                      >

                        <LogOut className="h-4 w-4" />

                        <span>
                          Logout
                        </span>

                      </button>

                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.div className="hidden lg:flex fixed left-0 top-0 w-[220px] h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 text-white flex-col shadow-2xl border-r border-white/10 z-50 overflow-hidden">

        {sidebarContent}

      </motion.div>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 px-4 py-4 border-b border-white/10 backdrop-blur-xl">

        <h1 className="text-2xl font-black bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
          CRM
        </h1>

        <button
          onClick={() =>
            setIsMobileOpen(
              !isMobileOpen
            )
          }
          className="rounded-xl bg-white/10 p-2 text-white"
        >

          {isMobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}

        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>

        {isMobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              x: -100,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -100,
            }}
            transition={{
              duration: 0.25,
            }}
            className="lg:hidden fixed inset-0 top-16 z-30 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 text-white overflow-y-auto"
          >

            {sidebarContent}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;