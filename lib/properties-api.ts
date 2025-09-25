// Minimal mock-backed properties API to satisfy aggregator
import { mockProperties } from '@/constants/data';

export type Property = (typeof mockProperties)[number];
export type Paged<T> = { data: T[]; page: number; totalPages: number; total: number };

export function search({ page = 1, pageSize = 10 }: { query?: string; city?: string; country?: string; minPrice?: number; maxPrice?: number; page?: number; pageSize?: number; sort?: string; }): Promise<Paged<Property>> {
  const start = (page - 1) * pageSize;
  const data = mockProperties.slice(start, start + pageSize);
  return Promise.resolve({ data, page, totalPages: 10, total: mockProperties.length });
}

export const PropertiesAPI = { search };
