import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import TripsPage from './pages/TripsPage';
import CreateTripPage from './pages/CreateTripPage';
import TripDetailPage from './pages/TripDetailPage';
import EditTripPage from './pages/EditTripPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import MyTripsPage from './pages/MyTripsPage';
import RouteToolsPage from './pages/RouteToolsPage';
import AnimatedNavbar from './components/AnimatedNavbar';
import ParticleBackground from './components/ParticleBackground';
import PageTransition from './components/PageTransition';

function App() {
  const location = useLocation();

  return (
    <div className="app-shell">
      {/* Animated Particle Canvas Background */}
      <ParticleBackground />

      {/* Ambient gradient orbs */}
      <div className="ambient-orb ambient-orb-primary" />
      <div className="ambient-orb ambient-orb-secondary" />
      <div className="ambient-orb ambient-orb-tertiary" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        {/* Animated Navbar */}
        <AnimatedNavbar />

        {/* Page Content with Transitions */}
        <main className="flex-1 py-8">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
              <Route path="/trips" element={<PageTransition><TripsPage /></PageTransition>} />
              <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
              <Route element={<PrivateRoute />}>
                <Route path="/route-lab" element={<PageTransition><RouteToolsPage /></PageTransition>} />
                <Route path="/create-trip" element={<PageTransition><CreateTripPage /></PageTransition>} />
                <Route path="/edit-trip/:id" element={<PageTransition><EditTripPage /></PageTransition>} />
                <Route path="/trips/:id" element={<PageTransition><TripDetailPage /></PageTransition>} />
                <Route path="/mytrips" element={<PageTransition><MyTripsPage /></PageTransition>} />
              </Route>
            </Routes>
          </AnimatePresence>
        </main>

        {/* Animated Footer */}
        <footer className="mb-4 overflow-hidden rounded-[2rem]">
          <hr className="footer-divider mb-0" />
          <div className="glass-panel rounded-t-none rounded-b-[2rem] px-6 py-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-md">
                <div className="flex items-center gap-3">
                  <div className="brand-badge h-10 w-10 text-sm">RT</div>
                  <div>
                    <p className="font-display text-xl font-bold text-white">RoadTrip Planner</p>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">✦ Premium Travel Edition</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/50">
                  Plan unforgettable road trips with premium tools, real-time weather, smart navigation, and a community of passionate travelers.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Navigate</p>
                  <div className="space-y-2">
                    <Link to="/" className="block text-white/60 transition-colors hover:text-white">Home</Link>
                    <Link to="/trips" className="block text-white/60 transition-colors hover:text-white">Explore</Link>
                    <Link to="/create-trip" className="block text-white/60 transition-colors hover:text-white">Create</Link>
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Tools</p>
                  <div className="space-y-2">
                    <Link to="/route-lab" className="block text-white/60 transition-colors hover:text-white">Route Lab</Link>
                    <Link to="/mytrips" className="block text-white/60 transition-colors hover:text-white">My Trips</Link>
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Connect</p>
                  <div className="space-y-2">
                    <span className="block text-white/40">Twitter</span>
                    <span className="block text-white/40">GitHub</span>
                    <span className="block text-white/40">Discord</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/8 pt-6 text-center">
              <p className="text-xs text-white/30">
                © {new Date().getFullYear()} RoadTrip Planner. Crafted with ✦ for travelers who love the open road.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
