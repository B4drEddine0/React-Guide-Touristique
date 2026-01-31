import type { PlaceCategory } from '../constants/categories';
import type { WeekDayKey } from '../constants/days';

export interface AdminUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type OpeningHours = Partial<Record<WeekDayKey, string>>;

export type TransportMode = 'bus' | 'taxi' | 'car' | 'walk' | 'other';

export interface TransportOption {
  mode: TransportMode;
  details: string;
}

export interface Place {
  id: number | string;
  name: string;
  category: PlaceCategory;
  shortDescription: string;
  description: string;
  coverImage: string;
  gallery: string[];
  openingHours?: OpeningHours;
  prices?: string;
  address?: string;
  transport?: TransportOption[];
  accessibility?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscriber {
  id: number | string;
  firstName: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
