// app/record-data/page.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

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
    // Kapital awal bulan
    return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

/* ---------- Types & dummy data ---------- */
type Row = {
    waktu: string;
    suhu: number;
    ph: number;
    salinitas: number;
    kualitasAir: number;
    sensorLain: number;
};
function makeRows(): Row[] {
    const base: Omit<Row, "waktu"> = {
        suhu: 32.11,
        ph: 6.71,
        salinitas: 1.91,
        kualitasAir: 90.04,
        sensorLain: 332.15,
    };
    return Array.from({ length: 24 }, (_, h) => ({
        waktu: `${String(h).padStart(2, "0")}:00`,
        ...base,
    }));
}

/* ---------- Page ---------- */
export default function RecordDataPage() {
    // DEFAULT: hari berjalan
    const [date, setDate] = useState<Date>(new Date());
    const rows = useMemo(makeRows, []);
    const inputRef = useRef<HTMLInputElement | null>(null);

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
        // Buka programmatically jika ada
        if (typeof inputRef.current.showPicker === "function") {
            inputRef.current.showPicker();
        } else {
            // fallback: fokuskan input (akan munculkan UI bawaan)
            inputRef.current.focus();
            inputRef.current.click();
        }
    };

    return (
        <div className="pt-[100px] px-5 pb-5">
            <div className="w-full">
                <div className="mx-auto max-w-6xl">
                    {/* Kontrol tanggal */}
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <button
                            onClick={() => shiftDay(-1)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
                            aria-label="Sebelumnya"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {/* Chip tanggal yang bisa diklik */}
                        <button
                            type="button"
                            onClick={openPicker}
                            className="relative inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm"
                            aria-label="Pilih tanggal"
                        >
                            <Calendar className="h-4 w-4" />
                            <span>{formatDateID(date)}</span>

                            {/* Input date transparan sebagai anchor/picker */}
                            <input
                                ref={inputRef}
                                type="date"
                                value={toYmd(date)}
                                onChange={onPick}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            // optional: batasi rentang jika mau
                            // min="2020-01-01"
                            // max="2030-12-31"
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
                                        <th className="px-4 py-3 font-semibold">Suhu</th>
                                        <th className="px-4 py-3 font-semibold">pH</th>
                                        <th className="px-4 py-3 font-semibold">Salinitas</th>
                                        <th className="px-4 py-3 font-semibold">Kualitas Air</th>
                                        <th className="px-4 py-3 font-semibold">Sensor Lain</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((r, i) => (
                                        <tr
                                            key={r.waktu}
                                            className={i % 2 === 1 ? "bg-[#F6F9FF]" : "bg-white"}
                                        >
                                            <td className="px-4 py-3 text-gray-700">{r.waktu}</td>
                                            <td className="px-4 py-3 text-gray-700">{r.suhu.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-gray-700">{r.ph.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-gray-700">{r.salinitas.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-gray-700">{r.kualitasAir.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-gray-700">{r.sensorLain.toFixed(2)}</td>
                                        </tr>
                                    ))}
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
