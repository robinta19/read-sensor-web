"use client";

import dynamic from 'next/dynamic';
const MapView = dynamic(() => import("@/components/map/mapView"), { ssr: false });


const page = () => {
  return (
    <div>
        <MapView />
    </div>
  )
}

export default page