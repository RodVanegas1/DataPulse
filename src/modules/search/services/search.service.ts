import { SearchRepository } from '../repositories/search.repository';

export interface SearchFilters {
  query: string;
  type: string;
  page: number;
  limit: number;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class SearchService {
  constructor(private readonly repository = new SearchRepository()) {}

  async search(filters: SearchFilters) {
    const results = await this.repository.search(filters);
    if (filters.type === 'all') return results;
    return { [filters.type]: results[filters.type as keyof typeof results] };
  }

  autocomplete(query: string, limit: number) {
    return this.repository.autocomplete(query, limit);
  }
}
