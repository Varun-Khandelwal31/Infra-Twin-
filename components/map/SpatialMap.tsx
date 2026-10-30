'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  MapPin,
  Calendar,
  Layers,
  Activity,
  ExternalLink,
  Bot,
  Globe,
  Info,
  HelpCircle,
  Compass,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Search,
  Scale,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  searchPanIndiaLocation,
  resolveLocationFromCoordinates,
  PAN_INDIA_STATES,
  IndianStateData,
} from '@/lib/panIndiaData';
import DataProvenanceModal from '@/components/common/DataProvenanceModal';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export interface RoadFeature {
  id: string;
  name: string;
  city: string;
  state?: string;
  ward: string;
  status: string;
  trafficVolume: string;
  potholesCount: number;
  inspectionId: string;
  historicalScores: number[];
  coordinates: [number, number][]; // [lng, lat]
}

function parseGeoJSONFeatures(geojson: any): RoadFeature[] {
  if (!geojson || !Array.isArray(geojson.features)) return [];
  return geojson.features.map((f: any) => ({
    id: f.id || f.properties?.id || `road-${Math.random()}`,
    name: f.properties?.name || 'Unknown Pavement Stretch',
    city: f.properties?.city || 'Delhi',
    state: f.properties?.state || 'Delhi (NCT)',
    ward: f.properties?.ward || 'Municipal Zone',
    status: f.properties?.status || 'Fair',
    trafficVolume: f.properties?.trafficVolume || '4,500 PCU/hr',
    potholesCount: f.properties?.potholesCount ?? 0,
    inspectionId: f.properties?.inspectionId || 'IR-2026-05-27-1045',
    historicalScores: f.properties?.historicalScores || [80, 78, 75, 72, 70, 68],
    coordinates: f.geometry?.coordinates || [],
  }));
}

export interface ScannedPotholePin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  color: 'green' | 'yellow' | 'red';
  status: 'Good' | 'Fair' | 'Critical';
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  areaSqm: number;
  maxDepthCm: number;
  volumeCum: number;
  sampleId: string;
}

const PAN_INDIA_PINS: ScannedPotholePin[] = [
  // Delhi NCR
  {
    id: 'pin-del-1',
    name: 'Outer Ring Road (IIT Flyover)',
    lat: 28.5480,
    lng: 77.1850,
    city: 'Delhi',
    state: 'Delhi (NCT)',
    color: 'red',
    status: 'Critical',
    severity: 'Critical',
    areaSqm: 4.1,
    maxDepthCm: 18.2,
    volumeCum: 0.746,
    sampleId: 'sample-2',
  },
  {
    id: 'pin-del-2',
    name: 'Connaught Place Outer Circle',
    lat: 28.6330,
    lng: 77.2140,
    city: 'Delhi',
    state: 'Delhi (NCT)',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 2.5,
    maxDepthCm: 15.0,
    volumeCum: 0.375,
    sampleId: 'sample-1',
  },

  // Uttar Pradesh (Lucknow & Varanasi)
  {
    id: 'pin-lko-1',
    name: 'Gomti Nagar Shaheed Path Corridor',
    lat: 26.8520,
    lng: 80.9980,
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    color: 'red',
    status: 'Critical',
    severity: 'High',
    areaSqm: 3.8,
    maxDepthCm: 16.5,
    volumeCum: 0.627,
    sampleId: 'sample-2',
  },
  {
    id: 'pin-vns-1',
    name: 'Varanasi Ring Road Phase II',
    lat: 25.3650,
    lng: 82.9800,
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    color: 'red',
    status: 'Critical',
    severity: 'Critical',
    areaSqm: 4.6,
    maxDepthCm: 19.0,
    volumeCum: 0.874,
    sampleId: 'sample-2',
  },

  // Mumbai MMR
  {
    id: 'pin-bom-1',
    name: 'Western Express Highway (Andheri Flyover)',
    lat: 19.1240,
    lng: 72.8580,
    city: 'Mumbai',
    state: 'Maharashtra',
    color: 'red',
    status: 'Critical',
    severity: 'Critical',
    areaSqm: 5.8,
    maxDepthCm: 19.5,
    volumeCum: 1.131,
    sampleId: 'sample-2',
  },
  {
    id: 'pin-bom-2',
    name: 'Bandra-Worli Sea Link Approach',
    lat: 19.0300,
    lng: 72.8160,
    city: 'Mumbai',
    state: 'Maharashtra',
    color: 'green',
    status: 'Good',
    severity: 'Low',
    areaSqm: 0.9,
    maxDepthCm: 4.0,
    volumeCum: 0.036,
    sampleId: 'sample-3',
  },

  // Pune
  {
    id: 'pin-pun-1',
    name: 'Hinjewadi IT Park Phase 1 Main Road',
    lat: 18.5880,
    lng: 73.7460,
    city: 'Pune',
    state: 'Maharashtra',
    color: 'red',
    status: 'Critical',
    severity: 'High',
    areaSqm: 4.8,
    maxDepthCm: 17.5,
    volumeCum: 0.840,
    sampleId: 'sample-2',
  },

  // Bengaluru
  {
    id: 'pin-blr-1',
    name: 'Outer Ring Road (Bellandur EcoSpace)',
    lat: 12.9380,
    lng: 77.6830,
    city: 'Bengaluru',
    state: 'Karnataka',
    color: 'red',
    status: 'Critical',
    severity: 'Critical',
    areaSqm: 6.2,
    maxDepthCm: 21.0,
    volumeCum: 1.302,
    sampleId: 'sample-2',
  },
  {
    id: 'pin-blr-2',
    name: 'Electronic City Elevated Expressway',
    lat: 12.8620,
    lng: 77.6520,
    city: 'Bengaluru',
    state: 'Karnataka',
    color: 'green',
    status: 'Good',
    severity: 'Low',
    areaSqm: 0.8,
    maxDepthCm: 3.8,
    volumeCum: 0.030,
    sampleId: 'sample-3',
  },

  // Hyderabad
  {
    id: 'pin-hyd-1',
    name: 'HITEC City Cyber Towers Corridor',
    lat: 17.4470,
    lng: 78.3820,
    city: 'Hyderabad',
    state: 'Telangana',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 3.4,
    maxDepthCm: 14.0,
    volumeCum: 0.476,
    sampleId: 'sample-1',
  },

  // Chennai
  {
    id: 'pin-maa-1',
    name: 'OMR IT Expressway (Sholinganallur)',
    lat: 12.9000,
    lng: 80.2430,
    city: 'Chennai',
    state: 'Tamil Nadu',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 3.9,
    maxDepthCm: 15.0,
    volumeCum: 0.585,
    sampleId: 'sample-1',
  },

  // Kerala (Kochi)
  {
    id: 'pin-cok-1',
    name: 'Kochi Seaport-Airport Road Corridor',
    lat: 10.0100,
    lng: 76.3450,
    city: 'Kochi',
    state: 'Kerala',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 3.2,
    maxDepthCm: 13.5,
    volumeCum: 0.432,
    sampleId: 'sample-1',
  },

  // Rajasthan (Jaipur)
  {
    id: 'pin-jai-1',
    name: 'Tonk Road Elevated Arterial',
    lat: 26.8400,
    lng: 75.8050,
    city: 'Jaipur',
    state: 'Rajasthan',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 3.5,
    maxDepthCm: 14.2,
    volumeCum: 0.497,
    sampleId: 'sample-1',
  },

  // West Bengal (Kolkata)
  {
    id: 'pin-ccu-1',
    name: 'EM Bypass Salt Lake Sector V',
    lat: 22.5480,
    lng: 88.3980,
    city: 'Kolkata',
    state: 'West Bengal',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 4.5,
    maxDepthCm: 16.0,
    volumeCum: 0.720,
    sampleId: 'sample-1',
  },

  // Bihar (Patna)
  {
    id: 'pin-pat-1',
    name: 'Patna Marine Drive (Ganga Path)',
    lat: 25.6250,
    lng: 85.1350,
    city: 'Patna',
    state: 'Bihar',
    color: 'green',
    status: 'Good',
    severity: 'Low',
    areaSqm: 1.1,
    maxDepthCm: 4.5,
    volumeCum: 0.050,
    sampleId: 'sample-3',
  },

  // Assam & North-East (Guwahati)
  {
    id: 'pin-gau-1',
    name: 'GS Road (Khanapara Dispur)',
    lat: 26.1400,
    lng: 91.7850,
    city: 'Guwahati',
    state: 'Assam',
    color: 'red',
    status: 'Critical',
    severity: 'High',
    areaSqm: 4.2,
    maxDepthCm: 17.0,
    volumeCum: 0.714,
    sampleId: 'sample-2',
  },

  // Ladakh (Leh)
  {
    id: 'pin-leh-1',
    name: 'Leh-Manali Highway (Karu Sector)',
    lat: 34.1450,
    lng: 77.5800,
    city: 'Leh',
    state: 'Ladakh',
    color: 'yellow',
    status: 'Fair',
    severity: 'Moderate',
    areaSqm: 2.8,
    maxDepthCm: 12.0,
    volumeCum: 0.336,
    sampleId: 'sample-1',
  },
];

export type RegionalZone =
  | 'All India'
  | 'North Zone'
  | 'South Zone'
  | 'West Zone'
  | 'East & Central'
  | 'North-East'
  | 'National Expressways';

const ZONE_CENTERS: Record<RegionalZone, { center: [number, number]; zoom: number }> = {
  'All India': { center: [78.9629, 21.5937], zoom: 4.7 },
  'North Zone': { center: [77.2167, 28.6315], zoom: 8.5 },
  'South Zone': { center: [78.4867, 13.9716], zoom: 7.2 },
  'West Zone': { center: [73.8567, 19.5204], zoom: 7.5 },
  'East & Central': { center: [85.1376, 23.5726], zoom: 7.0 },
  'North-East': { center: [92.7362, 26.1445], zoom: 7.0 },
  'National Expressways': { center: [77.5000, 24.5000], zoom: 5.5 },
};

const MAP_STYLES = [
  { id: 'dark', label: 'Mapbox / OSM Dark', url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' },
  { id: 'osm', label: 'OpenStreetMap Standard', url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' },
  { id: 'light', label: 'OpenStreetMap Light', url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
];

export default function SpatialMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const activePopupRef = useRef<maplibregl.Popup | null>(null);
  const activeMarkerRef = useRef<maplibregl.Marker | null>(null);

  const [roads, setRoads] = useState<RoadFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMonthIdx, setSelectedMonthIdx] = useState(5); // June
  const [selectedRoad, setSelectedRoad] = useState<RoadFeature | null>(null);
  const [currentZone, setCurrentZone] = useState<RegionalZone>('All India');
  const [currentStyle, setCurrentStyle] = useState('dark');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);

  // Pan-India Search Input & Autocomplete State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Dynamic Pin Dropped by user click
  const [dynamicClickLocation, setDynamicClickLocation] = useState<{
    lat: number;
    lng: number;
    resolvedName: string;
    stateData: IndianStateData;
  } | null>(null);

  // Fetch roads GeoJSON on mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/roads')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch road networks`);
        return res.json();
      })
      .then((geojson) => {
        const parsed = parseGeoJSONFeatures(geojson);
        setRoads(parsed);
        if (parsed.length > 0) {
          setSelectedRoad(parsed[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching /api/roads:', err);
        setError(err?.message || 'Failed to load road networks');
        setLoading(false);
      });
  }, []);

  // Construct GeoJSON FeatureCollection with temporal scores
  const getGeoJSON = (monthIdx: number, roadList: RoadFeature[]) => {
    return {
      type: 'FeatureCollection',
      features: roadList.map((road) => {
        const score = road.historicalScores[monthIdx] ?? 70;
        return {
          type: 'Feature',
          id: road.id,
          properties: {
            id: road.id,
            name: road.name,
            city: road.city,
            state: road.state,
            ward: road.ward,
            healthScore: score,
            trafficVolume: road.trafficVolume,
            potholesCount: road.potholesCount,
          },
          geometry: {
            type: 'LineString',
            coordinates: road.coordinates,
          },
        };
      }),
    };
  };

  // Add Vector Layers & Pins to Map
  const addMapLayersAndMarkers = (map: maplibregl.Map, monthIdx: number, roadList: RoadFeature[]) => {
    if (!map.getSource('roads-source')) {
      map.addSource('roads-source', {
        type: 'geojson',
        data: getGeoJSON(monthIdx, roadList) as any,
      });

      // Add Color Coded Road Network Layer (PCI Health)
      map.addLayer({
        id: 'roads-line-layer',
        type: 'line',
        source: 'roads-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': [
            'step',
            ['get', 'healthScore'],
            '#ef4444', 50,
            '#f59e0b', 80,
            '#10b981',
          ],
          'line-width': 5,
        },
      });

      // Click event on road lines
      map.on('click', 'roads-line-layer', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const matched = roadList.find((r) => r.id === feat.id || r.name === feat.properties?.name);
        if (matched) {
          setSelectedRoad(matched);
        }
      });

      map.on('mouseenter', 'roads-line-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'roads-line-layer', () => {
        map.getCanvas().style.cursor = '';
      });
    }

    // Add Red/Yellow/Green Scanned Pothole Pins with Interactive Popups
    PAN_INDIA_PINS.forEach((pin) => {
      const el = document.createElement('div');
      el.className = 'custom-map-pin cursor-pointer transition-transform transform hover:scale-125';

      let badgeBg = '#10b981';
      let borderGlow = '0 0 12px rgba(16, 185, 129, 0.8)';
      if (pin.color === 'red') {
        badgeBg = '#ef4444';
        borderGlow = '0 0 14px rgba(239, 68, 68, 0.9)';
      } else if (pin.color === 'yellow') {
        badgeBg = '#f59e0b';
        borderGlow = '0 0 12px rgba(245, 158, 11, 0.8)';
      }

      el.innerHTML = `
        <div style="
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: ${badgeBg};
          border: 2px solid #ffffff;
          box-shadow: ${borderGlow};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: bold;
          font-size: 13px;
        ">📍</div>
      `;

      el.addEventListener('click', () => {
        if (activePopupRef.current) {
          activePopupRef.current.remove();
        }

        const isRed = pin.color === 'red';
        const popupNode = document.createElement('div');
        popupNode.className = 'p-3 text-slate-100 font-sans max-w-xs';
        popupNode.innerHTML = `
          <div style="background: #090d16; border: 1px solid ${isRed ? 'rgba(239,68,68,0.5)' : 'rgba(0,217,255,0.4)'}; padding: 14px; border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.85);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: bold; font-size: 12px; color: #fff;">${pin.name}</span>
              <span style="background: ${isRed ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}; color: ${isRed ? '#f87171' : '#34d399'}; border: 1px solid ${isRed ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">
                ${pin.status}
              </span>
            </div>
            <div style="font-size: 10px; color: #38bdf8; margin-bottom: 8px; font-family: monospace;">
              ${pin.city}, ${pin.state}
            </div>
            
            <div style="font-family: monospace; font-size: 11px; background: rgba(15,23,42,0.85); border: 1px solid rgba(51,65,85,0.6); padding: 8px; border-radius: 8px; margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #94a3b8;">Distress Area:</span>
                <strong style="color: #f1f5f9;">${pin.areaSqm} m²</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #94a3b8;">Void Depth:</span>
                <strong style="color: ${isRed ? '#f87171' : '#fbbf24'};">${pin.maxDepthCm} cm</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Volumetric Mass:</span>
                <strong style="color: #38bdf8;">${pin.volumeCum} m³</strong>
              </div>
            </div>

            <div style="display: flex; gap: 6px;">
              <a href="/audit?sample=${pin.sampleId}" style="flex: 1; background: #0f172a; border: 1px solid #334155; color: #38bdf8; text-align: center; padding: 7px; border-radius: 8px; font-size: 10px; font-weight: bold; text-decoration: none;">3D LiDAR Audit</a>
              <a href="/copilot?location=${encodeURIComponent(pin.city + ', ' + pin.state)}&area=${pin.areaSqm}&depth=${pin.maxDepthCm}" style="flex: 1; background: linear-gradient(to right, #06b6d4, #2563eb); color: #090d16; text-align: center; padding: 7px; border-radius: 8px; font-size: 10px; font-weight: bold; text-decoration: none;">GenAI BOQ</a>
            </div>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 25, closeButton: true })
          .setLngLat([pin.lng, pin.lat])
          .setDOMContent(popupNode)
          .addTo(map);

        activePopupRef.current = popup;
      });

      new maplibregl.Marker(el)
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);
    });

    // MAP CLICK ANYWHERE LISTENER: Reverse Geocodes location & generates dynamic road inspection
    map.on('click', (e) => {
      // Check if clicked directly on road layer (if so, road click handler handles it)
      const features = map.queryRenderedFeatures(e.point, { layers: ['roads-line-layer'] });
      if (features && features.length > 0) return;

      const { lng, lat } = e.lngLat;
      // Only handle clicks within Indian territorial bounds
      if (lat < 6.5 || lat > 37.5 || lng < 68.0 || lng > 98.0) return;

      const resolved = resolveLocationFromCoordinates(lat, lng);
      const st = resolved.stateData;
      const roadName = `${resolved.nearestCityName} Arterial Sector (${st.state})`;

      // Create synthetic road telemetry for the clicked Indian location
      const newRoad: RoadFeature = {
        id: `road-click-${Date.now().toString().slice(-5)}`,
        name: roadName,
        city: resolved.nearestCityName,
        state: st.state,
        ward: `${st.code} Highway Sub-division`,
        status: 'Fair',
        trafficVolume: '6,200 PCU/hr',
        potholesCount: 4,
        inspectionId: `IR-${st.code}-${Date.now().toString().slice(-4)}`,
        historicalScores: [82, 78, 74, 71, 68, 66],
        coordinates: [
          [lng - 0.015, lat - 0.01],
          [lng, lat],
          [lng + 0.015, lat + 0.01],
        ],
      };

      setDynamicClickLocation({
        lat,
        lng,
        resolvedName: `${resolved.nearestCityName}, ${st.state}`,
        stateData: st,
      });

      setSelectedRoad(newRoad);

      // Move or create the active dynamic marker
      if (activeMarkerRef.current) {
        activeMarkerRef.current.setLngLat([lng, lat]);
      } else {
        const markerEl = document.createElement('div');
        markerEl.innerHTML = `
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #00d9ff;
            border: 3px solid #ffffff;
            box-shadow: 0 0 20px #00d9ff;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-weight: 900;
            font-size: 14px;
            animation: bounce 1s infinite alternate;
          ">🎯</div>
        `;
        const marker = new maplibregl.Marker(markerEl).setLngLat([lng, lat]).addTo(map);
        activeMarkerRef.current = marker;
      }
    });
  };

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || loading || roads.length === 0) return;

    const initialCoord = ZONE_CENTERS['All India'];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[0].url,
      center: initialCoord.center,
      zoom: initialCoord.zoom,
      pitch: 42,
      bearing: -10,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      addMapLayersAndMarkers(map, selectedMonthIdx, roads);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [loading, roads]);

  // Fly to Regional Zone
  const handleZoneSwitch = (zone: RegionalZone) => {
    setCurrentZone(zone);
    const target = ZONE_CENTERS[zone];
    if (mapRef.current && target) {
      mapRef.current.flyTo({
        center: target.center,
        zoom: target.zoom,
        pitch: zone === 'All India' ? 20 : 45,
        duration: 1600,
      });
    }
  };

  // Handle Pan-India Search Query Execution
  const handleSearchLocation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const matched = searchPanIndiaLocation(searchQuery);
    if (!matched) {
      setSearchFeedback(`⚠️ Location not recognized. Try typing an Indian city like Lucknow, Kochi, Guwahati, Jaipur...`);
      setTimeout(() => setSearchFeedback(null), 4000);
      return;
    }

    setSearchFeedback(`✓ Located ${matched.queryResolved} (CPWD Index: ${matched.matchedState.cpwdCostIndex}%)`);
    setTimeout(() => setSearchFeedback(null), 4500);

    const lat = matched.matchedCity?.lat ?? 28.6139;
    const lng = matched.matchedCity?.lng ?? 77.2090;

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 12.5,
        pitch: 50,
        duration: 1800,
      });
    }

    // Auto-select road in that city if exists, or synthesize one
    const existingRoad = roads.find((r) => r.city.toLowerCase() === matched.matchedCity?.name.toLowerCase());
    if (existingRoad) {
      setSelectedRoad(existingRoad);
    } else {
      const st = matched.matchedState;
      const synthRoad: RoadFeature = {
        id: `road-search-${Date.now()}`,
        name: `${matched.matchedCity?.name} Main Commercial Arterial`,
        city: matched.matchedCity?.name || st.capital,
        state: st.state,
        ward: `${st.code} Urban Infrastructure Zone`,
        status: 'Fair',
        trafficVolume: '8,400 PCU/hr',
        potholesCount: 5,
        inspectionId: `IR-${st.code}-2026`,
        historicalScores: [84, 80, 76, 73, 70, 68],
        coordinates: [
          [lng - 0.01, lat - 0.008],
          [lng, lat],
          [lng + 0.01, lat + 0.008],
        ],
      };
      setSelectedRoad(synthRoad);
    }
  };

  // Update map source on temporal slider month change or roads update
  useEffect(() => {
    if (!mapRef.current || roads.length === 0) return;
    const map = mapRef.current;
    if (map.isStyleLoaded()) {
      const source = map.getSource('roads-source') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(getGeoJSON(selectedMonthIdx, roads) as any);
      }
    }
  }, [selectedMonthIdx, roads]);

  // Handle Style Switch
  const handleStyleChange = (styleObj: typeof MAP_STYLES[0]) => {
    setCurrentStyle(styleObj.id);
    if (!mapRef.current) return;
    const map = mapRef.current;
    map.setStyle(styleObj.url);
    map.once('style.load', () => {
      addMapLayersAndMarkers(map, selectedMonthIdx, roads);
    });
  };

  // Fly to selected road
  const handleSelectRoad = (road: RoadFeature) => {
    setSelectedRoad(road);
    if (mapRef.current && road.coordinates.length > 0) {
      const [lng, lat] = road.coordinates[0];
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 13.5,
        pitch: 50,
        duration: 1500,
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-6rem)] rounded-2xl border border-slate-200/90 bg-white p-8 flex flex-col items-center justify-center space-y-4 shadow-xs">
        <Activity className="w-8 h-8 text-cyan-600 animate-spin" />
        <div className="text-sm font-mono font-bold text-slate-800">
          Fetching Pan-India GeoJSON Road Networks across 36 States &amp; UTs...
        </div>
        <div className="w-64 h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[calc(100vh-6rem)] rounded-2xl border border-rose-200 bg-white p-8 flex flex-col items-center justify-center space-y-4 shadow-xs">
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
          ⚠️ {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-mono cursor-pointer"
        >
          Retry Load
        </button>
      </div>
    );
  }

  const currentScore = selectedRoad ? selectedRoad.historicalScores[selectedMonthIdx] : 0;
  const trendData = selectedRoad
    ? MONTHS.map((m, idx) => ({
        month: m,
        score: selectedRoad.historicalScores[idx],
      }))
    : [];

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] flex flex-col lg:flex-row overflow-hidden rounded-2xl border border-slate-200/90 shadow-md bg-white">
      {/* Map Container */}
      <div className="relative flex-1 h-full min-h-[450px]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* TOP CONTROLS: Pan-India Quick-Search Bar & Zone Filters */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto max-w-2xl">
            {/* Search Bar Across All Indian Cities / Highways */}
            <form onSubmit={handleSearchLocation} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search any Indian place (e.g. Lucknow, Kochi, Guwahati, NH-44, Leh)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72 sm:w-96 pl-9 pr-20 py-2 rounded-xl bg-white/95 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs font-sans shadow-md backdrop-blur-xl focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-4 h-4 text-cyan-600 absolute left-3 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[11px] font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                Locate
              </button>
            </form>

            {/* Statutory Data Sources Button */}
            <button
              onClick={() => setIsProvenanceOpen(true)}
              className="px-3 py-2 rounded-xl bg-white/90 hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs backdrop-blur-xl transition-all cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-cyan-600" />
              <span>Data Sources</span>
            </button>

            {/* How to Read This Map Toggle Button */}
            <button
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="px-3 py-2 rounded-xl bg-white/90 hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-xs backdrop-blur-xl transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span>Map Guide</span>
              {isGuideOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Map Style Selector Pills */}
          <div className="flex items-center bg-white/90 p-1 rounded-xl border border-slate-200 text-xs pointer-events-auto backdrop-blur-xl shadow-xs">
            {MAP_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => handleStyleChange(s)}
                className={cn(
                  'px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer',
                  currentStyle === s.id
                    ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {s.label.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Search Feedback Banner */}
        {searchFeedback && (
          <div className="absolute top-16 left-4 z-20 p-2.5 rounded-xl bg-white/95 border border-cyan-300 text-cyan-900 text-xs font-mono shadow-md animate-fadeIn">
            {searchFeedback}
          </div>
        )}

        {/* REGIONAL ZONE FILTER PILLS */}
        <div className="absolute top-16 right-4 z-10 flex flex-wrap items-center gap-1.5 bg-white/95 p-1.5 rounded-xl border border-slate-200 text-xs font-mono backdrop-blur-xl shadow-md">
          {(
            [
              'All India',
              'North Zone',
              'South Zone',
              'West Zone',
              'East & Central',
              'North-East',
              'National Expressways',
            ] as RegionalZone[]
          ).map((zone) => (
            <button
              key={zone}
              onClick={() => handleZoneSwitch(zone)}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-all text-xs font-bold cursor-pointer',
                currentZone === zone
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {zone === 'All India' ? '🇮🇳 Pan-India' : zone}
            </button>
          ))}
        </div>

        {/* INTERACTIVE GUIDE COLLAPSIBLE OVERLAY */}
        {isGuideOpen && (
          <div className="absolute top-20 left-4 z-30 max-w-lg p-4 rounded-2xl bg-white/95 border border-slate-200 text-slate-800 text-xs font-sans shadow-2xl backdrop-blur-2xl animate-fadeIn space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900 font-mono uppercase flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-600" />
                <span>Pan-India Spatial Digital Twin Guide</span>
              </span>
              <button onClick={() => setIsGuideOpen(false)} className="text-slate-400 hover:text-slate-700 font-mono cursor-pointer">✕</button>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              This spatial digital twin covers all 28 Indian States &amp; 8 UTs. You can click <strong>anywhere on India&apos;s map</strong> or search any town/highway to instantly reverse-geocode the location, fetch localized CPWD cost indices, and generate an IRC:82 Bill of Quantities!
            </p>

            <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
                <strong className="block text-rose-950 font-bold">🔴 Red (&lt;50 PCI)</strong>
                Critical pothole cavity (&gt;15cm depth). Immediate saw-cut repair needed.
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                <strong className="block text-amber-950 font-bold">🟡 Yellow (50-80)</strong>
                Moderate rutting &amp; surface fatigue. Slated for micro-surfacing.
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                <strong className="block text-emerald-950 font-bold">🟢 Green (&gt;80 PCI)</strong>
                Compliant, newly sealed bituminous surface (IRC:82 standards).
              </div>
            </div>

            <div className="text-[10px] font-mono text-cyan-700 pt-1 border-t border-slate-200 flex items-center justify-between">
              <span>🎯 Click anywhere on map to inspect location</span>
              <span>📅 Use bottom slider to simulate monsoon degradation</span>
            </div>
          </div>
        )}

        {/* Selected City Road Corridors Selector */}
        <div className="absolute bottom-24 left-4 z-10 flex flex-wrap gap-2 max-w-xl max-h-24 overflow-y-auto pr-2">
          {roads.slice(0, 8).map((road) => {
            const score = road.historicalScores[selectedMonthIdx];
            const isSelected = selectedRoad?.id === road.id;
            let bgStyle = 'border-emerald-200 text-emerald-700 bg-white/90';
            if (score < 50) bgStyle = 'border-rose-200 text-rose-700 bg-white/90';
            else if (score < 80) bgStyle = 'border-amber-200 text-amber-700 bg-white/90';

            return (
              <button
                key={road.id}
                onClick={() => handleSelectRoad(road)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all backdrop-blur-md border cursor-pointer shadow-xs',
                  isSelected
                    ? 'bg-cyan-50 text-cyan-800 border-cyan-400 shadow-sm font-bold scale-102'
                    : `hover:bg-slate-50 ${bgStyle}`
                )}
              >
                {road.city}: {road.name.slice(0, 18)}... ({score})
              </button>
            );
          })}
        </div>

        {/* Bottom Temporal Slider Controls */}
        <div className="absolute bottom-4 left-4 right-4 lg:right-96 z-10 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md text-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 shrink-0">
            <Calendar className="w-4 h-4 text-cyan-600" />
            <span>Monsoon Degradation Simulator</span>
          </div>

          <div className="flex-1 max-w-md flex items-center gap-4">
            <span className="text-xs font-mono font-bold text-cyan-700 shrink-0">
              {MONTHS[selectedMonthIdx]} 2026
            </span>
            <input
              type="range"
              min={0}
              max={5}
              value={selectedMonthIdx}
              onChange={(e) => setSelectedMonthIdx(Number(e.target.value))}
              className="w-full accent-cyan-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono shrink-0">
            <span>Simulates water ingress &amp; axle load wear across India</span>
          </div>
        </div>
      </div>

      {/* Right Drawer / Popup Panel for Selected Road or Clicked Location */}
      {selectedRoad && (
        <div className="w-full lg:w-96 bg-white/95 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto shrink-0 z-20 text-slate-800 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold">
                {selectedRoad.city} • {selectedRoad.state || 'India'}
              </span>
              <span className="text-xs font-mono text-slate-500">{selectedRoad.ward}</span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 font-display mb-1">
              {selectedRoad.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-mono">
              <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span>Inspection Ref: {selectedRoad.inspectionId}</span>
            </div>

            {/* Score & Status Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500 font-mono">Pavement Condition Index (PCI)</div>
                <div className="text-3xl font-extrabold font-display text-slate-900 mt-0.5">
                  {currentScore} <span className="text-xs text-slate-400 font-mono font-normal">/ 100</span>
                </div>
              </div>

              <span
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold font-mono border',
                  currentScore > 80
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : currentScore > 50
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                )}
              >
                {selectedRoad.status}
              </span>
            </div>

            {/* Historical Degradation Line Chart (Recharts) */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-700 font-display mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-600" />
                <span>6-Month PCI Degradation Trend Line</span>
              </h3>

              <div className="w-full h-36 bg-slate-50/80 rounded-xl p-2 border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '11px', color: '#0f172a' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#0284c7"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#0284c7' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Traffic & Distress Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-6">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-mono">Traffic Volume</div>
                <div className="font-bold text-slate-800 font-display mt-0.5">{selectedRoad.trafficVolume}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-mono">Detected Potholes</div>
                <div className="font-bold text-rose-600 font-display mt-0.5">{selectedRoad.potholesCount} Critical</div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <Link
              href={`/copilot?location=${encodeURIComponent(selectedRoad.name + ', ' + selectedRoad.city + ', ' + (selectedRoad.state || 'India'))}`}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Generate Localized BOQ for this Road</span>
            </Link>

            <Link
              href={`/audit?sample=sample-1`}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              <span>Inspect in 3D AI Audit Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Official Data Provenance Modal */}
      <DataProvenanceModal
        isOpen={isProvenanceOpen}
        onClose={() => setIsProvenanceOpen(false)}
      />
    </div>
  );
}
