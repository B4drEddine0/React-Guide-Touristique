import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-ocean flex items-center justify-center mb-8 shadow-glow">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-sm font-bold uppercase tracking-widest text-ocean-500 mb-3">
          Erreur 404
        </p>
        <h1 className="font-heading font-extrabold text-display-sm md:text-display text-slate-900 mb-4">
          Page introuvable
        </h1>
        <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
          La page que vous recherchez n'existe pas ou a été déplacée.
          <br />
          Pas de panique, la Méditerranée vous attend !
        </p>
        <Link to="/" className="btn-primary">
          Retour à l'accueil →
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
