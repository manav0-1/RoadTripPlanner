import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CloudSun } from 'lucide-react';
import { BASE_URL } from '../api';

const WeatherWidget = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location) {
      const fetchWeather = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${BASE_URL}/api/weather?location=${location}`);
          setWeather(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching weather:', error);
          setWeather(null);
          setLoading(false);
        }
      };
      fetchWeather();
    }
  }, [location]);

  if (!location) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-[1.5rem] border border-white/8 bg-white/5 px-4 py-4 text-sm text-white/40">
        <div className="loading-spinner !h-5 !w-5 !border-2" />
        Loading weather...
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex items-center gap-3 rounded-[1.5rem] border border-white/8 bg-white/5 px-4 py-4 text-sm text-white/40">
        <CloudSun size={18} className="text-white/20" />
        Could not fetch weather.
      </div>
    );
  }

  return (
    <motion.div
      className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-lg shadow-slate-950/20"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-white/8 p-2">
          <img src={weather.icon} alt={weather.condition} className="h-12 w-12" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">{weather.location}</p>
          <p className="text-2xl font-bold text-white">{weather.temp_c}°C</p>
          <p className="text-sm text-white/50">{weather.condition}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
