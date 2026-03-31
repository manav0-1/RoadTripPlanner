import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, Clock3, LocateFixed, MapPinned, Route, ScanSearch, Play, Square, Navigation } from 'lucide-react';
import { BASE_URL } from '../api';
import ORSMapPanel from '../components/ORSMapPanel';

const categoryOptions = ['restaurant', 'hospital', 'atm', 'pharmacy'];
const profileOptions = ['driving', 'cycling', 'walking'];
const fitnessProfiles = ['running', 'walking', 'cycling'];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const RouteToolsPage = () => {
  const [navigationForm, setNavigationForm] = useState({ start: 'New Delhi', end: 'Agra', profile: 'driving' });
  const [smartRoutes, setSmartRoutes] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyCenter, setNearbyCenter] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(categoryOptions);
  const [fitnessActivity, setFitnessActivity] = useState('running');
  const [fitnessPoints, setFitnessPoints] = useState([]);
  const [fitnessRoute, setFitnessRoute] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [isochroneForm, setIsochroneForm] = useState({ location: 'Bengaluru', profile: 'driving' });
  const [isochrones, setIsochrones] = useState([]);
  const [status, setStatus] = useState('Ready');
  const [watchId, setWatchId] = useState(null);
  const watchIdRef = useRef(null);
  const fitnessPointsRef = useRef([]);

  const getAuthConfig = () => ({
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });

  useEffect(() => {
    fitnessPointsRef.current = fitnessPoints;
  }, [fitnessPoints]);

  useEffect(() => () => {
    if (watchIdRef.current !== null) navigator.geolocation?.clearWatch(watchIdRef.current);
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category]
    );
  };

  const handleNavigationSubmit = async (e) => {
    e.preventDefault();
    setStatus('Calculating smart routes...');
    try {
      const res = await axios.post(`${BASE_URL}/api/route/smart`, {
        startLocationName: navigationForm.start,
        endLocationName: navigationForm.end,
        profile: navigationForm.profile,
      }, getAuthConfig());
      setSmartRoutes(res.data.routes);
      setStatus('Smart routes updated.');
    } catch (error) {
      setStatus(error.response?.data?.msg || 'Failed to calculate smart routes.');
    }
  };

  const handleNearbySearch = async () => {
    if (!navigator.geolocation) return setStatus('Geolocation is not supported.');
    setStatus('Finding nearby places...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await axios.get(`${BASE_URL}/api/places/nearby`, {
            ...getAuthConfig(),
            params: { lat: latitude, lng: longitude, categories: selectedCategories.join(',') },
          });
          setNearbyCenter(res.data.center);
          setNearbyPlaces(res.data.places || []);
          setStatus('Nearby places updated.');
        } catch (error) {
          setStatus(error.response?.data?.msg || 'Failed to fetch nearby places.');
        }
      },
      () => setStatus('Unable to read your location.')
    );
  };

  const startTracking = () => {
    if (!navigator.geolocation) return setStatus('Geolocation is not supported.');
    setFitnessRoute(null);
    setFitnessPoints([]);
    setStatus('Fitness tracking started...');
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const point = [position.coords.latitude, position.coords.longitude];
        setFitnessPoints((current) => [...current, point]);
      },
      () => setStatus('Unable to read your movement.'),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );
    setWatchId(id);
    watchIdRef.current = id;
    setTracking(true);
  };

  const stopTracking = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (watchId !== null) setWatchId(null);
    setTracking(false);
    if (fitnessPointsRef.current.length < 2) return setStatus('Track a little longer.');
    setStatus('Processing fitness route...');
    try {
      const res = await axios.post(`${BASE_URL}/api/route/fitness`, {
        activity: fitnessActivity,
        coordinates: fitnessPointsRef.current.map(([lat, lng]) => [lng, lat]),
      }, getAuthConfig());
      setFitnessRoute(res.data);
      setStatus('Fitness route processed.');
    } catch (error) {
      setStatus(error.response?.data?.msg || 'Failed to build fitness route.');
    }
  };

  const handleIsochroneSubmit = async (e) => {
    e.preventDefault();
    setStatus('Building isochrone map...');
    try {
      const res = await axios.post(`${BASE_URL}/api/route/isochrones`, {
        locationName: isochroneForm.location,
        profile: isochroneForm.profile,
        ranges: [300, 600, 1800],
      }, getAuthConfig());
      setIsochrones(res.data.polygons || []);
      setStatus('Isochrones updated.');
    } catch (error) {
      setStatus(error.response?.data?.msg || 'Failed to build isochrone map.');
    }
  };

  const ProfileSelector = ({ current, onChange, options }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <motion.button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          whileTap={{ scale: 0.92 }}
          className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-all duration-300 ${
            current === opt
              ? 'border-[#84ffd8]/40 bg-[#84ffd8]/15 text-[#84ffd8]'
              : 'border-white/12 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80'
          }`}
        >
          {opt}
        </motion.button>
      ))}
    </div>
  );

  return (
    <section className="space-y-8">
      {/* Header */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="section-card-strong flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"
      >
        <motion.div variants={fadeUp} className="max-w-3xl">
          <p className="hero-chip">
            <Navigation size={14} />
            ORS Route Lab
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            Smart navigation, places, fitness & isochrones.
          </h1>
          <p className="mt-4 text-lg leading-8 text-white/55">
            Practical toolkit for travel planning and outdoor activity workflows.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="surface-card min-w-[16rem]">
          <p className="text-xs uppercase tracking-[0.24em] text-white/40">System status</p>
          <p className="mt-3 flex items-center gap-2 text-lg font-bold text-white">
            {status === 'Ready' && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
            {status !== 'Ready' && <div className="loading-spinner !h-4 !w-4 !border-2" />}
            {status}
          </p>
        </motion.div>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Smart Navigation */}
          <motion.div variants={fadeUp} className="surface-card">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#84ffd8]/20 bg-[#84ffd8]/10">
                <Route className="text-[#84ffd8]" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Smart Navigation</h2>
            </div>
            <form onSubmit={handleNavigationSubmit} className="space-y-4">
              <input className="field-input" value={navigationForm.start} onChange={(e) => setNavigationForm({ ...navigationForm, start: e.target.value })} placeholder="Start location" />
              <input className="field-input" value={navigationForm.end} onChange={(e) => setNavigationForm({ ...navigationForm, end: e.target.value })} placeholder="End location" />
              <ProfileSelector current={navigationForm.profile} onChange={(p) => setNavigationForm({ ...navigationForm, profile: p })} options={profileOptions} />
              <motion.button type="submit" className="primary-button w-full justify-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Calculate fastest and shortest
              </motion.button>
            </form>
            {smartRoutes.length > 0 && (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {smartRoutes.map((route) => (
                  <motion.div key={route.routeType} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4" whileHover={{ y: -3 }}>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/40">{route.routeType}</p>
                    <p className="mt-2 text-lg font-bold text-white">{route.distanceKm} km</p>
                    <p className="text-sm text-white/50">{route.durationMinutes} min via {route.profile}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Nearby Places */}
          <motion.div variants={fadeUp} className="surface-card">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#67c5ff]/20 bg-[#67c5ff]/10">
                <LocateFixed className="text-[#67c5ff]" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Nearby Places</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <motion.button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  whileTap={{ scale: 0.92 }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-all duration-300 ${
                    selectedCategories.includes(category)
                      ? 'border-[#67c5ff]/40 bg-[#67c5ff]/15 text-[#67c5ff]'
                      : 'border-white/12 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
            <motion.button type="button" onClick={handleNearbySearch} className="primary-button mt-5 w-full justify-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Find places around me
            </motion.button>
            {nearbyPlaces.length > 0 && (
              <div className="mt-5 grid gap-3">
                {nearbyPlaces.slice(0, 5).map((place) => (
                  <motion.div key={place.id} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4" whileHover={{ y: -2 }}>
                    <p className="font-semibold text-white">{place.name}</p>
                    <p className="mt-1 text-sm text-white/50">{place.category}</p>
                    <p className="mt-1 text-sm text-white/35">{place.address}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Fitness Tracker */}
          <motion.div variants={fadeUp} className="surface-card">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d08cff]/20 bg-[#d08cff]/10">
                <Activity className="text-[#d08cff]" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Fitness Tracker</h2>
            </div>
            <ProfileSelector current={fitnessActivity} onChange={setFitnessActivity} options={fitnessProfiles} />
            <div className="mt-5 flex flex-wrap gap-3">
              {!tracking ? (
                <motion.button type="button" onClick={startTracking} className="primary-button gap-2" whileTap={{ scale: 0.96 }}>
                  <Play size={16} /> Start tracking
                </motion.button>
              ) : (
                <motion.button type="button" onClick={stopTracking} className="primary-button gap-2" whileTap={{ scale: 0.96 }}>
                  <Square size={16} /> Stop and process
                </motion.button>
              )}
              <div className="secondary-button cursor-default">
                {tracking && <span className="mr-2 h-2 w-2 rounded-full bg-rose-400 animate-pulse inline-block" />}
                {fitnessPoints.length} GPS points
              </div>
            </div>
            {fitnessRoute && (
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  { label: 'Distance', value: `${fitnessRoute.distanceKm} km` },
                  { label: 'Elevation', value: `${fitnessRoute.ascent} m` },
                  { label: 'Duration', value: `${fitnessRoute.durationMinutes} min` },
                ].map((item) => (
                  <motion.div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4" whileHover={{ y: -3 }}>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/40">{item.label}</p>
                    <p className="mt-2 text-lg font-bold text-white">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Isochrones */}
          <motion.div variants={fadeUp} className="surface-card">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#84ffd8]/20 bg-[#84ffd8]/10">
                <Clock3 className="text-[#84ffd8]" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Isochrone Maps</h2>
            </div>
            <form onSubmit={handleIsochroneSubmit} className="space-y-4">
              <input className="field-input" value={isochroneForm.location} onChange={(e) => setIsochroneForm({ ...isochroneForm, location: e.target.value })} placeholder="City or address" />
              <ProfileSelector current={isochroneForm.profile} onChange={(p) => setIsochroneForm({ ...isochroneForm, profile: p })} options={profileOptions} />
              <motion.button type="submit" className="primary-button w-full justify-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Show 5, 10, and 30 min reach
              </motion.button>
            </form>
            {isochrones.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {isochrones.map((polygon) => (
                  <div key={polygon.minutes} className="secondary-button cursor-default gap-2">
                    <MapPinned size={16} /> {polygon.minutes} min
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Right: Map + Info */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <ORSMapPanel
            smartRoutes={smartRoutes}
            nearbyCenter={nearbyCenter}
            nearbyPlaces={nearbyPlaces}
            fitnessRoute={fitnessRoute}
            isochrones={isochrones}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div className="surface-card" whileHover={{ y: -3 }}>
              <div className="mb-3 flex items-center gap-3">
                <ScanSearch className="text-[#84ffd8]" size={18} />
                <p className="text-lg font-bold text-white">Use cases</p>
              </div>
              <p className="text-white/50">Compare routes, inspect zones, and check nearby essentials before starting a trip.</p>
            </motion.div>
            <motion.div className="surface-card" whileHover={{ y: -3 }}>
              <div className="mb-3 flex items-center gap-3">
                <MapPinned className="text-[#67c5ff]" size={18} />
                <p className="text-lg font-bold text-white">Map overlays</p>
              </div>
              <p className="text-white/50">Map layers update together so you can compare navigation, POIs, fitness paths, and isochrones.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RouteToolsPage;
