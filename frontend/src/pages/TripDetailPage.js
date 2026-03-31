import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MapPin, ImageIcon, Film, MessageCircle, Send, UserPlus, UserCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import WeatherWidget from '../components/WeatherWidget';
import MapComponent from '../components/MapComponent';
import SimpleImageViewer from 'react-simple-image-viewer';
import { BASE_URL } from '../api';
import AnimatedCounter from '../components/AnimatedCounter';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const TripDetailPage = () => {
  const getUserId = (value) => (typeof value === 'string' ? value : value?._id || value?.toString?.() || '');
  const [trip, setTrip] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState(null);
  const [places, setPlaces] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isFollowUpdating, setIsFollowUpdating] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };

        const [tripRes, commentsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/roadtrips/${id}`),
          axios.get(`${BASE_URL}/api/comments/${id}`),
        ]);

        const tripData = tripRes.data;
        setTrip(tripData);
        setComments(commentsRes.data);

        if (token && tripData.route && tripData.route.length >= 2) {
          const startDest = tripData.route[0].locationName;
          const finalDest = tripData.route[1].locationName;

          axios.post(`${BASE_URL}/api/route`, { startLocationName: startDest, endLocationName: finalDest }, config)
            .then((res) => setRouteData(res.data))
            .catch((err) => console.error('Error fetching route:', err));

          axios.get(`${BASE_URL}/api/places?location=${finalDest}`, config)
            .then((res) => setPlaces(res.data))
            .catch((err) => console.error('Error fetching places:', err));
        }
      } catch (error) {
        console.error('Error fetching main details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.post(`${BASE_URL}/api/comments/${id}`, { text: newComment }, config);
      const populatedComment = { ...res.data, user: { username: auth.user?.username || 'User' } };
      setComments([populatedComment, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const handleFollowToggle = async () => {
    if (!auth.isAuthenticated) return navigate('/login');
    if (!trip?.createdBy?._id || trip.createdBy._id === auth.user?.id) return;

    try {
      setIsFollowUpdating(true);
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.put(`${BASE_URL}/api/users/${trip.createdBy._id}/follow`, null, config);

      setTrip((currentTrip) => {
        if (!currentTrip?.createdBy) return currentTrip;
        const currentFollowers = currentTrip.createdBy.followers || [];
        const nextFollowers = res.data.isFollowing
          ? Array.from(new Set([...currentFollowers.map(getUserId), auth.user.id]))
          : currentFollowers.map(getUserId).filter((fId) => fId !== auth.user.id);
        return {
          ...currentTrip,
          createdBy: { ...currentTrip.createdBy, followers: nextFollowers, following: currentTrip.createdBy.following || [] },
        };
      });
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setIsFollowUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="section-card flex items-center justify-center gap-3 py-16 text-white/60">
        <div className="loading-spinner" />
        Loading trip details...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="section-card text-center text-white/60">
        <MapPin size={48} className="mx-auto mb-4 text-white/20" />
        Trip not found.
      </div>
    );
  }

  const startDest = trip.route[0]?.locationName;
  const finalDest = trip.route[1]?.locationName;
  const authorFollowers = (trip.createdBy?.followers || []).map(getUserId);
  const isFollowingAuthor = authorFollowers.some((fId) => fId === auth.user?.id);

  return (
    <div className="space-y-6">
      <motion.button
        onClick={() => navigate(-1)}
        className="secondary-button gap-2"
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ArrowLeft size={16} />
        Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="section-card-strong"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2">
            <p className="hero-chip">
              <MapPin size={14} />
              Trip detail
            </p>
            <h1 className="mt-4 mb-4 text-4xl font-bold text-white">{trip.title}</h1>
            <p className="mb-8 max-w-3xl text-white/55">{trip.description}</p>

            {/* Info Pills */}
            <div className="mb-8 flex flex-wrap gap-3">
              <span className="info-pill">
                <MapPin size={12} className="mr-1" />
                {startDest || 'Start'}
              </span>
              <span className="info-pill">
                <MapPin size={12} className="mr-1" />
                {finalDest || 'Destination'}
              </span>
              <span className="info-pill">
                <ImageIcon size={12} className="mr-1" />
                {trip.images?.length || 0} photos
              </span>
              <span className="info-pill">
                <Film size={12} className="mr-1" />
                {trip.videos?.length || 0} videos
              </span>
              <span className="info-pill">
                <MessageCircle size={12} className="mr-1" />
                {comments.length} comments
              </span>
            </div>

            {/* Stickers */}
            {trip.stickers?.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-3">
                {trip.stickers.map((sticker) => (
                  <span key={sticker} className="sticker-tag">{sticker}</span>
                ))}
              </div>
            )}

            {/* Route Data */}
            <h2 className="mb-4 text-2xl font-bold text-white">Route Details</h2>
            {routeData ? (
              <>
                <div className="mb-4 grid grid-cols-2 gap-4 text-center">
                  <motion.div className="surface-card p-4" whileHover={{ y: -3 }}>
                    <p className="text-sm uppercase tracking-[0.24em] text-white/40">Distance</p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      ~ <AnimatedCounter value={routeData.distance} decimals={1} /> km
                    </p>
                  </motion.div>
                  <motion.div className="surface-card p-4" whileHover={{ y: -3 }}>
                    <p className="text-sm uppercase tracking-[0.24em] text-white/40">Duration</p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      ~ <AnimatedCounter value={routeData.duration} decimals={1} /> hrs
                    </p>
                  </motion.div>
                </div>
                <MapComponent routeData={routeData} />
              </>
            ) : (
              <p className="text-white/40">Login to view the route map.</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {trip.coverImage && (
              <motion.img
                src={trip.coverImage}
                alt={trip.title}
                className="w-full rounded-[1.75rem] object-cover shadow-xl shadow-slate-950/30"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              />
            )}

            {/* Author card */}
            {trip.createdBy && (
              <motion.div
                className="surface-card p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">Created by</p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-white">{trip.createdBy.name || trip.createdBy.username}</p>
                    <p className="text-sm text-white/40">@{trip.createdBy.username}</p>
                  </div>
                  {auth.user?.id !== trip.createdBy._id && (
                    <motion.button
                      onClick={handleFollowToggle}
                      disabled={isFollowUpdating}
                      className={`flex items-center gap-2 ${isFollowingAuthor ? 'secondary-button' : 'primary-button'}`}
                      whileTap={{ scale: 0.94 }}
                    >
                      {isFollowUpdating ? (
                        <div className="loading-spinner !h-4 !w-4 !border-2" />
                      ) : isFollowingAuthor ? (
                        <><UserCheck size={15} /> Following</>
                      ) : (
                        <><UserPlus size={15} /> Follow</>
                      )}
                    </motion.button>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 px-4 py-3">
                    <p className="text-xl font-bold text-white"><AnimatedCounter value={authorFollowers.length} /></p>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/40">Followers</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 px-4 py-3">
                    <p className="text-xl font-bold text-white"><AnimatedCounter value={trip.createdBy.following?.length || 0} /></p>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/40">Following</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div className="metric-card" whileHover={{ y: -3 }}>
                <p className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
                  <Heart size={18} className="text-rose-400/60" />
                  <AnimatedCounter value={trip.likes?.length || 0} />
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/40">Likes</p>
              </motion.div>
              <motion.div className="metric-card" whileHover={{ y: -3 }}>
                <p className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
                  <MapPin size={18} className="text-[#84ffd8]/60" />
                  <AnimatedCounter value={places.length} />
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/40">Nearby spots</p>
              </motion.div>
            </div>

            {/* Weather */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-white">Weather Forecast</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm uppercase tracking-[0.24em] text-white/40">Start: {startDest}</h3>
                  <WeatherWidget location={startDest} />
                </div>
                <div>
                  <h3 className="mb-2 text-sm uppercase tracking-[0.24em] text-white/40">Final: {finalDest}</h3>
                  <WeatherWidget location={finalDest} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {trip.images && trip.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <hr className="my-8 border-white/8" />
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
              <ImageIcon size={20} className="text-white/40" />
              Gallery
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {trip.images.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ duration: 0.25 }}
                >
                  <img
                    src={img}
                    onClick={() => openImageViewer(index)}
                    alt={`Trip gallery ${index + 1}`}
                    className="h-40 w-full cursor-pointer rounded-[1.5rem] object-cover shadow-lg shadow-slate-950/30 transition duration-300 hover:opacity-90"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Videos */}
        {trip.videos && trip.videos.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <hr className="my-8 border-white/8" />
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
              <Film size={20} className="text-white/40" />
              Trip Videos
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {trip.videos.map((videoUrl) => (
                <video key={videoUrl} controls preload="metadata" className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950/40 shadow-lg shadow-slate-950/30">
                  <source src={videoUrl} />
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          </motion.div>
        )}

        {/* Nearby Places */}
        {places.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <hr className="my-8 border-white/8" />
            <h2 className="mb-4 text-2xl font-bold text-white">Nearby Attractions in {finalDest}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {places.map((place) => (
                <motion.div key={place.id} className="surface-card p-4" whileHover={{ y: -3 }}>
                  <p className="font-bold text-white">{place.name}</p>
                  <p className="text-sm text-white/50">{place.category}</p>
                  <p className="mt-2 text-xs text-white/35">{place.address}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Comments */}
        <hr className="my-8 border-white/8" />
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
          <MessageCircle size={20} className="text-white/40" />
          Comments ({comments.length})
        </h2>
        {auth.isAuthenticated && (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              rows="3"
              maxLength="500"
              placeholder="Add a public comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="field-input min-h-[7rem]"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-white/30">{newComment.length}/500</p>
              <motion.button
                type="submit"
                className="primary-button gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send size={15} />
                Comment
              </motion.button>
            </div>
          </form>
        )}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <motion.div
                key={comment._id}
                className="surface-card p-4"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
              >
                <p className="font-bold text-white">{comment.user?.username || 'User'}</p>
                <p className="mt-1 text-white/55">{comment.text}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="surface-card text-center">
            <MessageCircle size={32} className="mx-auto mb-2 text-white/15" />
            <p className="text-white/50">No comments yet. Start the conversation!</p>
          </div>
        )}
      </motion.div>

      {isViewerOpen && (
        <SimpleImageViewer
          src={trip.images}
          currentIndex={currentImage}
          onClose={closeImageViewer}
          backgroundStyle={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
        />
      )}
    </div>
  );
};

export default TripDetailPage;
