import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Heart, ImageIcon, PlusCircle, FolderOpen } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../api';
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

const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyTrips = async () => {
      if (auth.isAuthenticated) {
        try {
          const token = localStorage.getItem('token');
          const config = { headers: { 'x-auth-token': token } };
          const response = await axios.get(`${BASE_URL}/api/roadtrips/mytrips`, config);
          setTrips(response.data);
        } catch (error) {
          console.error('Error fetching my trips:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMyTrips();
  }, [auth.isAuthenticated]);

  const handleDelete = async (id) => {
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

  const totalLikes = trips.reduce((total, trip) => total + (trip.likes?.length || 0), 0);
  const withGallery = trips.filter((trip) => trip.images?.length).length;

  return (
    <section className="space-y-8">
      {/* Header */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="section-card-strong"
      >
        <motion.div variants={fadeUp} className="flex items-start gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/8">
            <LayoutDashboard size={24} className="text-[#d08cff]" />
          </div>
          <div>
            <p className="hero-chip">Your dashboard</p>
            <h1 className="mt-4 text-4xl font-bold text-white">My Created Trips</h1>
            <p className="mt-3 max-w-2xl text-white/50">
              Manage your published routes, update trip details, and remove anything that no longer belongs.
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="metric-card">
            <p className="text-3xl font-bold text-white">
              <AnimatedCounter value={trips.length} />
            </p>
            <p className="mt-1 text-sm text-white/40">Trips published</p>
          </div>
          <div className="metric-card">
            <p className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
              <Heart size={20} className="text-rose-400/60" />
              <AnimatedCounter value={totalLikes} />
            </p>
            <p className="mt-1 text-sm text-white/40">Total likes</p>
          </div>
          <div className="metric-card">
            <p className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
              <ImageIcon size={20} className="text-[#67c5ff]/60" />
              <AnimatedCounter value={withGallery} />
            </p>
            <p className="mt-1 text-sm text-white/40">With gallery</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <SkeletonGrid count={3} />
      ) : trips.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, index) => (
            <TripCard
              key={trip._id}
              trip={trip}
              auth={auth}
              onDelete={handleDelete}
              showOwnerActions
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
          <FolderOpen size={48} className="mx-auto mb-4 text-white/20" />
          <p className="text-lg text-white/70">You have not created any trips yet.</p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-5 inline-block">
            <Link to="/create-trip" className="primary-button gap-2">
              <PlusCircle size={18} />
              Create Your First Trip
            </Link>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default MyTripsPage;
