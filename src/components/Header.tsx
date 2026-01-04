import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import EditProfileModal from '@/components/EditProfileModal'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Music2, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react';

// Shared logo and title component
export function LogoTitle({ size = 12, textSize = '4xl', showText = true }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-${size} h-${size} rounded-2xl bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center shadow-lg`}
      >
        <Music2 className="w-6 h-6 text-white" />
      </div>
      {showText && (
        <span
          className={`font-bold text-${textSize} bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 bg-clip-text text-transparent`}
        >
          TimeStamper
        </span>
      )}
    </div>
  );
}

export default function Header() {
  const { user, signOut, loading, checkSession } = useAuth();
  
  // Poll for session/profile/plan changes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkSession();
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, [checkSession]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('selectedPlan');
    toast.success('Logged out');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-slate-950/70 border-b border-slate-800/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* ✅ LEFTMOST: Logo (minimum padding) */}
          <Link to="/" className="flex-shrink-0">
            <LogoTitle size={12} textSize="4xl" showText={true} />
          </Link>

          {/* ✅ CENTER: Navigation (Desktop only) */}
          <nav className="hidden md:flex items-center gap-8 mx-auto flex-1 max-w-md">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors ${
                isActive('/pricing') 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pricing
            </Link>
          </nav>

          {/* ✅ RIGHTMOST: User actions (Desktop) + Mobile button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Desktop: Profile dropdown */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/50 p-2 rounded-lg transition-all group">
                      <span className="hidden sm:inline text-xs text-slate-300 max-w-[140px] truncate font-semibold">
                        {user.fullName || user.email}
                      </span>
                      <Avatar className="h-9 w-9 ring-1 ring-slate-700/50 group-hover:ring-blue-500/50 transition-all">
                        <AvatarImage src={user.avatar_url || undefined} alt={user.fullName || user.email} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-pink-500 text-white font-semibold">
                          {(user.fullName || user.email || '?')[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setEditProfileOpen(true)}>
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="text-red-500 focus:text-red-400 focus:bg-red-500/10 border-red-500/20"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white hover:shadow-xl transition-all shadow-lg"
                >
                  Login
                </Button>
              )}
            </div>

            {/* ✅ Mobile menu button (always visible on mobile) */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition-all flex-shrink-0"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ✅ Edit Profile Modal */}
        <EditProfileModal open={editProfileOpen} onOpenChange={setEditProfileOpen} />
      </div>

      {/* ✅ Mobile nav drawer */}
      {menuOpen && (
        <div className="md:hidden bg-slate-950/95 border-t border-slate-800/50 backdrop-blur-sm px-4 py-6 flex flex-col gap-4">
          {/* Nav links */}
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className={`text-base font-medium py-2 px-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'text-white bg-blue-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className={`text-base font-medium py-2 px-2 rounded-lg transition-colors ${
                isActive('/pricing') 
                  ? 'text-white bg-blue-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
          </div>

          {/* User section */}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-800/50">
            {user ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                  <Avatar className="h-10 w-10 ring-2 ring-slate-700/50">
                    <AvatarImage src={user.avatar_url || undefined} alt={user.fullName || user.email} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-pink-500 text-white font-semibold">
                      {(user.fullName || user.email || '?')[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.fullName || user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => { 
                    setMenuOpen(false); 
                    setEditProfileOpen(true); 
                  }}
                  className="border-slate-600 hover:bg-slate-800 text-slate-200 hover:text-white"
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => { 
                    setMenuOpen(false); 
                    handleLogout(); 
                  }}
                  className="border-slate-600 text-red-400 hover:bg-red-500/10 hover:text-red-300 mt-1"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => { 
                  setMenuOpen(false); 
                  navigate('/login'); 
                }}
                className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
