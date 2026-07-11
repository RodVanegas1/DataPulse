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

    return {
      kpis: {
        totalPlaces: summary.places,
        totalDepartments: summary.departments,
        totalMunicipalities: summary.municipalities,
        totalCategories: summary.categories,
        enabledLayers: summary.layers,
        upcomingEvents: upcomingEvents.length,
        featuredPlaces: summary.featured,
      },
      summary,
      rankings: {
        topDepartments: placesByDepartment
          .map((department) => ({ ...department, places: department._count.places }))
          .sort((a, b) => b.places - a.places)
          .slice(0, 10),
        topCategories: placesByCategory
          .map((category) => ({ ...category, places: category._count.places }))
          .sort((a, b) => b.places - a.places)
          .slice(0, 10),
      },
      topPlaces: topRatedPlaces,
      featuredPlaces,
      upcomingEvents,
      insights: [
        `The platform currently tracks ${summary.places} tourism places across ${summary.departments} departments.`,
        featuredPlaces.length
          ? `${featuredPlaces.length} featured places are ready for public promotion.`
          : 'No featured places are currently marked for public promotion.',
        upcomingEvents.length
          ? `${upcomingEvents.length} upcoming events can be surfaced in public calendars.`
          : 'No upcoming events are currently scheduled.',
      ],
    };
  }
}
