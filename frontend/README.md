# La Olla de Datos Frontend

Commercial-quality responsive frontend for La Olla de Datos.

## Stack

- React + TypeScript + Vite
- Tailwind CSS design system
- OpenStreetMap + Leaflet
- Marker clustering, heatmap, legends, fullscreen map, layer controls
- Recharts analytics
- Backend-powered AI assistant through `/api/v1/ai/generate`
- PWA-ready manifest and icon

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the backend API. `VITE_API_BASE_URL` is still supported for compatibility.

```bash
VITE_API_URL=http://localhost:4000/api/v1
```

## Backend Integration

The app consumes the existing backend endpoints:

- `/dashboard/overview`
- `/maps/config`
- `/maps/heatmap`
- `/insights`
- `/datasets`
- `/reports/tourism-places`
- `/exports/tourism-places`
- `/ai/generate`

If the backend is offline, the app uses local fallback data so the product can still be presented.

## Responsive Behavior

- Desktop: permanent sidebar, docked assistant, persistent map panel.
- Tablet: hamburger navigation and responsive dashboard grids.
- Mobile: full-screen navigation drawer, visible map section, full-screen AI modal.

## PWA Notes

The manifest and app icon are included. Service workers are intentionally not enabled yet so offline caching can be added after API caching rules are finalized.
