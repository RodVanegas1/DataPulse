import { useEffect, useMemo, useRef, useState } from 'react';
import { Expand, Layers, LocateFixed, Minimize2, Satellite, ThermometerSun } from 'lucide-react';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.heat';
import type { FeatureCollection, MapConfig, SearchFilters } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface InteractiveMapProps {
  config: MapConfig;
  heatmap: FeatureCollection;
  filters: SearchFilters;
  expanded?: boolean;
  loading?: boolean;
}

const osmLayer = () =>
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  });

const satelliteLayer = () =>
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
  });

const pinIcon = L.divIcon({
  className: '',
  html: '<div class="map-pin">•</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export function InteractiveMap({ config, heatmap, filters, expanded = false, loading = false }: InteractiveMapProps) {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.MarkerClusterGroup | null>(null);
  const heatLayerRef = useRef<L.HeatLayer | null>(null);
  const [base, setBase] = useState<'osm' | 'satellite'>('osm');
  const [showHeat, setShowHeat] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [locating, setLocating] = useState(false);

  const filteredFeatures = useMemo(() => {
    return heatmap.features.filter((feature) => {
      const category = feature.properties.category?.slug ?? '';
      const department = feature.properties.department?.slug ?? '';
      const name = feature.properties.name?.toLowerCase() ?? '';
      const categoryMatch = filters.categories.length === 0 || filters.categories.includes(category);
      const departmentMatch = !filters.departmentSlug || filters.departmentSlug === department;
      const searchMatch = !filters.searchText || name.includes(filters.searchText.toLowerCase());
      return categoryMatch && departmentMatch && searchMatch;
    });
  }, [filters.categories, filters.departmentSlug, filters.searchText, heatmap.features]);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;

    const center = config.center ?? { latitude: 13.7942, longitude: -88.8965 };
    const map = L.map(mapNode.current, {
      center: [center.latitude, center.longitude],
      zoom: config.zoom ?? 8,
      zoomControl: false,
      preferCanvas: true,
    });

    osmLayer().addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    markerLayerRef.current = L.markerClusterGroup({ chunkedLoading: true });
    heatLayerRef.current = L.heatLayer([], {
      radius: 28,
      blur: 22,
      maxZoom: 12,
      gradient: { 0.25: '#38bdf8', 0.55: '#2dd4bf', 0.85: '#f6c453', 1: '#fb7185' },
    });
    markerLayerRef.current.addTo(map);
    heatLayerRef.current.addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [config.center, config.zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.TileLayer) map.removeLayer(layer);
    });
    (base === 'osm' ? osmLayer() : satelliteLayer()).addTo(map);
  }, [base]);

  useEffect(() => {
    const markers = markerLayerRef.current;
    const heat = heatLayerRef.current;
    if (!markers || !heat) return;

    markers.clearLayers();
    const heatPoints: Array<[number, number, number]> = [];
    filteredFeatures.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const marker = L.marker([lat, lng], { icon: pinIcon }).bindPopup(
        `<strong>${feature.properties.name ?? 'Territorial point'}</strong><br>${feature.properties.department?.name ?? 'El Salvador'}<br>${feature.properties.category?.name ?? 'Layer'}`,
        { className: 'olla-popup' },
      );
      markers.addLayer(marker);
      heatPoints.push([lat, lng, feature.properties.weight ?? 1]);
    });
    heat.setLatLngs(heatPoints);
  }, [filteredFeatures]);

  useEffect(() => {
    const map = mapRef.current;
    const markers = markerLayerRef.current;
    const heat = heatLayerRef.current;
    if (!map || !markers || !heat) return;
    if (showMarkers && !map.hasLayer(markers)) markers.addTo(map);
    if (!showMarkers && map.hasLayer(markers)) map.removeLayer(markers);
    if (showHeat && !map.hasLayer(heat)) heat.addTo(map);
    if (!showHeat && map.hasLayer(heat)) map.removeLayer(heat);
  }, [showHeat, showMarkers]);

  useEffect(() => {
    setTimeout(() => mapRef.current?.invalidateSize(), 120);
  }, [expanded, isFullscreen]);

  function locateUser() {
    if (!navigator.geolocation) {
      mapRef.current?.setView([13.7942, -88.8965], 8, { animate: true });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        mapRef.current?.setView([position.coords.latitude, position.coords.longitude], 12, { animate: true });
        setLocating(false);
      },
      () => {
        mapRef.current?.setView([13.7942, -88.8965], 8, { animate: true });
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 6000 },
    );
  }

  return (
    <section
      className={`surface overflow-hidden ${isFullscreen ? 'fixed inset-3 z-50 flex flex-col' : expanded ? 'min-h-[680px]' : 'min-h-[420px] lg:min-h-[calc(100vh-112px)]'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>OpenStreetMap</Badge>
            <Badge>Leaflet</Badge>
            <Badge>MapLibre ready</Badge>
            <Badge>CesiumJS ready</Badge>
          </div>
          <p className="mt-2 text-xs text-steel-500">Satellite basemap uses Esri World Imagery without a frontend API key.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button aria-label="Locate current position" icon={<LocateFixed size={17} />} onClick={locateUser} variant="icon" />
          <Button aria-label="Toggle satellite" icon={<Satellite size={17} />} onClick={() => setBase((current) => (current === 'osm' ? 'satellite' : 'osm'))} variant="icon" />
          <Button aria-label="Toggle heatmap" icon={<ThermometerSun size={17} />} onClick={() => setShowHeat((current) => !current)} variant="icon" />
          <Button aria-label="Toggle markers" icon={<Layers size={17} />} onClick={() => setShowMarkers((current) => !current)} variant="icon" />
          <Button aria-label={isFullscreen ? 'Exit fullscreen map' : 'Fullscreen map'} icon={isFullscreen ? <Minimize2 size={17} /> : <Expand size={17} />} onClick={() => setIsFullscreen((current) => !current)} variant="icon" />
        </div>
      </div>
      <div className="relative min-h-[360px] flex-1">
        <div className="absolute inset-0" ref={mapNode} />
        {(loading || locating) && (
          <div className="absolute inset-x-4 top-4 z-[410] rounded-lg border border-white/10 bg-ink-950/90 px-4 py-3 text-sm text-steel-300 shadow-panel backdrop-blur" role="status">
            {locating ? 'Locating current position...' : 'Loading map layers...'}
          </div>
        )}
        {!loading && filteredFeatures.length === 0 && (
          <div className="absolute left-4 right-4 top-4 z-[410] rounded-lg border border-white/10 bg-ink-950/90 px-4 py-3 text-sm text-steel-300 shadow-panel backdrop-blur" role="status">
            No mapped records match the current filters.
          </div>
        )}
        <div className="absolute right-4 top-4 z-[400] w-[180px] rounded-lg border border-white/10 bg-ink-950/90 p-3 text-xs text-steel-300 shadow-panel backdrop-blur">
          <p className="font-semibold text-white">Layer selector</p>
          <label className="mt-2 flex items-center justify-between gap-3">
            <span>Markers</span>
            <input className="h-4 w-4 accent-pulse-cyan" type="checkbox" checked={showMarkers} onChange={() => setShowMarkers((current) => !current)} />
          </label>
          <label className="mt-2 flex items-center justify-between gap-3">
            <span>Heatmap</span>
            <input className="h-4 w-4 accent-pulse-cyan" type="checkbox" checked={showHeat} onChange={() => setShowHeat((current) => !current)} />
          </label>
          <label className="mt-2 flex items-center justify-between gap-3">
            <span>Satellite</span>
            <input className="h-4 w-4 accent-pulse-cyan" type="checkbox" checked={base === 'satellite'} onChange={() => setBase((current) => (current === 'osm' ? 'satellite' : 'osm'))} />
          </label>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 max-w-[240px] rounded-lg border border-white/10 bg-ink-950/90 p-3 text-xs text-steel-300 shadow-panel backdrop-blur">
          <p className="font-semibold text-white">Interactive layers</p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2"><span className="h-2 w-8 rounded-full bg-pulse-cyan" /> Administrative points</div>
            <div className="flex items-center gap-2"><span className="h-2 w-8 rounded-full bg-pulse-amber" /> Density and heat</div>
            <div className="flex items-center gap-2"><span className="h-2 w-8 rounded-full bg-pulse-rose" /> High intensity</div>
            <div className="flex items-center gap-2"><span className="h-2 w-8 rounded-full bg-pulse-violet" /> 3D and terrain ready</div>
          </div>
        </div>
      </div>
    </section>
  );
}
