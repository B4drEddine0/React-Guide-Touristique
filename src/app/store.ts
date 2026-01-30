import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import newsletterReducer from '../features/newsletter/newsletterSlice';
import placesReducer from '../features/places/placesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    places: placesReducer,
    newsletter: newsletterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
