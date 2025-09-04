// components/MapView.tsx
"use client";

import L, { DivIcon } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import {
  useGetSensorLatLong,
  useGetSensorLatestId,
} from "../parts/landing/api";
import IconMin from "./iconMin";
import IconPlus from "./iconPlus";
import SearchIcon from "./searchIcon";
import { useRouter } from "next/navigation";

/** Default center (Lampung area) */
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

/** Komponen untuk fetch latest data by nodeId */
function LatestData({ nodeId }: { nodeId: string }) {
  const { data, isLoading } = useGetSensorLatestId(nodeId);

  if (isLoading)
    return <div className="text-sm text-gray-400 mt-2">Loading data...</div>;

  const latest = data?.data?.latest_data;
  if (!latest)
    return (
      <div className="text-sm text-red-500 mt-2">Tidak ada data terbaru</div>
    );

  return (
    <div className="grid grid-cols-2 gap-y-2 text-sm mt-3">
      <div className="text-gray-600">Suhu</div>
      <div className="font-medium">: {latest.temp} °C</div>

      <div className="text-gray-600">pH</div>
      <div className="font-medium">: {latest.ph}</div>

      <div className="text-gray-600">Salinitas</div>
      <div className="font-medium">: {latest.ec} mS/cm</div>

      <div className="text-gray-600">Kekeruhan</div>
      <div className="font-medium">: {latest.turb} NTU</div>

      <div className="text-gray-600">Oksigen Terlarut</div>
      <div className="font-medium">: {latest.do} mg/L</div>
    </div>
  );
}

/** Kontrol custom kanan-bawah */
function ZoomOverlay() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handler = () => setZoom(map.getZoom());
    map.on("zoomend", handler);
    map.on("zoom", handler);

    return () => {
      map.off("zoomend", handler);
      map.off("zoom", handler);
    };
  }, [map]);

  const min = map.getMinZoom();
  const max = map.getMaxZoom();
  const percent =
    max > min
      ? Math.round(((zoom - min) / (max - min)) * 100)
      : Math.round((zoom / 20) * 100);

  return (
    <div className="absolute bottom-10 right-10 z-[500] flex items-center gap-3 pointer-events-auto">
      <div
        className="flex justify-center cursor-pointer items-center h-[40px] w-[40px] bg-white rounded-xl shadow-md hover:bg-gray-50"
        onClick={() => map.zoomOut()}
        title="Zoom out"
      >
        <IconMin />
      </div>

      <div className="flex items-center gap-2 h-[40px] bg-white rounded-xl shadow-md px-3 py-2">
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
  const { data, isLoading } = useGetSensorLatLong();
  const router = useRouter();

  if (isLoading) {
    return <div className="p-10">Loading peta...</div>;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
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

        {/* Marker dari API lat-long */}
        {data?.data?.map((item) => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);

          return (
            <Marker key={item.id} position={[lat, lng]} icon={redPin}>
              <Popup>
                <div>
                  <div className="font-semibold text-lg">Panel {item.node}</div>
                  <div className="text-xs text-gray-500 leading-5">
                    Lat : {lat}, Long : {lng}
                  </div>

                  {/* Ambil latest data by ID */}
                  <LatestData nodeId={item.id} />

                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => router.push(`/record-data?node=${item.id}`)}
                      className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#2A6AF5] text-white px-4 py-2 text-sm font-medium hover:opacity-90"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <ZoomOverlay />
      </MapContainer>
    </div>
  );
}
