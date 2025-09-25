// Minimal mock-backed pros API to satisfy aggregator
import { mockProviders } from '@/constants/data';

export type Pro = (typeof mockProviders)[number];
export type Paged<T> = { data: T[]; page: number; totalPages: number; total: number };

export function search({ page = 1, pageSize = 10 }: { query?: string; city?: string; country?: string; page?: number; pageSize?: number; sort?: string; }): Promise<Paged<Pro>> {
  const start = (page - 1) * pageSize;
  const data = mockProviders.slice(start, start + pageSize);
  return Promise.resolve({ data, page, totalPages: 10, total: mockProviders.length });
}

export const ProsAPI = { search };
