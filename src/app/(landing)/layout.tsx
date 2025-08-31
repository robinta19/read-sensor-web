"use client";

import Navbar from "@/components/map/navbar";
import { Suspense } from "react";

export default function MapLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="relative">
            <Navbar />
            <Suspense>
                {children}
            </Suspense>
        </div>
    );
}
