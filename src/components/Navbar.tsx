import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed w-full top-0 z-50 ${location.pathname === '/' ? 'bg-transparent' : 'bg-black/80 backdrop-blur-sm'}`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center h-16">
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className={`border border-white/30 px-4 py-2 rounded-lg hover:text-blue-400 hover:border-blue-400 transition-all ${isActive('/') ? 'text-blue-400 border-blue-400' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/demo" 
              className={`border border-white/30 px-4 py-2 rounded-lg hover:text-blue-400 hover:border-blue-400 transition-all ${isActive('/demo') ? 'text-blue-400 border-blue-400' : ''}`}
            >
              Demo
            </Link>
            <Link 
              to="/info" 
              className={`border border-white/30 px-4 py-2 rounded-lg hover:text-blue-400 hover:border-blue-400 transition-all ${isActive('/info') ? 'text-blue-400 border-blue-400' : ''}`}
            >
              Info
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}