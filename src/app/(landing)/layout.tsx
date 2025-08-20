"use client";

import Navbar from "@/components/map/navbar";

export default function MapLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="relative">
            <Navbar />
            {children}
        </div>
    );
}
