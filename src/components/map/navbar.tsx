"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
    const pathname = usePathname();

    const menus = [
        { href: "/", label: "Dashboard" },
        { href: "/history", label: "History" },
        { href: "/record-data", label: "Record Data" },
    ];

    return (
        <div className="fixed flex justify-between items-center left-4 right-4 top-4 z-50 bg-white p-3 px-4 rounded-xl shadow-md">
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100" />
                    <div className="font-semibold text-lg">Title</div>
                </div>
            </div>
            {/* menu */}
            <div className="flex gap-6">
                {menus.map((menu) => {
                    const isActive = pathname === menu.href;
                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`pb-1 ${isActive
                                    ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
                                    : "hover:text-blue-500 hover:border-b-2 border-blue-500"
                                }`}
                        >
                            {menu.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Navbar;
