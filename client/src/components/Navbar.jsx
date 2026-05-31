import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mic, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/5 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl premium-gradient">
            <Mic className="text-white" size={20} />
          </div>
          <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Vocalize
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            <span className="hidden text-sm text-slate-400 md:block">{user.email}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">Login</Link>
            <Link to="/register" className="text-sm font-medium text-white underline underline-offset-4">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
