import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, MapPin, Image, Film, Tag, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { BASE_URL } from '../api';
import { STICKER_OPTIONS } from '../constants/tripOptions';

const EditTripPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDestination, setStartDestination] = useState('');
  const [finalDestination, setFinalDestination] = useState('');
  const [images, setImages] = useState(null);
  const [videos, setVideos] = useState(null);
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/roadtrips/${id}`);
        const { title: t, description: d, route, stickers: s = [] } = response.data;
        setTitle(t);
        setDescription(d);
        setStickers(s);
        if (route && route.length >= 2) {
          setStartDestination(route[0].locationName);
          setFinalDestination(route[1].locationName);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch trip data:', error);
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const toggleSticker = (sticker) => {
    setStickers((current) =>
      current.includes(sticker) ? current.filter((item) => item !== sticker) : [...current, sticker]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('route', JSON.stringify([
      { locationName: startDestination, description: 'Starting Point' },
      { locationName: finalDestination, description: 'Final Destination' },
    ]));
    formData.append('stickers', JSON.stringify(stickers));

    if (images) {
      for (let i = 0; i < images.length; i += 1) formData.append('images', images[i]);
    }
    if (videos) {
      for (let i = 0; i < videos.length; i += 1) formData.append('videos', videos[i]);
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token },
      };
      await axios.put(`${BASE_URL}/api/roadtrips/${id}`, formData, config);
      navigate('/mytrips');
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('Failed to update trip.');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="section-card"
      >
        <motion.button
          onClick={() => navigate(-1)}
          className="secondary-button mb-6 gap-2"
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.96 }}
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>

        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/8"
          >
            <Pencil size={28} className="text-[#67c5ff]" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white">Edit Your Road Trip</h1>
          <p className="mt-3 text-white/50">Refresh your route details and keep the trip listing sharp.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="field-label"><FileText size={12} className="mr-1 inline" /> Title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="field-input" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="start" className="field-label"><MapPin size={12} className="mr-1 inline" /> Start</label>
              <input id="start" type="text" value={startDestination} onChange={(e) => setStartDestination(e.target.value)} className="field-input" />
            </div>
            <div>
              <label htmlFor="final" className="field-label"><MapPin size={12} className="mr-1 inline" /> Destination</label>
              <input id="final" type="text" value={finalDestination} onChange={(e) => setFinalDestination(e.target.value)} className="field-input" />
            </div>
          </div>

          <div>
            <label htmlFor="images" className="field-label"><Image size={12} className="mr-1 inline" /> New Images (Optional)</label>
            <input id="images" type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files)} className="field-file" />
          </div>

          <div>
            <label htmlFor="videos" className="field-label"><Film size={12} className="mr-1 inline" /> New Videos (Optional)</label>
            <input id="videos" type="file" accept="video/*" multiple onChange={(e) => setVideos(e.target.files)} className="field-file" />
          </div>

          <div>
            <label className="field-label"><Tag size={12} className="mr-1 inline" /> Trip Tags</label>
            <div className="flex flex-wrap gap-3">
              {STICKER_OPTIONS.map((sticker) => {
                const isSelected = stickers.includes(sticker);
                return (
                  <motion.button
                    key={sticker}
                    type="button"
                    onClick={() => toggleSticker(sticker)}
                    whileTap={{ scale: 0.92 }}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      isSelected
                        ? 'border-amber-300/40 bg-amber-400/15 text-amber-200'
                        : 'border-white/12 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80'
                    }`}
                  >
                    {sticker}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="field-label"><FileText size={12} className="mr-1 inline" /> Description</label>
            <textarea id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="field-input min-h-[8rem]" />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`primary-button w-full justify-center gap-2 ${isSubmitting ? 'cursor-not-allowed opacity-70' : ''}`}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <><div className="loading-spinner !h-5 !w-5 !border-2" /> Updating...</>
            ) : (
              <>Update Trip <ArrowRight size={18} /></>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditTripPage;
