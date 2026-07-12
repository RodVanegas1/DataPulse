import { AnalyticsRepository } from '../repositories/analytics.repository';

export class AnalyticsService {
  constructor(private readonly repository = new AnalyticsRepository()) {}

  async dashboard() {
    const [summary, placesByDepartment, placesByCategory, topRatedPlaces, featuredPlaces, upcomingEvents, recentDatasets, recentReports] = await Promise.all([
      this.repository.dashboardSummary(),
      this.repository.placesByDepartment(),
      this.repository.placesByCategory(),
      this.repository.topRatedPlaces(),
      this.repository.featuredPlaces(),
      this.repository.upcomingEvents(),
      this.repository.recentDatasets(),
      this.repository.recentReports(),
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
      recentDatasets,
      recentReports,
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

  async indicators() {
    const [summary, regionalComparison, categoryStats] = await Promise.all([
      this.repository.dashboardSummary(),
      this.repository.regionalComparison(),
      this.repository.placesByCategory(),
    ]);

    return {
      kpis: {
        tourismPlaces: summary.places,
        featuredShare: summary.places ? Number(((summary.featured / summary.places) * 100).toFixed(2)) : 0,
        activeLayers: summary.layers,
        categoryCoverage: summary.categories,
      },
      categories: categoryStats.map((category) => ({ id: category.id, name: category.name, slug: category.slug, places: category._count.places })),
      regions: regionalComparison.map((region) => ({
        id: region.id,
        name: region.name,
        slug: region.slug,
        places: region._count.places,
        municipalities: region._count.municipalities,
        indicators: region.indicators,
        statistics: region.statistics,
      })),
      projectionsReady: true,
    };
  }

  async heatmap() {
    const places = await this.repository.heatmapPlaces();
    return {
      type: 'FeatureCollection',
      features: places.map((place) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [Number(place.longitude), Number(place.latitude)] },
        properties: {
          id: place.id,
          name: place.name,
          slug: place.slug,
          weight: Number(place.rating ?? 1) + (place.featured ? 1 : 0),
          category: place.category,
          department: place.department,
          municipality: place.municipality,
        },
      })),
      metadata: { recordCount: places.length, weightFormula: 'rating + featuredBoost' },
    };
  }

  async insights() {
    const [dashboard, heatmap] = await Promise.all([this.dashboard(), this.heatmap()]);
    const topDepartment = dashboard.rankings.topDepartments[0];
    const topCategory = dashboard.rankings.topCategories[0];
    return {
      generatedAt: new Date().toISOString(),
      insights: [
        topDepartment
          ? { type: 'regional-leader', title: 'Most represented department', detail: `${topDepartment.name} has ${topDepartment.places} published places.` }
          : { type: 'regional-leader', title: 'Most represented department', detail: 'No published place coverage is available yet.' },
        topCategory
          ? { type: 'category-demand', title: 'Strongest tourism category', detail: `${topCategory.name} leads with ${topCategory.places} places.` }
          : { type: 'category-demand', title: 'Strongest tourism category', detail: 'No category coverage is available yet.' },
        { type: 'investment-zones', title: 'Investment signal', detail: 'Featured and highly rated clusters are suitable candidates for deeper investment analysis.' },
        { type: 'environmental', title: 'Environmental readiness', detail: 'Layer and GeoJSON endpoints are ready for protected areas, climate, terrain, and density overlays.' },
      ],
      evidence: {
        kpis: dashboard.kpis,
        heatmapPoints: heatmap.features.length,
      },
      futureSupport: ['historical-series', 'trend-detection', 'forecasting', 'retrieval-augmented-analysis'],
    };
  }
}
