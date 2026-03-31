import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Compass, Users } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../api';
import { STICKER_OPTIONS } from '../constants/tripOptions';
import TripCard from '../components/TripCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import AnimatedCounter from '../components/AnimatedCounter';

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSticker, setActiveSticker] = useState('All');
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/roadtrips`);
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    if (!auth.isAuthenticated) {
      return navigate('/login');
    }

    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${BASE_URL}/api/roadtrips/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setTrips(trips.filter((trip) => trip._id !== id));
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip.');
      }
    }
  };

  const handleLike = async (id) => {
    if (!auth.isAuthenticated) {
      return navigate('/login');
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.put(`${BASE_URL}/api/roadtrips/${id}/like`, null, config);
      const updatedTrips = trips.map((trip) => (trip._id === id ? { ...trip, likes: res.data } : trip));
      setTrips(updatedTrips);
    } catch (err) {
      console.error('Error liking trip:', err);
    }
  };

  const visibleTrips = trips.filter((trip) => trip.createdBy?._id !== auth.user?.id);
  const filteredTrips = visibleTrips.filter((trip) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      trip.title.toLowerCase().includes(query) ||
      trip.description.toLowerCase().includes(query) ||
      trip.route.some((stop) => stop.locationName?.toLowerCase().includes(query));
    const matchesSticker =
      activeSticker === 'All' || (trip.stickers || []).includes(activeSticker);

    return matchesSearch && matchesSticker;
  });

  return (
    <section className="space-y-8">
      {/* Header */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="section-card-strong flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <motion.div variants={fadeUp} className="max-w-2xl">
          <p className="hero-chip">
            <Compass size={14} />
            Explore community routes
          </p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Road trips worth clearing your weekend for.
          </h1>
          <p className="mt-4 max-w-xl text-white/60">
            Browse public itineraries, check the forecast, and open a full route view before you commit to the drive.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="info-pill">Weather-aware planning</span>
            <span className="info-pill">Route map previews</span>
            <span className="info-pill">Community galleries</span>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 text-center sm:w-[20rem]">
          <div className="metric-card">
            <p className="text-3xl font-bold text-white">
              <AnimatedCounter value={filteredTrips.length} />
            </p>
            <p className="mt-1 text-sm text-white/40">Trips visible</p>
          </div>
          <div className="metric-card">
            <p className="text-3xl font-bold text-white">
              {auth.isAuthenticated ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              ) : 'Guest'}
            </p>
            <p className="mt-1 text-sm text-white/40">Session mode</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="section-card flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, route, or description"
              className="field-input pl-11"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', ...STICKER_OPTIONS].map((sticker) => {
              const isActive = activeSticker === sticker;
              return (
                <motion.button
                  key={sticker}
                  type="button"
                  onClick={() => setActiveSticker(sticker)}
                  whileTap={{ scale: 0.94 }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'border-[#84ffd8]/40 bg-[#84ffd8]/15 text-[#84ffd8]'
                      : 'border-white/12 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  {sticker}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredTrips.map((trip, index) => (
            <TripCard
              key={trip._id}
              trip={trip}
              auth={auth}
              onLike={handleLike}
              onDelete={handleDelete}
              showOwnerActions={auth.isAuthenticated && trip.createdBy && trip.createdBy._id === auth.user.id}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="section-card text-center"
        >
          <Users size={48} className="mx-auto mb-4 text-white/20" />
          <p className="text-lg text-white/70">No trips match the current filters.</p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-5 inline-block">
            <Link to="/create-trip" className="primary-button">
              Create a Trip
            </Link>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default TripsPage;
