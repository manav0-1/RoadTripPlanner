import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import WeatherWidget from './WeatherWidget';

const TripCard = ({
  trip,
  auth,
  onLike,
  onDelete,
  showOwnerActions = false,
  index = 0,
}) => {
  const isLikedByUser = auth.user && trip.likes.includes(auth.user.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 shadow-xl shadow-slate-950/20 backdrop-blur-md transition-all duration-500 hover:border-white/18 hover:bg-white/10 hover:shadow-[0_28px_60px_rgba(0,0,0,0.25)]"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="h-56 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1e] via-[#0a0e1e]/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#84ffd8]/80">Featured route</p>
          <h2 className="mt-2 text-2xl font-bold text-white">{trip.title}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        {/* Route pills */}
        <div className="flex flex-wrap gap-2">
          <span className="info-pill">{trip.route[0]?.locationName || 'Start'}</span>
          <span className="info-pill">{trip.route[1]?.locationName || 'Destination'}</span>
          {!!trip.videos?.length && <span className="info-pill">{trip.videos.length} videos</span>}
        </div>

        {/* Stickers */}
        {trip.stickers?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(trip.stickers || []).slice(0, 3).map((sticker) => (
              <span key={sticker} className="sticker-tag">
                {sticker}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="line-clamp-3 text-sm leading-7 text-white/55">{trip.description}</p>

        {/* Weather */}
        <WeatherWidget location={trip.route[0]?.locationName} />

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-white/8 pt-4">
          <motion.button
            onClick={() => onLike?.(trip._id)}
            className="flex items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-rose-300"
            disabled={!onLike}
            whileTap={{ scale: 0.92 }}
          >
            <Heart
              size={18}
              fill={isLikedByUser ? '#f43f5e' : 'none'}
              className={`transition-all duration-300 ${isLikedByUser ? 'text-rose-400' : 'text-white/50'}`}
            />
            <span>{trip.likes.length} likes</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <Link
              to={`/trips/${trip._id}`}
              className="flex items-center gap-1 text-sm font-semibold text-[#84ffd8]/80 transition-all hover:text-[#84ffd8] hover:gap-2"
            >
              Details
              <ArrowUpRight size={14} />
            </Link>
            {showOwnerActions && (
              <>
                <Link
                  to={`/edit-trip/${trip._id}`}
                  className="flex items-center gap-1 text-sm font-semibold text-white/50 transition-colors hover:text-white"
                >
                  <Pencil size={13} />
                  Edit
                </Link>
                <motion.button
                  onClick={() => onDelete?.(trip._id)}
                  className="flex items-center gap-1 text-sm font-semibold text-rose-400/60 transition-colors hover:text-rose-300"
                  whileTap={{ scale: 0.92 }}
                >
                  <Trash2 size={13} />
                  Delete
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default TripCard;
