import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Loader from '../../components/common/Loader';
import { PLACE_CATEGORIES } from '../../constants/categories';
import { WEEK_DAYS } from '../../constants/days';
import {
  createPlace,
  fetchPlaces,
  updatePlace,
  type PlaceInput,
} from '../../features/places/placesSlice';
import type { PlaceCategory, WeekDayKey } from '../../types/form';
import type { TransportMode } from '../../types/models';

/* ────────── Constants ────────── */
const TOTAL_STEPS = 4;

/* ────────── Step config ────────── */
const STEPS = [
  {
    id: 1,
    title: 'Identité',
    subtitle: 'Nom, catégorie et image',
    color: 'ocean',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Contenu',
    subtitle: 'Description et galerie',
    color: 'turquoise',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Infos pratiques',
    subtitle: 'Adresse, tarifs et horaires',
    color: 'coral',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Transport & publication',
    subtitle: 'Accès et mise en ligne',
    color: 'emerald',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
] as const;

const stepFields: Record<number, string[]> = {
  1: ['name', 'category', 'coverImage', 'shortDescription'],
  2: ['description', 'galleryInput'],
  3: ['prices', 'address', 'accessibility', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  4: ['bus', 'taxi', 'car', 'walk', 'other', 'isActive'],
};

/* ────────── Schema ────────── */
const placeSchema = yup.object({
  name: yup.string().trim().required('Le nom est obligatoire.'),
  category: yup
    .mixed<PlaceCategory>()
    .oneOf([...PLACE_CATEGORIES], 'Catégorie invalide.')
    .required('La catégorie est obligatoire.'),
  shortDescription: yup.string().trim().required('Le résumé est obligatoire.'),
  description: yup.string().trim().required('La description est obligatoire.'),
  coverImage: yup.string().trim().url('URL invalide.').required('Une photo est obligatoire.'),
  galleryInput: yup.string().optional().default(''),
  prices: yup.string().optional().default(''),
  address: yup.string().optional().default(''),
  accessibility: yup.string().optional().default(''),
  bus: yup.string().optional().default(''),
  taxi: yup.string().optional().default(''),
  car: yup.string().optional().default(''),
  walk: yup.string().optional().default(''),
  other: yup.string().optional().default(''),
  monday: yup.string().optional().default(''),
  tuesday: yup.string().optional().default(''),
  wednesday: yup.string().optional().default(''),
  thursday: yup.string().optional().default(''),
  friday: yup.string().optional().default(''),
  saturday: yup.string().optional().default(''),
  sunday: yup.string().optional().default(''),
  isActive: yup.boolean().required(),
});

type PlaceFormValues = yup.InferType<typeof placeSchema>;

const defaultValues: PlaceFormValues = {
  name: '',
  category: PLACE_CATEGORIES[0],
  shortDescription: '',
  description: '',
  coverImage: '',
  galleryInput: '',
  prices: '',
  address: '',
  accessibility: '',
  bus: '',
  taxi: '',
  car: '',
  walk: '',
  other: '',
  monday: '',
  tuesday: '',
  wednesday: '',
  thursday: '',
  friday: '',
  saturday: '',
  sunday: '',
  isActive: true,
};

/* ────────── Slide variants ────────── */
const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

function PlaceEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, loading, submitting } = useAppSelector((state) => state.places);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const isEditMode = Boolean(id);
  const place = useMemo(
    () => items.find((item) => String(item.id) === String(id)),
    [id, items],
  );

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<PlaceFormValues>({
    resolver: yupResolver(placeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (items.length === 0) {
      void dispatch(fetchPlaces());
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    if (!isEditMode || !place) {
      return;
    }

    reset({
      name: place.name,
      category: place.category,
      shortDescription: place.shortDescription,
      description: place.description,
      coverImage: place.coverImage,
      galleryInput: place.gallery.join('\n'),
      prices: place.prices || '',
      address: place.address || '',
      accessibility: place.accessibility || '',
      bus: place.transport?.find((item) => item.mode === 'bus')?.details || '',
      taxi: place.transport?.find((item) => item.mode === 'taxi')?.details || '',
      car: place.transport?.find((item) => item.mode === 'car')?.details || '',
      walk: place.transport?.find((item) => item.mode === 'walk')?.details || '',
      other: place.transport?.find((item) => item.mode === 'other')?.details || '',
      monday: place.openingHours?.monday || '',
      tuesday: place.openingHours?.tuesday || '',
      wednesday: place.openingHours?.wednesday || '',
      thursday: place.openingHours?.thursday || '',
      friday: place.openingHours?.friday || '',
      saturday: place.openingHours?.saturday || '',
      sunday: place.openingHours?.sunday || '',
      isActive: place.isActive,
    });
  }, [isEditMode, place, reset]);

  const goNext = async () => {
    const valid = await trigger(stepFields[step] as Array<keyof PlaceFormValues>);
    if (!valid) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goPrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  /* Prevent Enter key from accidentally advancing / submitting */
  const blockEnterSubmit = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: PlaceFormValues) => {
    const hoursEntries = WEEK_DAYS.map((day) => [day.key, values[day.key]] as const).filter(
      ([, dayValue]) => dayValue && dayValue.trim().length > 0,
    );
    const openingHours = Object.fromEntries(hoursEntries) as Partial<Record<WeekDayKey, string>>;

    const transport: Array<{ mode: TransportMode; details: string }> = [
      { mode: 'bus' as const, details: values.bus?.trim() || '' },
      { mode: 'taxi' as const, details: values.taxi?.trim() || '' },
      { mode: 'car' as const, details: values.car?.trim() || '' },
      { mode: 'walk' as const, details: values.walk?.trim() || '' },
      { mode: 'other' as const, details: values.other?.trim() || '' },
    ].filter((item) => item.details.length > 0);

    const gallery = Array.from(
      new Set(
        [values.coverImage, ...(values.galleryInput || '').split(/[\n,]/)]
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    );

    const payload: PlaceInput = {
      name: values.name.trim(),
      category: values.category,
      shortDescription: values.shortDescription.trim(),
      description: values.description.trim(),
      coverImage: values.coverImage.trim(),
      gallery,
      openingHours: Object.keys(openingHours).length > 0 ? openingHours : undefined,
      prices: values.prices?.trim() || undefined,
      address: values.address?.trim() || undefined,
      accessibility: values.accessibility?.trim() || undefined,
      transport: transport.length > 0 ? transport : undefined,
      isActive: values.isActive,
    };

    try {
      if (isEditMode && id) {
        await dispatch(updatePlace({ id, changes: payload })).unwrap();
        toast.success('Lieu modifié avec succès.');
      } else {
        await dispatch(createPlace(payload)).unwrap();
        toast.success('Lieu créé avec succès.');
      }
      navigate('/admin/lieux');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Enregistrement impossible.');
    }
  };

  if (isEditMode && loading && !place) {
    return <Loader text="Chargement du lieu..." />;
  }

  if (isEditMode && !loading && !place) {
    return (
      <div className="text-center py-16">
        <h1 className="font-heading font-bold text-display-sm text-slate-900 mb-3">Lieu introuvable</h1>
        <button type="button" className="btn-ghost" onClick={() => navigate('/admin/lieux')}>
          Retour à la liste
        </button>
      </div>
    );
  }

  const stepColorMap: Record<string, { bg: string; text: string; ring: string; bgLight: string }> = {
    ocean: { bg: 'bg-ocean-500', text: 'text-ocean-600', ring: 'ring-ocean-200', bgLight: 'bg-ocean-50' },
    turquoise: { bg: 'bg-turquoise-500', text: 'text-turquoise-600', ring: 'ring-turquoise-200', bgLight: 'bg-turquoise-50' },
    coral: { bg: 'bg-coral-500', text: 'text-coral-600', ring: 'ring-coral-200', bgLight: 'bg-coral-50' },
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-200', bgLight: 'bg-emerald-50' },
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-display-sm text-slate-900 mb-1">
          {isEditMode ? 'Modifier un lieu' : 'Ajouter un lieu'}
        </h1>
        <p className="text-sm text-slate-400">Étape {step} sur {TOTAL_STEPS} — {STEPS[step - 1].subtitle}</p>
      </div>

      {/* ── Step Indicator ── */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const colors = stepColorMap[s.color];
          const isActive = s.id === step;
          const isDone = s.id < step;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => {
                  if (s.id < step) { setDirection(-1); setStep(s.id); }
                }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl w-full transition-all duration-300 ${
                  isActive
                    ? `${colors.bgLight} ring-2 ${colors.ring} shadow-sm`
                    : isDone
                      ? 'bg-emerald-50 cursor-pointer hover:bg-emerald-100'
                      : 'bg-slate-50 cursor-default'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isActive
                      ? `${colors.bg} text-white shadow-md`
                      : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isDone ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    s.icon
                  )}
                </span>
                <span className="hidden sm:block text-left">
                  <span className={`block text-xs font-bold ${isActive ? colors.text : isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                    Étape {s.id}
                  </span>
                  <span className={`block text-[11px] leading-tight ${isActive ? 'text-slate-600' : isDone ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {s.title}
                  </span>
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`hidden lg:block w-8 h-0.5 flex-shrink-0 rounded-full transition-colors duration-500 ${isDone ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Progress bar ── */}
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${stepColorMap[STEPS[step - 1].color].bg}`}
          initial={false}
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Form ── */}
      <div onKeyDown={blockEnterSubmit}>
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden relative min-h-[420px]">
          <AnimatePresence mode="wait" custom={direction}>
            {/* ═══ STEP 1: Identity ═══ */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Identité du lieu
                </h2>
                <p className="text-sm text-slate-400 mb-5">Décrivez le lieu avec ses informations essentielles.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="label-field">Nom du lieu</label>
                    <input id="name" type="text" className="input-field" placeholder="Ex: Plage de Charrana" {...register('name')} />
                    {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
                  </div>
                  <div>
                    <label htmlFor="category" className="label-field">Catégorie</label>
                    <select id="category" className="input-field" {...register('category')}>
                      {PLACE_CATEGORIES.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category ? <p className="mt-1 text-xs text-red-600">{errors.category.message}</p> : null}
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="coverImage" className="label-field">Image principale (URL)</label>
                    <input id="coverImage" type="url" className="input-field" placeholder="https://images.unsplash.com/..." {...register('coverImage')} />
                    {errors.coverImage ? <p className="mt-1 text-xs text-red-600">{errors.coverImage.message}</p> : null}
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="shortDescription" className="label-field">Résumé</label>
                    <textarea id="shortDescription" rows={2} className="input-field" placeholder="Court résumé affiché dans les cartes..." {...register('shortDescription')} />
                    {errors.shortDescription ? <p className="mt-1 text-xs text-red-600">{errors.shortDescription.message}</p> : null}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 2: Content ═══ */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-turquoise-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  Contenu & Galerie
                </h2>
                <p className="text-sm text-slate-400 mb-5">Description détaillée et photos complémentaires.</p>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="description" className="label-field">Description complète</label>
                    <textarea id="description" rows={5} className="input-field" placeholder="Description détaillée du lieu..." {...register('description')} />
                    {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description.message}</p> : null}
                  </div>
                  <div>
                    <label htmlFor="galleryInput" className="label-field">Galerie (URLs séparées par ligne)</label>
                    <textarea id="galleryInput" rows={4} className="input-field" placeholder={"https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2..."} {...register('galleryInput')} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 3: Practical ═══ */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Informations pratiques
                </h2>
                <p className="text-sm text-slate-400 mb-5">Tarifs, adresse et horaires d'ouverture.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="prices" className="label-field">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                        Tarifs
                      </span>
                    </label>
                    <input id="prices" type="text" className="input-field" placeholder="Accès libre / 30 MAD" {...register('prices')} />
                  </div>
                  <div>
                    <label htmlFor="address" className="label-field">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        Adresse
                      </span>
                    </label>
                    <input id="address" type="text" className="input-field" placeholder="Corniche, Nador" {...register('address')} />
                  </div>
                  <div>
                    <label htmlFor="accessibility" className="label-field">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                        Accessibilité
                      </span>
                    </label>
                    <input id="accessibility" type="text" className="input-field" placeholder="Accessible PMR" {...register('accessibility')} />
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    Horaires d'ouverture
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {WEEK_DAYS.map((day) => (
                      <div key={day.key}>
                        <label htmlFor={day.key} className="label-field text-xs">{day.label}</label>
                        <input
                          id={day.key}
                          type="text"
                          placeholder="09:00 - 18:00"
                          className="input-field text-sm"
                          {...register(day.key)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 4: Transport & Publish ═══ */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="p-6 md:p-8"
              >
                <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Moyens de transport
                </h2>
                <p className="text-sm text-slate-400 mb-5">Comment accéder au lieu ?</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="bus" className="label-field">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-ocean-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.029-.504.887-1.11l-1.36-5.848a2.25 2.25 0 00-2.175-1.742H16.5M3 14.25V6.375c0-.621.504-1.125 1.125-1.125h10.5c.621 0 1.125.504 1.125 1.125v7.875m-14.25 0h14.25" />
                        </svg>
                        Bus
                      </span>
                    </label>
                    <input id="bus" type="text" placeholder="Lignes et arrêts" className="input-field" {...register('bus')} />
                  </div>
                  <div>
                    <label htmlFor="taxi" className="label-field">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.029-.504.887-1.11l-1.36-5.848a2.25 2.25 0 00-2.175-1.742H16.5M3 14.25V6.375c0-.621.504-1.125 1.125-1.125h10.5c.621 0 1.125.504 1.125 1.125v7.875m-14.25 0h14.25M10.5 3l1.5-1.5L13.5 3" />
                        </svg>
                        Taxi
                      </span>
                    </label>
                    <input id="taxi" type="text" placeholder="Stations ou tarifs" className="input-field" {...register('taxi')} />
                  </div>
                  <div>
                    <label htmlFor="car" className="label-field">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-turquoise-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.029-.504.887-1.11l-1.36-5.848a2.25 2.25 0 00-2.175-1.742H16.5M3 14.25V6.375c0-.621.504-1.125 1.125-1.125h10.5c.621 0 1.125.504 1.125 1.125v7.875m-14.25 0h14.25" />
                        </svg>
                        Voiture
                      </span>
                    </label>
                    <input id="car" type="text" placeholder="Parking, accès route" className="input-field" {...register('car')} />
                  </div>
                  <div>
                    <label htmlFor="walk" className="label-field">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        À pied
                      </span>
                    </label>
                    <input id="walk" type="text" placeholder="Distance, durée" className="input-field" {...register('walk')} />
                  </div>
                  <div>
                    <label htmlFor="other" className="label-field">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Autre
                      </span>
                    </label>
                    <input id="other" type="text" placeholder="Info complémentaire" className="input-field" {...register('other')} />
                  </div>
                </div>

                {/* Status toggle */}
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <label htmlFor="isActive" className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <svg className="w-4.5 h-4.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <div>
                        <span className="block text-sm font-bold text-slate-700">Statut de publication</span>
                        <span className="block text-xs text-slate-400">Choisissez si le lieu est visible</span>
                      </div>
                    </div>
                    <select
                      id="isActive"
                      className="input-field w-auto"
                      {...register('isActive', {
                        setValueAs: (value) => value === true || value === 'true',
                      })}
                    >
                      <option value="true">Actif</option>
                      <option value="false">Inactif</option>
                    </select>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Navigation buttons ── */}
        <div className="flex items-center justify-between mt-6">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Précédent
              </button>
            )}
            {step === 1 && (
              <button
                type="button"
                onClick={() => navigate('/admin/lieux')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>

          <div>
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-ocean-600 rounded-xl hover:bg-ocean-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Suivant
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleSubmit(onSubmit)()}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {isEditMode ? 'Enregistrer' : 'Publier le lieu'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceEditorPage;
