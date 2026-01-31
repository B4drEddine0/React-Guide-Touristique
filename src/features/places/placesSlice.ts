import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { localApi } from '../../api/http';
import type { Place } from '../../types/models';
import { toErrorMessage } from '../../utils/errors';

export interface PlaceInput {
  name: string;
  category: Place['category'];
  shortDescription: string;
  description: string;
  coverImage: string;
  gallery: string[];
  openingHours?: Place['openingHours'];
  prices?: string;
  address?: string;
  transport?: Place['transport'];
  accessibility?: string;
  isActive: boolean;
}

interface PlacesState {
  items: Place[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: PlacesState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
};

export const fetchPlaces = createAsyncThunk<
  Place[],
  void,
  { rejectValue: string }
>('places/fetchPlaces', async (_, { rejectWithValue }) => {
  try {
    const { data } = await localApi.get<Place[]>('/places');
    return data;
  } catch (error) {
    return rejectWithValue(
      toErrorMessage(error, 'Impossible de recuperer les lieux.'),
    );
  }
});

export const createPlace = createAsyncThunk<
  Place,
  PlaceInput,
  { rejectValue: string }
>('places/createPlace', async (place, { rejectWithValue }) => {
  try {
    const now = new Date().toISOString();
    const payload = {
      ...place,
      createdAt: now,
      updatedAt: now,
    };
    const { data } = await localApi.post<Place>('/places', payload);
    return data;
  } catch (error) {
    return rejectWithValue(toErrorMessage(error, 'Creation impossible.'));
  }
});

export const updatePlace = createAsyncThunk<
  Place,
  { id: Place['id']; changes: PlaceInput },
  { rejectValue: string }
>('places/updatePlace', async ({ id, changes }, { rejectWithValue }) => {
  try {
    const payload = {
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    const { data } = await localApi.patch<Place>(`/places/${id}`, payload);
    return data;
  } catch (error) {
    return rejectWithValue(toErrorMessage(error, 'Modification impossible.'));
  }
});

export const deletePlace = createAsyncThunk<
  Place['id'],
  Place['id'],
  { rejectValue: string }
>('places/deletePlace', async (id, { rejectWithValue }) => {
  try {
    await localApi.delete(`/places/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(toErrorMessage(error, 'Suppression impossible.'));
  }
});

export const togglePlaceStatus = createAsyncThunk<
  Place,
  Place,
  { rejectValue: string }
>('places/togglePlaceStatus', async (place, { rejectWithValue }) => {
  try {
    const { data } = await localApi.patch<Place>(`/places/${place.id}`, {
      isActive: !place.isActive,
      updatedAt: new Date().toISOString(),
    });
    return data;
  } catch (error) {
    return rejectWithValue(
      toErrorMessage(error, 'Changement de statut impossible.'),
    );
  }
});

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    clearPlacesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Chargement des lieux echoue.';
      })
      .addCase(createPlace.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createPlace.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload);
      })
      .addCase(createPlace.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Creation echouee.';
      })
      .addCase(updatePlace.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updatePlace.fulfilled, (state, action) => {
        state.submitting = false;
        const index = state.items.findIndex(
          (item) => String(item.id) === String(action.payload.id),
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.unshift(action.payload);
        }
      })
      .addCase(updatePlace.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Modification echouee.';
      })
      .addCase(deletePlace.pending, (state) => {
        state.submitting = true;
      })
      .addCase(deletePlace.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.filter(
          (item) => String(item.id) !== String(action.payload),
        );
      })
      .addCase(deletePlace.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Suppression echouee.';
      })
      .addCase(togglePlaceStatus.pending, (state) => {
        state.submitting = true;
      })
      .addCase(togglePlaceStatus.fulfilled, (state, action) => {
        state.submitting = false;
        const index = state.items.findIndex(
          (item) => String(item.id) === String(action.payload.id),
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(togglePlaceStatus.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Mise a jour du statut echouee.';
      });
  },
});

export const { clearPlacesError } = placesSlice.actions;
export default placesSlice.reducer;
