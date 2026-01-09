import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative w-full bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800/50 py-12 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-all duration-300" />
            <div className="relative flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl px-6 py-3 rounded-full border border-slate-700/50 shadow-lg hover:border-blue-500/30 transition-all duration-300 hover:scale-105">
              <span className="text-slate-300 text-sm font-semibold">Powered By</span>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-50" />
                <img src="/AYUS%20Circular.png" alt="AYUS Logo" className="relative w-8 h-8 rounded-full ring-2 ring-blue-500/20" />
              </div>
              {/* <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">AYUS</span> */}
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} <span className="text-slate-300 font-semibold">TimeStamper</span>. All rights reserved.
          </div>
          
          {/* Accent line */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
        </div>
      </div>
    </footer>
  );
}
