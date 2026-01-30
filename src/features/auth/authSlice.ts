import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../api/http';
import type { AdminUser } from '../../types/models';
import { toErrorMessage } from '../../utils/errors';

interface LoginPayload {
  username: string;
  password: string;
}

interface AuthState {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

interface LoginResponse {
  token: string;
  user: AdminUser;
}

const tokenFromStorage = localStorage.getItem('auth_token');
const userFromStorage = localStorage.getItem('auth_user');

const initialState: AuthState = {
  token: tokenFromStorage,
  user: userFromStorage ? (JSON.parse(userFromStorage) as AdminUser) : null,
  isAuthenticated: Boolean(tokenFromStorage),
  loading: false,
  error: null,
  initialized: true,
};

export const loginAdmin = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>('auth/loginAdmin', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authApi.post('/auth/login', {
      username: payload.username,
      password: payload.password,
      expiresInMins: 60,
    });

    const token = data.accessToken ?? data.token;
    if (!token) {
      throw new Error('Token d authentification non recu.');
    }

    const user: AdminUser = {
      id: data.id,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };

    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    return { token, user };
  } catch (error) {
    return rejectWithValue(
      toErrorMessage(error, 'Echec de connexion. Verifiez vos identifiants.'),
    );
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Connexion impossible.';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
