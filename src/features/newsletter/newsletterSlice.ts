import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getN8nWebhookUrl, localApi } from '../../api/http';
import type { Subscriber } from '../../types/models';
import { toErrorMessage } from '../../utils/errors';

interface NewsletterFormPayload {
  firstName: string;
  email: string;
}

interface NewsletterState {
  loading: boolean;
  subscribing: boolean;
  subscriberCount: number;
  error: string | null;
}

const initialState: NewsletterState = {
  loading: false,
  subscribing: false,
  subscriberCount: 0,
  error: null,
};

export const subscribeNewsletter = createAsyncThunk<
  { source: 'n8n' | 'local' },
  NewsletterFormPayload,
  { rejectValue: string }
>('newsletter/subscribeNewsletter', async (payload, { rejectWithValue }) => {
  try {
    const webhookUrl = getN8nWebhookUrl();

    if (webhookUrl) {
      await axios.post(webhookUrl, payload);
      return { source: 'n8n' };
    }

    const duplicateResponse = await localApi.get<Subscriber[]>('/subscribers', {
      params: { email: payload.email },
    });

    if (duplicateResponse.data.length > 0) {
      return rejectWithValue('Cet email est deja inscrit.');
    }

    await localApi.post('/subscribers', {
      ...payload,
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    return { source: 'local' };
  } catch (error) {
    return rejectWithValue(
      toErrorMessage(error, 'Inscription newsletter impossible.'),
    );
  }
});

export const fetchSubscriberCount = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>('newsletter/fetchSubscriberCount', async (_, { rejectWithValue }) => {
  try {
    const { data } = await localApi.get<Subscriber[]>('/subscribers', {
      params: { status: 'active' },
    });
    return data.length;
  } catch (error) {
    return rejectWithValue(
      toErrorMessage(error, 'Impossible de recuperer les abonnes.'),
    );
  }
});

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.subscribing = true;
        state.error = null;
      })
      .addCase(subscribeNewsletter.fulfilled, (state) => {
        state.subscribing = false;
        state.subscriberCount += 1;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.subscribing = false;
        state.error = action.payload ?? 'Inscription echouee.';
      })
      .addCase(fetchSubscriberCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubscriberCount.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriberCount = action.payload;
      })
      .addCase(fetchSubscriberCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Chargement des abonnes echoue.';
      });
  },
});

export default newsletterSlice.reducer;
