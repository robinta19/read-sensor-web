// components/MapView.tsx
"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";
import L, { DivIcon } from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import IconPlus from "./iconPlus";
import IconMin from "./iconMin";
import SearchIcon from "./searchIcon";

type SensorPoint = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  suhu: number;        // °C
  ph: number;
  salinitas: number;   // ppt
  kualitasAir: number; // ppm
  sensorLain: number;
};

const POINTS: SensorPoint[] = [
  { id: 1, name: "Point 1", lat: -5.3898, lng: 105.1998, suhu: 28, ph: 8.0, salinitas: 50, kualitasAir: 300, sensorLain: 50 },
  { id: 2, name: "Point 2", lat: -5.3990, lng: 105.2500, suhu: 29, ph: 7.6, salinitas: 52, kualitasAir: 280, sensorLain: 47 },
  { id: 3, name: "Point 3", lat: -5.3600, lng: 105.3200, suhu: 27, ph: 7.9, salinitas: 49, kualitasAir: 310, sensorLain: 51 },
  { id: 4, name: "Point 4", lat: -5.4400, lng: 105.1700, suhu: 30, ph: 8.1, salinitas: 55, kualitasAir: 295, sensorLain: 48 },
];

const DEFAULT_CENTER: [number, number] = [-5.405, 105.25];
const DEFAULT_ZOOM = 10;

/** PIN MERAH (SVG) */
function useRedPin(): DivIcon {
  return useMemo(() => {
    const html = `
    <div style="position:relative;width:34px;height:34px">
      <svg width="34" height="34" viewBox="0 0 64 64">
        <path d="M32 4c-12.15 0-22 9.85-22 22 0 16 22 34 22 34s22-18 22-34c0-12.15-9.85-22-22-22z" fill="#ff3b3b"/>
        <circle cx="32" cy="26" r="10" fill="#fff"/>
      </svg>
    </div>`;
    return L.divIcon({
      className: "custom-red-pin",
      html,
      iconSize: [34, 34],
      iconAnchor: [17, 33],
      popupAnchor: [0, -24],
    });
  }, []);
}

/** Kontrol custom kanan-bawah + watcher zoom (bersih, return void) */
function ZoomOverlay() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handler = () => setZoom(map.getZoom());
    map.on("zoomend", handler);
    // optional: update juga saat animasi zoom sedang berjalan
    map.on("zoom", handler);

    return () => {
      map.off("zoomend", handler);
      map.off("zoom", handler);
    };
  }, [map]);

  // Lebih akurat: hitung % berdasarkan min/max zoom peta
  const min = map.getMinZoom();
  const max = map.getMaxZoom();
  const percent =
    max > min ? Math.round(((zoom - min) / (max - min)) * 100) : Math.round((zoom / 20) * 100);

  return (
    <div className="absolute bottom-10 right-10 z-[500] flex items-center gap-3 pointer-events-auto">
      <div
        className="flex justify-center cursor-pointer items-center h-[40px] w-[40px] bg-white rounded-xl shadow-md hover:bg-gray-50"
        onClick={() => map.zoomOut()}
        title="Zoom out"
      >
        <IconMin />
      </div>

      <div className="flex  items-center gap-2 h-[40px] bg-white rounded-xl shadow-md px-3 py-2">
        <SearchIcon />
        <span className="text-sm text-gray-700">{percent}%</span>
      </div>

      <div
        className="flex justify-center cursor-pointer items-center h-[40px] w-[40px] bg-white rounded-xl shadow-md hover:bg-gray-50"
        onClick={() => map.zoomIn()}
        title="Zoom in"
      >
        <IconPlus />
      </div>
    </div>
  );
}

export default function MapView() {
  const redPin = useRedPin();

  // contoh polygon hijau (opsional)
  // const polygonLatLngs: [number, number][] = [
  //   [-5.42, 105.06],
  //   [-5.33, 105.11],
  //   [-5.32, 105.21],
  //   [-5.41, 105.28],
  //   [-5.50, 105.19],
  // ];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
    

      {/* PETA */}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* <Polygon
          positions={polygonLatLngs}
          pathOptions={{ color: "#4caf50", fillColor: "#4caf50", fillOpacity: 0.25, weight: 1 }}
        /> */}

        {/* Marker + Popup deklaratif (TIDAK dobel) */}
        {POINTS.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={redPin}>
            <Popup >
              <div className="">
                <div className="font-semibold text-lg">{p.name}</div>
                <div className="text-xs text-gray-500 leading-5">
                  Latitude : {p.lat.toFixed(12)}, {p.lng.toFixed(12)}
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-gray-600">Suhu</div>
                  <div className="font-medium">: {p.suhu}°</div>

                  <div className="text-gray-600">pH</div>
                  <div className="font-medium">: {p.ph}</div>

                  <div className="text-gray-600">Salinitas</div>
                  <div className="font-medium">: {p.salinitas} ppt</div>

                  <div className="text-gray-600">Kualitas Air</div>
                  <div className="font-medium">: {p.kualitasAir} ppm</div>

                  <div className="text-gray-600">Sensor Lain</div>
                  <div className="font-medium">: {p.sensorLain}</div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => alert(`Detail ${p.name}`)}
                    className="mt-1 inline-flex items-center justify-center rounded-lg bg-[#2A6AF5] text-white px-4 py-2 text-sm font-medium hover:opacity-90"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Overlay kontrol */}
        <ZoomOverlay />
      </MapContainer>
    </div>
  );
}
