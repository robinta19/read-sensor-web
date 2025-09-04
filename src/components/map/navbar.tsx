"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const menus = [
        { href: "/", label: "Dashboard" },
        { href: "/history", label: "History" },
        { href: "/record-data", label: "Record Data" },
    ];

    return (
        <>
            {/* Navbar */}
            <div className="fixed flex justify-between items-center left-4 right-4 top-4 z-50 bg-white p-3 px-4 rounded-xl shadow-md">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100" />
                        <div className="font-semibold text-lg">Title</div>
                    </div>
                </div>

                {/* menu desktop */}
                <div className="hidden md:flex gap-6">
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

                {/* burger icon mobile */}
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* sidebar mobile */}
            <div
                className={`fixed top-0 z-[9999] left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-4 flex justify-between items-center border-b">
                    <span className="font-semibold text-lg">Menu</span>
                    {/* <button onClick={() => setIsOpen(false)}>
                        <X size={24} />
                    </button> */}
                </div>
                <div className="flex flex-col p-4 space-y-4">
                    {menus.map((menu) => {
                        const isActive = pathname === menu.href;
                        return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                onClick={() => setIsOpen(false)}
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

            {/* overlay hitam di belakang menu */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Navbar;
