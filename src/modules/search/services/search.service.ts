import { SearchRepository } from '../repositories/search.repository';

export class SearchService {
  constructor(private readonly repository = new SearchRepository()) {}

  async search(query: string, type: string) {
    const results = await this.repository.search(query);
    if (type === 'all') return results;
    return { [type]: results[type as keyof typeof results] };
  }

  autocomplete(query: string, limit: number) {
    return this.repository.autocomplete(query, limit);
  }
}
