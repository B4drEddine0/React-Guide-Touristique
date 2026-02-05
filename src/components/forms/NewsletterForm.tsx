import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { subscribeNewsletter } from '../../features/newsletter/newsletterSlice';

const newsletterSchema = yup.object({
  firstName: yup.string().trim().required('Le prénom est obligatoire.'),
  email: yup
    .string()
    .trim()
    .email('Format email invalide.')
    .required("L'email est obligatoire."),
});

type NewsletterFormValues = yup.InferType<typeof newsletterSchema>;

interface NewsletterFormProps {
  compact?: boolean;
}

function NewsletterForm({ compact = false }: NewsletterFormProps) {
  const dispatch = useAppDispatch();
  const { subscribing } = useAppSelector((state) => state.newsletter);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: yupResolver(newsletterSchema),
    defaultValues: {
      firstName: '',
      email: '',
    },
  });

  const onSubmit = async (values: NewsletterFormValues) => {
    try {
      await dispatch(subscribeNewsletter(values)).unwrap();
      toast.success('Inscription newsletter réussie ! \ud83c\udf89');
      reset();
    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : 'Impossible de finaliser votre inscription.';
      toast.error(message);
    }
  };

  return (
    <form
      className={`flex flex-col gap-4 ${compact ? 'max-w-full' : 'max-w-lg'}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`newsletter-firstName-${compact ? 'compact' : 'full'}`}
            className={`block text-sm font-semibold mb-1.5 ${
              compact ? 'text-slate-400' : 'text-slate-700'
            }`}
          >
            Prénom
          </label>
          <input
            id={`newsletter-firstName-${compact ? 'compact' : 'full'}`}
            type="text"
            placeholder="Votre prénom"
            className={`w-full border px-4 py-3 text-sm rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
              compact
                ? 'bg-white/10 border-white/20 text-white focus:border-turquoise-400 focus:ring-turquoise-400/20 placeholder:text-white/40'
                : 'bg-white border-slate-200 text-slate-800 focus:border-ocean-400 focus:ring-ocean-100'
            }`}
            {...register('firstName')}
          />
          {errors.firstName ? (
            <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor={`newsletter-email-${compact ? 'compact' : 'full'}`}
            className={`block text-sm font-semibold mb-1.5 ${
              compact ? 'text-slate-400' : 'text-slate-700'
            }`}
          >
            Email
          </label>
          <input
            id={`newsletter-email-${compact ? 'compact' : 'full'}`}
            type="email"
            placeholder="vous@example.com"
            className={`w-full border px-4 py-3 text-sm rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
              compact
                ? 'bg-white/10 border-white/20 text-white focus:border-turquoise-400 focus:ring-turquoise-400/20 placeholder:text-white/40'
                : 'bg-white border-slate-200 text-slate-800 focus:border-ocean-400 focus:ring-ocean-100'
            }`}
            {...register('email')}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          ) : null}
        </div>
      </div>
      <button
        type="submit"
        disabled={subscribing}
        className={`self-start px-7 py-3 text-sm font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          compact
            ? 'bg-gradient-ocean text-white hover:shadow-card-hover hover:scale-[1.02]'
            : 'bg-gradient-coral text-white hover:shadow-card-hover hover:scale-[1.02]'
        }`}
      >
        {subscribing ? 'Inscription...' : "S'inscrire \u2192"}
      </button>
    </form>
  );
}

export default NewsletterForm;
