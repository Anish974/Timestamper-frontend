import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
  { to: '/login', label: 'Login/Logout' },
];

export default function NavBar() {
  const location = useLocation();
  return (
    <nav
      className="w-full flex justify-center gap-6 py-4 px-4 sticky top-0 z-50 backdrop-blur-xl bg-white/70 shadow-lg mb-6 border-b border-blue-200/60"
      style={{
        background: 'linear-gradient(90deg, rgba(59,130,246,0.18) 0%, rgba(16,185,129,0.18) 100%)',
      }}
    >
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`text-lg font-semibold px-3 py-1 rounded transition-all duration-300 transform hover:scale-110 hover:bg-blue-100/80 hover:shadow-lg ${
            location.pathname === link.to ? 'bg-blue-300/80 text-blue-900 shadow-lg scale-105' : 'text-gray-800'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
