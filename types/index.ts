export interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: {
    city: string;
    country: string;
    address?: string;
  };
  type: 'sale' | 'rent';
  category: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images: string[];
  description: string;
  features: string[];
  isPremium: boolean;
  isFavorite: boolean;
  views: number;
  createdAt: string;
  provider: Provider;
}

export interface Provider {
  id: string;
  name: string;
  type: 'agent' | 'agency';
  avatar: string;
  rating: number;
  reviewCount: number;
  location: {
    city: string;
    country: string;
  };
  specialties: string[];
  isVerified: boolean;
  isPremium: boolean;
  phone: string;
  email: string;
  whatsapp?: string;
  listingCount: number;
  images: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'property' | 'image';
  propertyId?: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  }[];
  lastMessage: Message;
  unreadCount: number;
  category: 'properties' | 'services' | 'support';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  city?: string;
  country?: string;
  bio?: string;
  cover?: string;
  isProvider: boolean;
  preferences: {
    language: 'fr' | 'en' | 'pt';
    currency: string;
    country: string;
  };
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'visit' | 'meeting';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  propertyId?: string;
  clientName: string;
  clientPhone: string;
  notes?: string;
}

export type UserMode = 'user' | 'provider';
export type AppMode = 'voyageur' | 'prestataire';

export interface FilterState {
  country?: string;
  city?: string;
  category?: string;
  priceRange?: [number, number];
  bedrooms?: number;
  bathrooms?: number;
  area?: [number, number];
  type?: 'sale' | 'rent';
  sortBy: 'recent' | 'price_asc' | 'price_desc' | 'popular';
}