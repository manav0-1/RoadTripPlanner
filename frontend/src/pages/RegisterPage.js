import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, AtSign, Mail, Lock, ArrowRight } from 'lucide-react';
import { BASE_URL } from '../api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { name, username, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${BASE_URL}/api/auth/register`, formData);
      navigate('/login');
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', type: 'text', label: 'Full Name', icon: User, placeholder: 'John Doe' },
    { name: 'username', type: 'text', label: 'Username', icon: AtSign, placeholder: 'johndoe' },
    { name: 'email', type: 'email', label: 'Email', icon: Mail, placeholder: 'you@example.com' },
    { name: 'password', type: 'password', label: 'Password', icon: Lock, placeholder: '••••••••', minLength: 6 },
  ];

  return (
    <div className="mx-auto max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="section-card"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/8"
          >
            <UserPlus size={28} className="text-[#67c5ff]" />
          </motion.div>
          <p className="hero-chip mx-auto">Join the community</p>
          <h1 className="mt-4 text-4xl font-bold text-white">Create Your Account</h1>
          <p className="mt-3 text-white/50">Start planning and sharing your road trip adventures.</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field, i) => {
            const Icon = field.icon;
            return (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
              >
                <label className="field-label">{field.label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={onChange}
                    required
                    minLength={field.minLength}
                    className="field-input pl-11"
                    placeholder={field.placeholder}
                  />
                </div>
              </motion.div>
            );
          })}

          <motion.button
            type="submit"
            disabled={loading}
            className={`primary-button w-full justify-center gap-2 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <div className="loading-spinner !h-5 !w-5 !border-2" />
                Creating account...
              </>
            ) : (
              <>
                Register
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#84ffd8]/80 transition-colors hover:text-[#84ffd8]">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
