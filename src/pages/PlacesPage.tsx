import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import EmptyState from '../components/common/EmptyState';
import FadeIn from '../components/common/FadeIn';
import Pagination from '../components/common/Pagination';
import SkeletonCard from '../components/common/SkeletonCard';
import PlaceCard from '../components/places/PlaceCard';
import { PLACE_CATEGORIES } from '../constants/categories';
import { fetchPlaces } from '../features/places/placesSlice';

const ITEMS_PER_PAGE = 6;

function PlacesPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { items, loading } = useAppSelector((state) => state.places);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (items.length === 0) {
      void dispatch(fetchPlaces());
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    const preselectedCategory = searchParams.get('category');
    if (preselectedCategory) {
      setSelectedCategories([preselectedCategory]);
    }
  }, [searchParams]);

  const filteredItems = useMemo(() => {
    const activeItems = items.filter((place) => place.isActive);
    return activeItems.filter((place) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(place.category);

      const normalizedQuery = query.trim().toLowerCase();
      const searchMatch =
        normalizedQuery.length < 3 || place.name.toLowerCase().includes(normalizedQuery);

      return categoryMatch && searchMatch;
    });
  }, [items, query, selectedCategories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategories]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setQuery('');
  };

  return (
    <div>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-ocean-800 pt-32 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-turquoise-300 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-ocean-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-content mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-xs font-bold uppercase tracking-wider mb-4">
              Explorer
            </span>
            <h1 className="font-heading text-display-sm md:text-display text-white mb-3">
              Destinations à Nador
            </h1>
            <p className="text-ocean-100 text-base max-w-lg">
              Trouvez votre prochaine aventure. Filtrez par catégorie ou recherchez un lieu.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-content mx-auto px-4 sm:px-6 py-10">
        {/* Search & Filters */}
        <FadeIn>
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 mb-10 -mt-16 relative z-10">
            <div className="mb-6">
              <label htmlFor="search-place" className="label-field">
                Rechercher une destination
              </label>
              <div className="relative max-w-lg">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  id="search-place"
                  type="search"
                  placeholder="Ex: Marchica, Charrana, Cap..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="input-field !pl-12"
                />
              </div>
            </div>

            <div className="mb-5">
              <p className="label-field mb-3">Catégories</p>
              <div className="flex flex-wrap gap-2">
                {PLACE_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`px-4 py-2 text-xs font-bold rounded-full border-2 transition-all duration-200 ${
                      selectedCategories.includes(category)
                        ? 'bg-ocean-500 text-white border-ocean-500 shadow-soft'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-ocean-300 hover:text-ocean-600'
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                {filteredItems.length} destination{filteredItems.length !== 1 ? 's' : ''} trouvée{filteredItems.length !== 1 ? 's' : ''}
              </p>
              <button type="button" className="btn-ghost btn-sm" onClick={resetFilters}>
                Réinitialiser
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : null}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 ? (
          <EmptyState
            title="Aucune destination trouvée"
            description="Essayez de modifier vos filtres ou votre recherche."
          />
        ) : null}

        {/* Grid */}
        {!loading && paginatedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((place, index) => (
              <PlaceCard key={place.id} place={place} index={index} />
            ))}
          </div>
        ) : null}

        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

export default PlacesPage;
