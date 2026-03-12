import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import AnimatedCounter from '../components/common/AnimatedCounter';
import EmptyState from '../components/common/EmptyState';
import FadeIn from '../components/common/FadeIn';
import SkeletonCard from '../components/common/SkeletonCard';
import NewsletterForm from '../components/forms/NewsletterForm';
import PlaceCard from '../components/places/PlaceCard';
import { PLACE_CATEGORIES } from '../constants/categories';
import { fetchPlaces } from '../features/places/placesSlice';

const categoryIcons: Record<string, React.ReactNode> = {
  'Plages': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  'Sites naturels': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.72.61 5.18 1.64" />
    </svg>
  ),
  'Monuments et patrimoine': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  ),
  'Musees et culture': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  'Restaurants': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  ),
  'Hotels et hebergements': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
    </svg>
  ),
  'Cafes et salons de the': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  'Shopping et souks': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  'Loisirs et divertissements': (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
};

const categoryColors: Record<string, { bg: string; text: string; hoverBg: string }> = {
  'Plages': { bg: 'bg-amber-50', text: 'text-amber-500', hoverBg: 'group-hover:bg-amber-500' },
  'Sites naturels': { bg: 'bg-emerald-50', text: 'text-emerald-500', hoverBg: 'group-hover:bg-emerald-500' },
  'Monuments et patrimoine': { bg: 'bg-violet-50', text: 'text-violet-500', hoverBg: 'group-hover:bg-violet-500' },
  'Musees et culture': { bg: 'bg-rose-50', text: 'text-rose-500', hoverBg: 'group-hover:bg-rose-500' },
  'Restaurants': { bg: 'bg-orange-50', text: 'text-orange-500', hoverBg: 'group-hover:bg-orange-500' },
  'Hotels et hebergements': { bg: 'bg-sky-50', text: 'text-sky-500', hoverBg: 'group-hover:bg-sky-500' },
  'Cafes et salons de the': { bg: 'bg-teal-50', text: 'text-teal-500', hoverBg: 'group-hover:bg-teal-500' },
  'Shopping et souks': { bg: 'bg-pink-50', text: 'text-pink-500', hoverBg: 'group-hover:bg-pink-500' },
  'Loisirs et divertissements': { bg: 'bg-indigo-50', text: 'text-indigo-500', hoverBg: 'group-hover:bg-indigo-500' },
};
const defaultColor = { bg: 'bg-ocean-50', text: 'text-ocean-500', hoverBg: 'group-hover:bg-ocean-500' };

function HomePage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.places);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (items.length === 0) {
      void dispatch(fetchPlaces());
    }
  }, [dispatch, items.length]);

  const featuredPlaces = items.filter((place) => place.isActive).slice(0, 6);

  return (
    <div>
      <section ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-[1.1]">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80"
            alt="Vue aérienne de la côte méditerranéenne"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/30" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative h-full max-w-content mx-auto px-6 sm:px-8 flex items-center"
        >
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-8 border border-white/[0.08]"
            >
              <span className="w-2 h-2 rounded-full bg-turquoise-400 animate-pulse" />
              Bienvenue sur Afayi
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-[2.75rem] sm:text-[3.5rem] md:text-[4.5rem] leading-[1.05] tracking-[-0.03em] font-extrabold text-white mb-6"
            >
              Découvrez les
              <br />
              trésors <span className="text-turquoise-300">de Nador</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-md font-light"
            >
              Plongez dans les eaux turquoise de Marchica, explorez les marchés
              colorés et laissez-vous charmer par le Rif.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                to="/lieux"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-slate-900 font-semibold text-base rounded-full hover:bg-turquoise-400 hover:text-white shadow-lg hover:shadow-turquoise-400/25 transition-all duration-300"
              >
                Explorer
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
              </Link>
              <a
                href="#newsletter"
                className="inline-flex items-center gap-2 px-8 py-4 text-white/80 font-medium text-base rounded-full border border-white/20 hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                S&apos;inscrire
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-content mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-ocean-50 text-ocean-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                Explorez par thème
              </span>
              <h2 className="font-heading text-display-sm md:text-display text-slate-900 mb-3">
                Que souhaitez-vous découvrir ?
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                De la plage au souk, trouvez l'expérience qui vous correspond
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {PLACE_CATEGORIES.map((category, i) => {
              const colors = categoryColors[category] ?? defaultColor;
              return (
                <FadeIn key={category} delay={i * 0.05}>
                  <Link
                    to={`/lieux?category=${encodeURIComponent(category)}`}
                    className="group relative flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-slate-100 hover:border-transparent hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <span className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.bg}`} />
                    <span className={`relative w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center ${colors.hoverBg} group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-lg`}>
                      {categoryIcons[category] ?? (
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      )}
                    </span>
                    <span className="relative text-sm font-semibold text-slate-700 text-center group-hover:text-slate-900 transition-colors">
                      {category}
                    </span>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-sand-50 py-20 md:py-28">
        <div className="max-w-content mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
              <div>
                <span className="inline-block px-4 py-1.5 bg-coral-50 text-coral-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                  Coups de c&oelig;ur
                </span>
                <h2 className="font-heading text-display-sm md:text-display text-slate-900">
                  Destinations populaires
                </h2>
              </div>
              <Link
                to="/lieux"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-ocean-500 hover:text-coral-500 transition-colors group"
              >
                Voir toutes les destinations
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : null}

          {!loading && featuredPlaces.length === 0 ? (
            <EmptyState
              title="Aucune destination disponible"
              description="Ajoutez des lieux actifs depuis l'administration pour les afficher ici."
            />
          ) : null}

          {!loading && featuredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPlaces.map((place, index) => (
                <PlaceCard key={place.id} place={place} index={index} />
              ))}
            </div>
          ) : null}

          <Link to="/lieux" className="sm:hidden mt-8 btn-primary w-full text-center">
            Voir toutes les destinations
          </Link>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-content mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-turquoise-50 text-turquoise-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                Pourquoi Afayi ?
              </span>
              <h2 className="font-heading text-display-sm md:text-display text-slate-900 mb-3">
                Votre compagnon de voyage
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Afayi signifie &laquo;&nbsp;trouvez-moi&nbsp;&raquo; — trouvez les perles cachées de Nador
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>
                ),
                title: 'Lieux sélectionnés',
                desc: 'Chaque destination est soigneusement choisie pour vous offrir une expérience authentique et mémorable.',
                gradient: 'from-ocean-500 to-turquoise-500',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
                ),
                title: 'Photos immersives',
                desc: 'Galeries haute résolution pour visualiser chaque lieu avant votre visite. Vivez l\'aventure avant de partir.',
                gradient: 'from-coral-500 to-orange-400',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ),
                title: 'Infos pratiques',
                desc: 'Horaires, tarifs, transport — tout est là pour planifier votre journée sans stress.',
                gradient: 'from-violet-500 to-purple-400',
              },
            ].map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.12}>
                <div className="group relative bg-white rounded-3xl p-8 border border-slate-100 hover:border-transparent hover:shadow-elevated transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-[15px]">{feature.desc}</p>
                  <div className={`absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r ${feature.gradient} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-slate-900 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-ocean opacity-90" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-turquoise-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-ocean-300/20 rounded-full blur-[100px]" />

        <div className="relative max-w-content mx-auto px-4 sm:px-6">
          <FadeIn>
            <p className="text-center text-turquoise-300 text-sm font-bold uppercase tracking-widest mb-3">
              Nador en chiffres
            </p>
            <h2 className="text-center font-heading text-display-sm md:text-display text-white mb-16">
              Une destination d'exception
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { end: 10, suffix: '+', label: 'Destinations', icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg> },
              { end: 50, suffix: 'km', label: 'De côtes', icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg> },
              { end: 300, suffix: '+', label: 'Jours de soleil', icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg> },
              { end: 1000, suffix: '+', label: 'Souvenirs à créer', icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> },
            ].map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.12}>
                <div className="text-center bg-white/[0.08] backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/[0.14] hover:scale-[1.03] transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 text-turquoise-300 flex items-center justify-center mx-auto mb-5">
                    {stat.icon}
                  </div>
                  <div className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-2 tabular-nums">
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} duration={2.2} />
                  </div>
                  <p className="text-white/60 text-sm font-semibold tracking-wide uppercase">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="get-app" className="bg-sand-50 py-20 md:py-28 overflow-hidden">
        <div className="max-w-content mx-auto px-4 sm:px-6">
          <div className="relative bg-gradient-to-br from-slate-900 via-ocean-800 to-slate-900 rounded-[2rem] overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-turquoise-500/15 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-ocean-400/15 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-10 md:p-16">
              <FadeIn>
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-turquoise-500/20 text-turquoise-300 text-xs font-bold rounded-full uppercase tracking-wider mb-6">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
                    Bientôt disponible
                  </span>
                  <h2 className="font-heading text-display-sm md:text-display text-white mb-4">
                    Emportez Afayi<br />partout avec vous
                  </h2>
                  <p className="text-slate-400 leading-relaxed mb-8 max-w-md">
                    Accédez à vos destinations favorites hors-ligne, recevez des notifications
                    sur les événements locaux et partagez vos découvertes avec la communauté.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-turquoise-50 hover:scale-[1.03] transition-all duration-300 shadow-lg">
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.891l-1.746 1.01a.6.6 0 01-.6 0L12.6 2.39a1.2 1.2 0 00-1.2 0L8.823 3.901a.6.6 0 01-.6 0L6.477 2.891a.6.6 0 00-.9.52v13.037a1.2 1.2 0 00.6 1.04l5.423 3.132a1.2 1.2 0 001.2 0l5.423-3.132a1.2 1.2 0 00.6-1.04V3.411a.6.6 0 00-.9-.52zM12 15a3 3 0 110-6 3 3 0 010 6z"/></svg>
                      <div className="text-left">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider leading-none">Disponible sur</p>
                        <p className="text-sm font-bold">Google Play</p>
                      </div>
                    </button>
                    <button className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-turquoise-50 hover:scale-[1.03] transition-all duration-300 shadow-lg">
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                      <div className="text-left">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider leading-none">Disponible sur</p>
                        <p className="text-sm font-bold">App Store</p>
                      </div>
                    </button>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="hidden lg:flex justify-center">
                  <div className="relative">
                    <div className="w-[260px] h-[520px] bg-slate-800 rounded-[3rem] border-4 border-slate-700 p-3 shadow-2xl">
                      <div className="w-full h-full rounded-[2.3rem] overflow-hidden bg-gradient-to-b from-ocean-500 to-turquoise-500 flex flex-col items-center justify-center relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-2xl" />
                        <img src="/tourist-logo.png" alt="Afayi" className="w-20 h-20 object-contain mb-4 drop-shadow-lg" />
                        <p className="text-white font-heading font-bold text-2xl">Afayi</p>
                        <p className="text-white/70 text-xs mt-1">Explorez. Découvrez. Partagez.</p>
                        <div className="mt-6 flex gap-2">
                          {[1,2,3].map(n => (
                            <div key={n} className={`w-2 h-2 rounded-full ${n === 1 ? 'bg-white' : 'bg-white/40'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-turquoise-400/30 to-ocean-400/30 rounded-[3rem] blur-2xl -z-10 scale-110" />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <section id="newsletter" className="bg-white py-20 md:py-28">
        <div className="max-w-content mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-ocean-900 rounded-3xl p-10 md:p-16">
              <div className="absolute top-0 right-0 w-80 h-80 bg-turquoise-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-coral-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="relative max-w-xl">
                <span className="inline-block px-4 py-1.5 bg-turquoise-500/20 text-turquoise-300 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                  Newsletter
                </span>
                <h2 className="font-heading text-display-sm md:text-display text-white mb-4">
                  Ne manquez rien avec Afayi
                </h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Recevez chaque semaine les événements culturels et les bons plans
                  pour profiter pleinement de la région.
                </p>
                <NewsletterForm compact />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
