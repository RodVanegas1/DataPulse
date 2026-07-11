import { AnalyticsRepository } from '../repositories/analytics.repository';

export class AnalyticsService {
  constructor(private readonly repository = new AnalyticsRepository()) {}

  async dashboard() {
    const [summary, placesByDepartment, placesByCategory, topRatedPlaces, featuredPlaces, upcomingEvents] = await Promise.all([
      this.repository.dashboardSummary(),
      this.repository.placesByDepartment(),
      this.repository.placesByCategory(),
      this.repository.topRatedPlaces(),
      this.repository.featuredPlaces(),
      this.repository.upcomingEvents(),
    ]);

    return { summary, placesByDepartment, placesByCategory, topRatedPlaces, featuredPlaces, upcomingEvents };
  }
}
