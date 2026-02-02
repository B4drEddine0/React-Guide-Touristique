import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SiteLogo from '../common/SiteLogo';

function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isDetailPage = /^\/lieux\/\d+/.test(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
      scrolled
        ? isActive
          ? 'text-ocean-600 bg-ocean-50'
          : 'text-slate-600 hover:text-ocean-600 hover:bg-ocean-50/50'
        : isActive
          ? 'text-white bg-white/20'
          : 'text-white/80 hover:text-white hover:bg-white/10'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
          scrolled
            ? 'translate-y-0 bg-white/90 backdrop-blur-xl shadow-soft'
            : isDetailPage
              ? '-translate-y-full'
              : 'bg-transparent'
        }`}
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 h-18 flex items-center">
          {/* Left — Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <SiteLogo className="w-11 h-11 flex-shrink-0 rounded-xl shadow-soft group-hover:scale-105 transition-transform duration-300" />
            <span className={`font-heading font-bold text-xl tracking-tight transition-colors duration-300 ${
              scrolled ? 'text-slate-800' : 'text-white'
            }`}>
              Afa<span className={scrolled ? 'text-gradient-ocean' : 'text-turquoise-300'}>yi</span>
            </span>
          </Link>

          {/* Center — Navigation */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <NavLink to="/" end className={navLinkClass}>Accueil</NavLink>
            <NavLink to="/lieux" className={navLinkClass}>Destinations</NavLink>
          </nav>

          {/* Right — CTA + Mobile Toggle */}
          <div className="flex items-center gap-3 ml-auto">
            <a
              href="/#get-app"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('get-app')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${
                scrolled
                  ? 'bg-ocean-600 text-white hover:bg-ocean-700 shadow-md hover:shadow-lg'
                  : 'bg-white text-ocean-700 hover:bg-turquoise-50 shadow-lg hover:shadow-xl'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
              Get the App
            </a>

            <button
              type="button"
              className={`md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                scrolled ? 'hover:bg-slate-100' : 'hover:bg-white/10'
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <svg className={`w-5 h-5 transition-colors duration-300 ${scrolled ? 'text-slate-700' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white border-t border-slate-100"
            >
              <nav className="flex flex-col p-4 gap-1">
                <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>Accueil</NavLink>
                <NavLink to="/lieux" className={navLinkClass} onClick={() => setMobileOpen(false)}>Destinations</NavLink>
                <a
                  href="/#get-app"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    document.getElementById('get-app')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-2 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-full bg-ocean-600 text-white hover:bg-ocean-700 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                  Get the App
                </a>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <SiteLogo className="w-12 h-12 flex-shrink-0 rounded-xl" />
                <span className="font-heading font-bold text-2xl text-white tracking-tight">
                  Afayi
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Votre guide pour découvrir les plus beaux trésors de Nador et de la côte méditerranéenne orientale.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white mb-5">
                Navigation
              </h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-sm text-slate-400 hover:text-turquoise-400 transition-colors">Accueil</Link></li>
                <li><Link to="/lieux" className="text-sm text-slate-400 hover:text-turquoise-400 transition-colors">Destinations</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white mb-5">
                Suivez-nous
              </h3>
              <div className="flex gap-3 mb-6">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-300 hover:bg-turquoise-500 hover:text-white transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.574 4.897 4.897 0 01-2.229-.616v.061a4.919 4.919 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.015-.634A9.936 9.936 0 0024 4.557z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-300 hover:bg-turquoise-500 hover:text-white transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-300 hover:bg-turquoise-500 hover:text-white transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z"/></svg>
                </a>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Partagez vos plus beaux moments<br/>avec <span className="text-turquoise-400">#Afayi</span>
              </p>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Afayi — Tous droits réservés
            </p>
            <p className="text-xs text-slate-500">Conçu avec passion pour la Méditerranée</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
