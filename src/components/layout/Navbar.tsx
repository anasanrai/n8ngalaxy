import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Sandbox', path: '/sandbox' },
    { name: 'Hosting', path: '/hosting' },
    { name: 'Learn', path: '/learn' },
  ];

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 h-[64px] z-50 transition-colors duration-200 border-b border-border ${
        scrolled ? 'bg-background/80 backdrop-blur-sm' : 'bg-background'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Left: Logo */}
        <NavLink to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
          <span className="font-sans font-medium text-text-secondary">n8n</span>
          <span className="font-display font-extrabold text-primary">Galaxy</span>
        </NavLink>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `font-sans font-medium text-[14px] transition-colors duration-150 ${
                  isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right: Auth / Profile */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/auth')}
                className="h-[36px] px-4 font-sans font-medium text-[14px] text-text-primary rounded-input border border-border hover:bg-surface transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="h-[36px] px-4 font-sans font-medium text-[14px] text-white bg-primary hover:bg-primary-hover rounded-input transition-colors cursor-pointer"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="relative group cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-text-primary font-sans font-medium shadow-[0_0_15px_rgba(124,58,237,0.15)]">
                {getInitials(profile?.full_name)}
              </div>
              <div className="absolute right-0 mt-2 w-48 py-2 bg-surface border border-border rounded-card shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full text-left px-4 py-2 text-[14px] font-sans text-text-secondary hover:text-text-primary hover:bg-background transition-colors cursor-pointer"
                >
                  Dashboard
                </button>
                <div className="my-1 border-t border-border"></div>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-[14px] font-sans text-danger hover:bg-background transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-text-secondary hover:text-text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[64px] left-0 right-0 bg-surface border-b border-border p-4 flex flex-col gap-4 shadow-2xl">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-input font-sans font-medium text-[15px] ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="border-t border-border my-2"></div>
          {!isAuthenticated ? (
            <div className="flex flex-col gap-3 px-2">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/auth'); }}
                className="w-full h-[40px] font-sans font-medium text-[14px] text-text-primary rounded-input border border-border hover:bg-background transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/auth'); }}
                className="w-full h-[40px] font-sans font-medium text-[14px] text-white bg-primary hover:bg-primary-hover rounded-input transition-colors"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                className="block w-full text-left px-4 py-3 rounded-input font-sans font-medium text-[15px] text-text-secondary hover:bg-background hover:text-text-primary"
              >
                Dashboard
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); signOut(); }}
                className="block w-full text-left px-4 py-3 rounded-input font-sans font-medium text-[15px] text-danger hover:bg-background"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
