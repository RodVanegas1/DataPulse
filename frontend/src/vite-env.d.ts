/// <reference types="vite/client" />

import 'leaflet';
import type { FeatureGroup as LeafletFeatureGroup, Layer as LeafletLayer } from 'leaflet';

declare module 'leaflet.heat';
declare module 'leaflet.markercluster';

declare module 'leaflet' {
  interface HeatLayerOptions {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    gradient?: Record<number, string>;
  }

  interface HeatLayer extends LeafletLayer {
    setLatLngs(latlngs: Array<[number, number, number]>): this;
  }

  interface MarkerClusterGroup extends LeafletFeatureGroup {
    addLayer(layer: LeafletLayer): this;
    clearLayers(): this;
  }

  function heatLayer(latlngs: Array<[number, number, number]>, options?: HeatLayerOptions): HeatLayer;
  function markerClusterGroup(options?: Record<string, unknown>): MarkerClusterGroup;
}
