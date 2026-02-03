import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import FadeIn from '../components/common/FadeIn';
import Loader from '../components/common/Loader';
import { WEEK_DAYS } from '../constants/days';
import { fetchPlaces } from '../features/places/placesSlice';

const transportLabels: Record<string, string> = {
  bus: 'Bus',
  taxi: 'Taxi',
  car: 'Voiture',
  walk: 'À pied',
  other: 'Autre',
};

const transportIcons: Record<string, React.ReactNode> = {
  bus: (
    <svg className="w-8 h-8 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.029-.504.887-1.11l-1.36-5.848a2.25 2.25 0 00-2.175-1.742H16.5M3 14.25V6.375c0-.621.504-1.125 1.125-1.125h10.5c.621 0 1.125.504 1.125 1.125v7.875m-14.25 0h14.25" />
    </svg>
  ),
  taxi: (
    <svg className="w-8 h-8 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.029-.504.887-1.11l-1.36-5.848a2.25 2.25 0 00-2.175-1.742H16.5M3 14.25V6.375c0-.621.504-1.125 1.125-1.125h10.5c.621 0 1.125.504 1.125 1.125v7.875m-14.25 0h14.25M10.5 3l1.5-1.5L13.5 3" />
    </svg>
  ),
  car: (
    <svg className="w-8 h-8 text-turquoise-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.029-.504.887-1.11l-1.36-5.848a2.25 2.25 0 00-2.175-1.742H16.5M3 14.25V6.375c0-.621.504-1.125 1.125-1.125h10.5c.621 0 1.125.504 1.125 1.125v7.875m-14.25 0h14.25" />
    </svg>
  ),
  walk: (
    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  other: (
    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
};

function PlaceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.places);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (items.length === 0) {
      void dispatch(fetchPlaces());
    }
  }, [dispatch, items.length]);

  const place = items.find((item) => String(item.id) === String(id) && item.isActive);

  if (loading) {
    return <Loader text="Chargement du lieu..." />;
  }

  if (!place) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-ocean-50 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-ocean-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <h1 className="font-heading font-bold text-display-sm text-slate-800 mb-3">Lieu introuvable</h1>
        <p className="text-slate-500 mb-6">Ce lieu est inexistant ou inactif.</p>
        <button type="button" onClick={() => navigate(-1)} className="btn-primary">
          Retour aux destinations
        </button>
      </div>
    );
  }

  const gallery = place.gallery.length > 0 ? place.gallery : [place.coverImage];

  return (
    <div>
      {/* Back nav */}
      <div className="bg-white border-b border-slate-100 pt-18">
        <div className="max-w-content mx-auto px-4 sm:px-6 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-ocean-600 transition-colors group"
          >
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Retour aux destinations
          </button>
        </div>
      </div>

      {/* Image Gallery — immersive */}
      <section className="bg-slate-100">
        <div className="max-w-content mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-3">
            {/* Main image */}
            <div className="relative overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={gallery[activeImage]}
                  src={gallery[activeImage]}
                  alt={`${place.name} — photo ${activeImage + 1}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-72 sm:h-96 lg:h-[480px] object-cover"
                />
              </AnimatePresence>
              <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                {activeImage + 1} / {gallery.length}
              </div>
            </div>
            {/* Thumbnails */}
            {gallery.length > 1 ? (
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto">
                {gallery.map((image, index) => (
                  <button
                    key={`${place.id}-thumb-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${
                      index === activeImage
                        ? 'ring-3 ring-ocean-500 ring-offset-2 scale-[0.96]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${place.name} miniature ${index + 1}`}
                      className="w-24 h-20 lg:w-full lg:h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-content mx-auto px-4 sm:px-6 py-12 md:py-16">
        <FadeIn>
          {/* Title & Category */}
          <div className="mb-12">
            <span className="inline-block px-4 py-1.5 bg-ocean-50 text-ocean-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              {place.category}
            </span>
            <h1 className="font-heading font-extrabold text-display-sm md:text-display text-slate-900 mb-5">
              {place.name}
            </h1>
            <p className="text-slate-600 leading-relaxed max-w-3xl text-base md:text-lg">
              {place.description}
            </p>
          </div>
        </FadeIn>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <FadeIn delay={0.1}>
            {/* Opening Hours */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 bg-gradient-ocean">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Horaires d'ouverture
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {WEEK_DAYS.map((day) => (
                  <div key={day.key} className="px-6 py-3.5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">{day.label}</span>
                    <span className="text-sm text-slate-500">
                      {place.openingHours?.[day.key] || 'Non renseigné'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            {/* Practical Info */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="px-6 py-4 bg-gradient-coral">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z\" /></svg>
                    Tarifs
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-sm text-slate-600 font-medium">{place.prices || 'Non renseigné'}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-card overflow-hidden p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-turquoise-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-turquoise-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">Adresse</h3>
                    <p className="text-sm text-slate-500">{place.address || 'Non renseigné'}</p>
                  </div>
                </div>
              </div>

              {place.accessibility ? (
                <div className="bg-white rounded-2xl shadow-card overflow-hidden p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-sand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-1">Accessibilité</h3>
                      <p className="text-sm text-slate-500">{place.accessibility}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </FadeIn>
        </div>

        {/* Transport */}
        {place.transport && place.transport.length > 0 ? (
          <FadeIn>
            <div className="mb-14">
              <h2 className="font-heading font-bold text-2xl text-slate-800 mb-6">Comment s'y rendre</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {place.transport.map((transport, index) => (
                  <motion.div
                    key={`${transport.mode}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300"
                  >
                    <span className="flex-shrink-0">
                      {transportIcons[transport.mode] ?? (
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800 mb-1">
                        {transportLabels[transport.mode] ?? transport.mode}
                      </p>
                      <p className="text-sm text-slate-500 leading-relaxed">{transport.details}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        ) : null}

        {/* Gallery full */}
        {gallery.length > 1 ? (
          <FadeIn>
            <div>
              <h2 className="font-heading font-bold text-2xl text-slate-800 mb-6">Galerie photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {gallery.map((image, index) => (
                  <motion.button
                    key={`${place.id}-gallery-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden rounded-xl"
                  >
                    <img
                      src={image}
                      alt={`${place.name} ${index + 1}`}
                      className="w-full h-44 object-cover hover:brightness-110 transition-all duration-300"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
}

export default PlaceDetailsPage;
