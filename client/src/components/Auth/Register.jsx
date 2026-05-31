import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-2xl p-8"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="mt-2 text-slate-400">Join Vocalize and start transcribing</p>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full rounded-xl bg-white/5 border border-white/10 py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full rounded-xl bg-white/5 border border-white/10 py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl premium-gradient py-3 font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign Up
            <UserPlus size={18} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? {' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
