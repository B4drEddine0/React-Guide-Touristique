import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SiteLogo from '../../components/common/SiteLogo';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearAuthError, loginAdmin } from '../../features/auth/authSlice';

const loginSchema = yup.object({
  username: yup.string().trim().required("L'identifiant est obligatoire."),
  password: yup.string().trim().required('Le mot de passe est obligatoire.'),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

interface LocationState {
  from?: {
    pathname?: string;
  };
}

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await dispatch(loginAdmin(values)).unwrap();
      toast.success('Connexion réussie.');
      const state = location.state as LocationState | null;
      const redirectTo = state?.from?.pathname || '/admin';
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      const message =
        typeof submitError === 'string' ? submitError : 'Échec de connexion.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-600 via-ocean-500 to-turquoise-500 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-120px] right-[-120px] w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 bg-turquoise-400/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-5">
            <SiteLogo className="w-20 h-20 rounded-2xl" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-2">
            Afayi
          </p>
          <h1 className="font-heading font-bold text-display-sm text-white">
            Espace administrateur
          </h1>
        </div>

        <form
          className="bg-white rounded-3xl p-8 shadow-elevated"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="text-sm text-slate-500 mb-6">
            Authentification via DummyJSON Auth API.
            <br />
            <span className="text-xs text-slate-400">
              Exemple : identifiant <code className="text-ocean-700 font-mono bg-ocean-50 px-1.5 py-0.5 rounded">emilys</code>, mot de passe <code className="text-ocean-700 font-mono bg-ocean-50 px-1.5 py-0.5 rounded">emilyspass</code>
            </span>
          </p>

          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="label-field">
                Identifiant
              </label>
              <input id="username" type="text" className="input-field" {...register('username')} />
              {errors.username ? (
                <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="label-field">
                Mot de passe
              </label>
              <input id="password" type="password" className="input-field" {...register('password')} />
              {errors.password ? (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              ) : null}
            </div>

            {error ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            ← Retour au site public
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
