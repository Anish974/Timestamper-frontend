import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950/80 border-t border-slate-800/70 py-8 mt-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 text-sm font-semibold">Powered By</span>
            <img src="/AYUS%20Circular.png" alt="AYUS Logo" className="w-8 h-8 rounded-full" />
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm">
            <Link to="/terms" className="text-slate-400 hover:text-slate-200 transition">Terms of Service</Link>
            <Link to="/privacy" className="text-slate-400 hover:text-slate-200 transition">Privacy Policy</Link>
            <Link to="/refund" className="text-slate-400 hover:text-slate-200 transition">Refund Policy</Link>
            <Link to="/contact" className="text-slate-400 hover:text-slate-200 transition">Contact Us</Link>
          </div>
        </div>
        
        <div className="border-t border-slate-800/70 pt-4">
          <span className="text-slate-400 text-xs">&copy; {new Date().getFullYear()} TimeStamper. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
