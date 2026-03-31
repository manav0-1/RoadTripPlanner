import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Blend,
  Clock3,
  Compass,
  Layers3,
  MapPin,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import SectionHeading from '../components/landing/SectionHeading';
import FeatureCard from '../components/landing/FeatureCard';
import TestimonialCard from '../components/landing/TestimonialCard';
import GradientText from '../components/GradientText';
import AnimatedCounter from '../components/AnimatedCounter';

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const featureCards = [
  {
    icon: Compass,
    title: 'Smart Route Planning',
    description: 'Map out your journey with intelligent route suggestions, real-time traffic data, and scenic detour recommendations.',
  },
  {
    icon: Layers3,
    title: 'Trip Storytelling',
    description: 'Document your adventures with beautiful galleries, route maps, and shareable trip cards that inspire others.',
  },
  {
    icon: ShieldCheck,
    title: 'Weather Intelligence',
    description: 'Check real-time forecasts for every stop on your route. Never get caught in unexpected weather again.',
  },
  {
    icon: Zap,
    title: 'Community Powered',
    description: 'Discover trips from fellow travelers, follow your favorite planners, and build your travel network.',
  },
];

const benefits = [
  { icon: BadgeCheck, title: 'Verified routes', copy: 'Community-tested road trips with real distance, duration, and condition data.' },
  { icon: Clock3, title: 'Plan in minutes', copy: 'Quick trip creation with smart defaults and auto-generated route previews.' },
  { icon: Sparkles, title: 'Premium experience', copy: 'Cinematic UI with smooth animations and immersive visual storytelling.' },
  { icon: Blend, title: 'All-in-one toolkit', copy: 'Navigation, fitness tracking, isochrones, and nearby places in one workspace.' },
];

const testimonials = [
  {
    quote: 'This completely changed how I plan weekend getaways. The route intelligence and weather integration saved me from a washed-out mountain pass.',
    name: 'Ava Collins',
    role: 'Adventure Photographer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'The trip cards look incredible. I shared my Rajasthan road trip and got more engagement than any social media post.',
    name: 'Daniel Brooks',
    role: 'Travel Blogger',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'Route Lab is a game changer. I planned cycling routes through the Western Ghats with elevation data and fitness tracking.',
    name: 'Mina Patel',
    role: 'Cycling Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  },
];

const HomePage = () => {
  useEffect(() => {
    document.title = 'RoadTrip Planner — Plan Cinematic Road Trips';
  }, []);

  return (
    <div className="space-y-8">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden rounded-[2.8rem] border border-white/15 px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="liquid-blob liquid-blob-one" />
        <div className="liquid-blob liquid-blob-two" />
        <div className="liquid-blob liquid-blob-three" />

        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUpItem}>
              <p className="hero-chip">
                <MapPin size={14} />
                Your next adventure starts here
              </p>
            </motion.div>

            <motion.div variants={fadeUpItem}>
              <h1 className="mt-6 text-5xl font-black leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                Plan road trips that feel{' '}
                <GradientText>cinematic.</GradientText>
              </h1>
            </motion.div>

            <motion.p
              variants={fadeUpItem}
              className="mt-6 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl"
            >
              Smart route planning, real-time weather, community galleries, and fitness tracking —
              everything you need to plan, share, and relive unforgettable road trips.
            </motion.p>

            <motion.div variants={fadeUpItem} className="mt-8 flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/trips" className="primary-button">
                  Explore Trips
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/register" className="secondary-button backdrop-blur-xl">
                  Create Account
                </Link>
              </motion.div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {[
                { value: 4.9, label: 'User satisfaction', suffix: '/5', decimals: 1 },
                { value: 150, label: 'Trips planned', suffix: '+', decimals: 0 },
                { value: 12, label: 'Route tools', suffix: '+', decimals: 0 },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUpItem}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="rounded-[1.75rem] border border-white/15 bg-white/8 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl"
                >
                  <p className="text-3xl font-black tracking-[-0.04em] text-white">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} duration={1500 + i * 300} />
                  </p>
                  <p className="mt-2 text-sm text-white/60">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Device Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotateY: -8 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="premium-device-panel">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-white/50">Preview</p>
                  <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white">Your trip dashboard</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300"
                >
                  Live
                </motion.div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-6 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/50">Route preview</p>
                  <p className="mt-5 text-3xl font-black tracking-[-0.05em] text-white">Delhi → Manali</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">530 km</span>
                    <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">12 hrs</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.2em] text-white/50">Stops</p>
                    <div className="mt-4 space-y-3">
                      {['Chandigarh', 'Mandi', 'Kullu'].map((item) => (
                        <div key={item} className="rounded-2xl bg-white/8 px-4 py-3 text-sm font-medium text-white/80">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/15 bg-white/8 p-5 backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.2em] text-white/50">Readiness</p>
                    <div className="mt-4 flex items-end justify-between">
                      <p className="text-4xl font-black tracking-[-0.05em] text-white">96%</p>
                      <Rocket className="text-white/60" size={24} />
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '96%' }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.8 }}
                        className="h-2 rounded-full bg-gradient-to-r from-[#84ffd8] via-[#67c5ff] to-[#d08cff]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="section-card space-y-10">
        <SectionHeading
          eyebrow="Core Features"
          title="Everything you need for the perfect road trip."
          description="From smart route planning to community-powered trip discovery — we've built the tools that serious travelers actually need."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </section>

      {/* ─── PRODUCT SHOWCASE ─── */}
      <section className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="premium-card premium-card-dark flex flex-col justify-between"
        >
          <div>
            <p className="hero-chip">
              <Compass size={14} />
              Route Intelligence
            </p>
            <h3 className="mt-6 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
              Smart routing with<br />multiple transport modes.
            </h3>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/60">
              Compare driving, cycling, and walking routes side by side. Get distance, duration, elevation data, and real-time isochrone maps for any location.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">Driving</span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">Cycling</span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">Walking</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="premium-card premium-card-gradient"
        >
          <div className="grid h-full gap-4">
            <div className="rounded-[1.9rem] border border-white/15 bg-white/8 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.22em] text-white/50">Community Feed</p>
                <Star size={18} className="text-amber-300/80" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="col-span-2 h-44 rounded-[1.5rem] bg-gradient-to-br from-[#67f7c9] via-[#6d9bff] to-[#e37cff] opacity-80" />
                <div className="space-y-3">
                  <div className="h-20 rounded-[1.25rem] bg-white/15" />
                  <div className="h-20 rounded-[1.25rem] bg-white/8" />
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/15 bg-white/8 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.22em] text-white/50">Trips shared</p>
                <p className="mt-3 text-2xl font-bold tracking-[-0.04em] text-white">
                  <AnimatedCounter value={250} suffix="+" />
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/15 bg-white/8 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.22em] text-white/50">Active explorers</p>
                <p className="mt-3 text-2xl font-bold tracking-[-0.04em] text-white">
                  <AnimatedCounter value={1200} suffix="+" />
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── BENEFITS ─── */}
      <section className="section-card space-y-10">
        <SectionHeading
          eyebrow="Why RoadTrip Planner"
          title="Built for travelers who take the scenic route."
          description="Every feature is designed to make planning faster, sharing easier, and your road trips more memorable."
          align="center"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit, index) => (
            <FeatureCard key={benefit.title} icon={benefit.icon} title={benefit.title} description={benefit.copy} index={index} />
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section-card space-y-10">
        <SectionHeading
          eyebrow="Traveler Stories"
          title="Hear from people who planned with us."
          description="Real travelers, real routes, real experiences — see what the community has to say."
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} {...testimonial} index={index} />
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="section-card-strong premium-card-dark text-white"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="hero-chip">
              <Sparkles size={14} />
              Start your journey
            </p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Your next great road trip is <GradientText>one click away.</GradientText>
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/60">
              Join a growing community of explorers. Create your first trip, discover hidden routes, and start building your travel story today.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link to="/register" className="primary-button">
                Get Started Free
                <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link to="/trips" className="secondary-button backdrop-blur-xl">
                Browse Trips
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
