import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loader from '../../components/common/Loader';
import { PLACE_CATEGORIES } from '../../constants/categories';
import {
  deletePlace,
  fetchPlaces,
  togglePlaceStatus,
} from '../../features/places/placesSlice';
import type { Place } from '../../types/models';
import { formatDate } from '../../utils/date';

type SortOption = 'name' | 'category' | 'createdAt' | 'status';

type ModalAction =
  | { type: 'delete'; id: Place['id'] }
  | { type: 'toggle'; place: Place }
  | null;

function AdminPlacesPage() {
  const dispatch = useAppDispatch();
  const { items, loading, submitting } = useAppSelector((state) => state.places);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [modalAction, setModalAction] = useState<ModalAction>(null);

  useEffect(() => {
    void dispatch(fetchPlaces());
  }, [dispatch]);

  const filteredItems = useMemo(() => {
    const filtered = items.filter((place) => {
      const categoryMatch =
        categoryFilter === 'all' ? true : place.category === categoryFilter;
      const statusMatch =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
            ? place.isActive
            : !place.isActive;
      return categoryMatch && statusMatch;
    });

    const sorted = [...filtered];
    sorted.sort((left, right) => {
      if (sortBy === 'name') {
        return left.name.localeCompare(right.name);
      }
      if (sortBy === 'category') {
        return left.category.localeCompare(right.category);
      }
      if (sortBy === 'createdAt') {
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }
      return Number(right.isActive) - Number(left.isActive);
    });

    return sorted;
  }, [categoryFilter, items, sortBy, statusFilter]);

  const handleToggleStatus = async (place: Place) => {
    try {
      await dispatch(togglePlaceStatus(place)).unwrap();
      toast.success(`Lieu ${place.isActive ? 'désactivé' : 'activé'} avec succès.`);
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Action impossible.');
    }
  };

  const handleDelete = async (id: Place['id']) => {
    try {
      await dispatch(deletePlace(id)).unwrap();
      toast.success('Lieu supprimé.');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Suppression impossible.');
    }
  };

  const handleModalConfirm = async () => {
    if (!modalAction) return;
    if (modalAction.type === 'delete') {
      await handleDelete(modalAction.id);
    } else {
      await handleToggleStatus(modalAction.place);
    }
    setModalAction(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-display-sm text-slate-900 mb-1">Gestion des lieux</h1>
          <p className="text-sm text-slate-500">
            Consultez, triez et mettez à jour les lieux touristiques.
          </p>
        </div>
        <Link to="/admin/lieux/nouveau" className="btn-primary flex-shrink-0">
          + Ajouter un lieu
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="categoryFilter" className="label-field">
              Catégorie
            </label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="input-field"
            >
              <option value="all">Toutes</option>
              {PLACE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="statusFilter" className="label-field">
              Statut
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | 'active' | 'inactive')}
              className="input-field"
            >
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortBy" className="label-field">
              Trier par
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="input-field"
            >
              <option value="name">Nom</option>
              <option value="category">Catégorie</option>
              <option value="createdAt">Date de création</option>
              <option value="status">Statut</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? <Loader text="Chargement de la liste..." /> : null}

      <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Nom
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Catégorie
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Statut
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Création
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((place) => (
              <tr key={place.id} className="hover:bg-ocean-50/30 transition-colors">
                <td className="px-5 py-4 text-sm font-semibold text-slate-800">{place.name}</td>
                <td className="px-5 py-4">
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 rounded-full px-3 py-1">
                    {place.category}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      place.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {place.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">{formatDate(place.createdAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/lieux/${place.id}`} className="btn-ghost btn-sm">
                      Voir
                    </Link>
                    <Link to={`/admin/lieux/${place.id}/modifier`} className="btn-ghost btn-sm">
                      Modifier
                    </Link>
                    <button
                      type="button"
                      className="btn-ghost btn-sm"
                      onClick={() => setModalAction({ type: 'toggle', place })}
                      disabled={submitting}
                    >
                      {place.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      type="button"
                      className="btn-danger btn-sm"
                      onClick={() => setModalAction({ type: 'delete', id: place.id })}
                      disabled={submitting}
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">
                  Aucun lieu ne correspond aux filtres sélectionnés.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={modalAction !== null}
        title={
          modalAction?.type === 'delete'
            ? 'Supprimer ce lieu ?'
            : modalAction?.type === 'toggle'
              ? modalAction.place.isActive
                ? 'Désactiver ce lieu ?'
                : 'Activer ce lieu ?'
              : ''
        }
        message={
          modalAction?.type === 'delete'
            ? 'Cette action est irréversible. Le lieu sera définitivement supprimé.'
            : modalAction?.type === 'toggle'
              ? modalAction.place.isActive
                ? 'Le lieu ne sera plus visible par les visiteurs.'
                : 'Le lieu sera de nouveau visible sur le site.'
              : ''
        }
        confirmLabel={
          modalAction?.type === 'delete'
            ? 'Supprimer'
            : modalAction?.type === 'toggle'
              ? modalAction.place.isActive
                ? 'Désactiver'
                : 'Activer'
              : 'Confirmer'
        }
        danger={modalAction?.type === 'delete'}
        loading={submitting}
        onConfirm={() => void handleModalConfirm()}
        onCancel={() => setModalAction(null)}
      />
    </div>
  );
}

export default AdminPlacesPage;
