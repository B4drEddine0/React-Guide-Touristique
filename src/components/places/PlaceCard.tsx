import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Place } from '../../types/models';

interface PlaceCardProps {
  place: Place;
  index?: number;
}

function PlaceCard({ place, index = 0 }: PlaceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 overflow-hidden"
    >
      <div className="relative overflow-hidden">
        <img
          src={place.coverImage}
          alt={place.name}
          loading="lazy"
          className="w-full h-60 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-ocean-700 text-xs font-bold rounded-full tracking-wide shadow-soft">
          {place.category}
        </span>
      </div>
      <div className="p-6">
        <Link to={`/lieux/${place.id}`} className="block">
          <h3 className="font-heading font-bold text-xl text-slate-800 mb-2 leading-tight group-hover:text-ocean-600 transition-colors duration-300">
            {place.name}
          </h3>
        </Link>
        <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">
          {place.shortDescription}
        </p>
        <Link
          to={`/lieux/${place.id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-ocean-500 hover:text-coral-500 transition-colors duration-300 group/link"
        >
          Découvrir
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}

export default PlaceCard;
