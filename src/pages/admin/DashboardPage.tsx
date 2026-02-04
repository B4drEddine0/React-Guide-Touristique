import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Loader from '../../components/common/Loader';
import { PLACE_CATEGORIES } from '../../constants/categories';
import { fetchSubscriberCount } from '../../features/newsletter/newsletterSlice';
import { fetchPlaces } from '../../features/places/placesSlice';

function DashboardPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.places);
  const { subscriberCount } = useAppSelector((state) => state.newsletter);

  useEffect(() => {
    if (items.length === 0) {
      void dispatch(fetchPlaces());
    }
    void dispatch(fetchSubscriberCount());
  }, [dispatch, items.length]);

  const stats = useMemo(() => {
    const activeCount = items.filter((place) => place.isActive).length;
    const inactiveCount = items.length - activeCount;
    const byCategory = PLACE_CATEGORIES.map((category) => ({
      category,
      count: items.filter((place) => place.category === category).length,
    })).filter((entry) => entry.count > 0);
    return { activeCount, inactiveCount, byCategory };
  }, [items]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-display-sm text-slate-900 mb-1">Tableau de bord</h1>
        <p className="text-sm text-slate-500">
          Vue synthèse des lieux touristiques et des abonnements newsletter.
        </p>
      </div>

      {loading ? <Loader text="Chargement des indicateurs..." /> : null}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <article className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-ocean-50 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
          </div>
          <h3 className="text-xs font-semibold text-slate-500 mb-1">Total des lieux</h3>
          <p className="font-heading font-bold text-3xl text-slate-900">{items.length}</p>
        </article>
        <article className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xs font-semibold text-slate-500 mb-1">Lieux actifs</h3>
          <p className="font-heading font-bold text-3xl text-emerald-600">{stats.activeCount}</p>
        </article>
        <article className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          </div>
          <h3 className="text-xs font-semibold text-slate-500 mb-1">Lieux inactifs</h3>
          <p className="font-heading font-bold text-3xl text-red-600">{stats.inactiveCount}</p>
        </article>
        <article className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-turquoise-50 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-turquoise-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
          </div>
          <h3 className="text-xs font-semibold text-slate-500 mb-1">Abonnés newsletter</h3>
          <p className="font-heading font-bold text-3xl text-turquoise-600">{subscriberCount}</p>
        </article>
      </div>

      {/* Category Distribution */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-xl text-slate-800">Répartition par catégorie</h2>
          <Link
            to="/admin/lieux"
            className="text-sm font-semibold text-ocean-500 hover:text-ocean-700 transition-colors"
          >
            Gérer les lieux →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {stats.byCategory.map((entry) => (
            <article key={entry.category} className="bg-white rounded-xl shadow-soft p-4 border border-slate-100 hover:shadow-card transition-shadow duration-200">
              <h3 className="text-xs font-medium text-slate-500 mb-1 truncate">{entry.category}</h3>
              <p className="font-heading font-bold text-2xl text-slate-800">{entry.count}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
        <Link to="/admin/lieux/nouveau" className="btn-primary">
          + Ajouter un lieu
        </Link>
        <Link to="/admin/lieux" className="btn-ghost">
          Voir la liste des lieux
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
