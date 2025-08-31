"use client";

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
  GeoJSON,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

interface MapWithMarkerProps {
  lat: string;
  long: string;
  onChange: (lat: string, long: string) => void;
}

// Custom icon
const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

// ---- Geocoder control
function GeocoderControl({
  onChange,
}: {
  onChange: (lat: string, long: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const geocoder = (L.Control as any)
      .geocoder({ defaultMarkGeocode: false })
      .on("markgeocode", function (e: any) {
        const latlng = e.geocode.center;
        map.setView(latlng, map.getZoom());
        onChange(latlng.lat.toString(), latlng.lng.toString());
      })
      .addTo(map);

    return () => {
      map.removeControl(geocoder);
    };
  }, [map, onChange]);

  return null;
}

// ---- Update view when position changes
function UpdateMapView({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [map, position]);
  return null;
}

// ---- Boundary layer: load & fit bounds for Lampung Timur
function LampungTimurBoundary({
  geoData,
  enableFitBounds,
}: {
  geoData: any;
  enableFitBounds: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!geoData) return;
    try {
      const layer = L.geoJSON(geoData);
      const bounds = layer.getBounds();
      if (enableFitBounds && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    } catch {}
  }, [geoData, map, enableFitBounds]);

  if (!geoData) return null;

  return (
    <GeoJSON
      data={geoData}
      style={() => ({
        color: "#0000ff", // garis biru
        weight: 2,
        fillColor: "#0000ff", // isi biru
        fillOpacity: 0.2, // transparan
      })}
    />
  );
}

export default function MapWithMarker({
  lat,
  long,
  onChange,
}: MapWithMarkerProps) {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    const latNum = parseFloat(lat);
    const longNum = parseFloat(long);
    if (!isNaN(latNum) && !isNaN(longNum)) {
      setMarkerPosition([latNum, longNum]);
    }
  }, [lat, long]);

  // load GeoJSON batas kabupaten (taruh file di /public/data/LampungTimur.geojson)
  useEffect(() => {
    fetch("/data/LampungTimur.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch(() => setGeoData(null));
  }, []);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const latlng: [number, number] = [e.latlng.lat, e.latlng.lng];
        setMarkerPosition(latlng);
        onChange(latlng[0].toString(), latlng[1].toString());
      },
    });

    if (!markerPosition) return null;

    return (
      <Marker
        position={markerPosition}
        icon={customIcon}
        draggable
        eventHandlers={{
          dragend(e) {
            const pos = e.target.getLatLng();
            onChange(pos.lat.toString(), pos.lng.toString());
            setMarkerPosition([pos.lat, pos.lng]);
          },
        }}
      />
    );
  }

  return (
    <MapContainer
      center={markerPosition ?? [-5.1354, 105.3069]}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "8px", zIndex: 0 }}
      //
      // scrollWheelZoom={false}
      // doubleClickZoom={false}
      // touchZoom={false}
      // dragging={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* ---- Batas Lampung Timur (diletakkan lebih dulu supaya marker berada di atas) */}
      <LampungTimurBoundary
        geoData={geoData}
        enableFitBounds={!markerPosition}
      />

      <GeocoderControl onChange={onChange} />
      <LocationMarker />
      {markerPosition && <UpdateMapView position={markerPosition} />}
    </MapContainer>
  );
}
