// app/record-data/page.tsx
"use client";

import { useRef, useState, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetSensorRecordId } from "@/components/parts/landing/api";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/* ---------- Utils ---------- */
function toYmd(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
function formatDateID(d: Date) {
    const day = d.toLocaleDateString("id-ID", { day: "2-digit" });
    const month = d.toLocaleDateString("id-ID", { month: "long" });
    const year = d.getFullYear();
    return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

/* ---------- Types ---------- */
type RecordRow = {
    id: string;
    time: string;
    ec: number;
    temp: number;
    ph: number;
    turb: number;
    do: number;
};

/* ---------- Page ---------- */
export default function RecordDataPage() {
    const [date, setDate] = useState<Date>(new Date());
    const inputRef = useRef<HTMLInputElement | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const node = searchParams.get("node") || "";

    const shiftDay = (delta: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + delta);
        setDate(d);
    };

    const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return;
        const [y, m, dd] = e.target.value.split("-").map(Number);
        setDate(new Date(y, (m ?? 1) - 1, dd ?? 1));
    };

    const openPicker = () => {
        if (!inputRef.current) return;
        if (typeof inputRef.current.showPicker === "function") {
            inputRef.current.showPicker();
        } else {
            inputRef.current.focus();
            inputRef.current.click();
        }
    };

    // jika node tidak ada → tampilkan halaman pesan
    if (!node) {
        return (
            <div className="pt-[100px] gap-6 px-5 pb-5">
                <div className="rounded-lg p-5 py-10 flex flex-col items-center justify-center text-center bg-white shadow-md ">
                    <p className="text-gray-600 text-lg mb-4">
                        Silahkan Pilih Panel Di Dashboard Dan Pilih Detail
                    </p>
                    <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                        onClick={() => router.push("/")}>
                        Kembali ke Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    // integrasi API dengan tanggal dinamis
    const query = `${node}?date=${toYmd(date)}`;
    const { data, isLoading } = useGetSensorRecordId(query);

    const rows: RecordRow[] = useMemo(() => {
        return data?.data ?? [];
    }, [data]);

    return (
        <div className="pt-[120px] px-5 pb-5">
            <div className="w-full">
                <div className="">
                    {/* Kontrol tanggal */}
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <button
                            onClick={() => shiftDay(-1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
                            aria-label="Sebelumnya"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            onClick={openPicker}
                            className="relative inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm"
                            aria-label="Pilih tanggal"
                        >
                            <Calendar className="h-4 w-4" />
                            <span>{formatDateID(date)}</span>
                            <input
                                ref={inputRef}
                                type="date"
                                value={toYmd(date)}
                                onChange={onPick}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            />
                        </button>

                        <button
                            onClick={() => shiftDay(1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
                            aria-label="Berikutnya"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Kartu tabel */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow">
                        <div className="overflow-x-auto">
                            <table className="min-w-[720px] w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-[#E7F0FF] text-gray-700">
                                        <th className="px-4 py-3 font-semibold">Waktu</th>
                                        <th className="px-4 py-3 font-semibold">Suhu (°C)</th>
                                        <th className="px-4 py-3 font-semibold">pH</th>
                                        <th className="px-4 py-3 font-semibold">Salinitas (mS/cm)</th>
                                        <th className="px-4 py-3 font-semibold">Kekeruhan (NTU)</th>
                                        <th className="px-4 py-3 font-semibold">Oksigen Terlarut (mg/L)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                                Data tidak tersedia
                                            </td>
                                        </tr>
                                    ) : (
                                        rows.map((r, i) => (
                                            <tr
                                                key={r.id}
                                                className={i % 2 === 1 ? "bg-[#F6F9FF]" : "bg-white"}
                                            >
                                                <td className="px-4 py-3 text-gray-700">{r.time}</td>
                                                <td className="px-4 py-3 text-gray-700">{r.temp}</td>
                                                <td className="px-4 py-3 text-gray-700">{r.ph}</td>
                                                <td className="px-4 py-3 text-gray-700">{r.ec}</td>
                                                <td className="px-4 py-3 text-gray-700">{r.turb}</td>
                                                <td className="px-4 py-3 text-gray-700">{r.do}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="h-4 rounded-b-xl bg-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
