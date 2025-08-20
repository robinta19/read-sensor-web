"use client";

import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
    TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
    TimeScale
);

type MetricKey = "suhu" | "ph" | "salinitas" | "kualitasAir" | "sensorLainnya";

type DataPerMetric = Record<MetricKey, number[]>;

const hours24 = Array.from({ length: 24 }, (_, h) =>
    `${h.toString().padStart(2, "0")}:00`
);

/** === Dummy data mengikuti pola pada gambar ===
 * Anda bisa ganti dengan data API 24 jam real.
 */
const DATA: DataPerMetric = {
    suhu: [22, 23, 24, 26, 23, 24, 25, 23, 21, 20, 22, 24, 25, 24, 26, 23, 24, 23, 22, 22, 23, 24, 23, 20],
    ph: [22, 23, 25, 26, 23, 24, 22, 20, 21, 23, 24, 25, 26, 24, 26, 23, 24, 23, 22, 22, 23, 24, 23, 20],
    salinitas: [22, 23, 25, 27, 23, 24, 22, 20, 21, 23, 25, 26, 25, 23, 26, 23, 22, 22, 22, 21, 22, 24, 23, 21],
    kualitasAir: [21, 22, 24, 27, 24, 23, 21, 19, 22, 24, 25, 26, 26, 23, 26, 22, 24, 23, 22, 22, 22, 24, 23, 18],
    sensorLainnya: [22, 22, 23, 26, 27, 24, 25, 24, 20, 21, 23, 25, 26, 24, 26, 24, 24, 24, 21, 22, 24, 25, 24, 19],
};

/** Nol kecil (garis merah tipis di dasar) untuk meniru gambar */
const tinyBaseline = new Array(24).fill(0.4); // tampak hampir menyentuh sumbu X

/** Opsi Chart.js diset agar mirip */
const baseOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: "bottom",
            labels: {
                usePointStyle: true,
                boxWidth: 8,
                boxHeight: 8,
                font: { family: "Poppins", size: 11 },
                // Teks legend sesuai gambar
                generateLabels(chart: any) {
                    // Hanya tampilkan label biru utama “Sensor Suhu (°C)”
                    return [
                        {
                            text: "Sensor Suhu (°C)",
                            fillStyle: chart.data.datasets[0]?.borderColor ?? "#3b82f6",
                            strokeStyle: chart.data.datasets[0]?.borderColor ?? "#3b82f6",
                            lineWidth: 2,
                            hidden: false,
                            datasetIndex: 0,
                            pointStyle: "line",
                        },
                    ];
                },
            },
        },
        tooltip: {
            intersect: false,
            mode: "index",
            callbacks: {
                label(ctx: any) {
                    const v = ctx.parsed.y;
                    return ` ${v.toFixed(1)}`;
                },
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: "rgba(0,0,0,0.08)",
                drawTicks: false,
            },
            ticks: {
                font: { family: "Poppins", size: 10 },
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
                callback: (val: any) => hours24[val] ?? "",
            },
        },
        y: {
            grid: {
                color: "rgba(0,0,0,0.08)",
            },
            ticks: {
                font: { family: "Poppins", size: 10 },
                // angka kecil seperti di gambar
                stepSize: 5,
            },
            suggestedMin: 0,
            suggestedMax: 30,
        },
    },
    elements: {
        point: {
            radius: 2,
            hoverRadius: 4,
        },
        line: {
            tension: 0.35,
            borderWidth: 2,
        },
    },
};

function makeDataset(values: number[]) {
    return [
        // Biru (utama)
        {
            label: "Sensor Suhu (°C)",
            data: values,
            borderColor: "#4F7DF3", // biru lembut
            backgroundColor: "rgba(79,125,243,0.15)",
            fill: false,
        },
        // Merah tipis (baseline)
        {
            label: "baseline",
            data: tinyBaseline,
            borderColor: "#f87171",
            backgroundColor: "rgba(248,113,113,0.12)",
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
        },
    ];
}

function MetricCard({
    title,
    values,
    spanFull = false,
}: {
    title: string;
    values: number[];
    spanFull?: boolean;
}) {
    const data = useMemo(
        () => ({
            labels: hours24,
            datasets: makeDataset(values),
        }),
        [values]
    );

    return (
        <div
            className={`rounded-xl border border-gray-200 bg-white p-3 md:p-4 ${spanFull ? "md:col-span-2" : ""
                }`}
        >
            <div className="text-sm font-semibold mb-2 text-gray-700">{title}</div>
            <div className="h-[240px] md:h-[220px]">
                <Line data={data} options={baseOptions} />
            </div>
        </div>
    );
}

export default function PanelPage() {
    return (
        <div className="flex flex-col pt-[100px] gap-4 px-5 pb-5">
            <div className="p-3 md:p-6 bg-white rounded-lg shadow-md">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="text-sm md:text-base font-semibold">Panel 1</div>
                    <div className="text-[11px] text-gray-500">
                        Latitude : “-5.389880009606335, 105.19889445526517”
                    </div>
                </div>

                {/* Grid 2 kolom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <MetricCard title="Suhu" values={DATA.suhu} />
                    <MetricCard title="pH" values={DATA.ph} />
                    <MetricCard title="Salinitas" values={DATA.salinitas} />
                    <MetricCard title="Kualitas Air" values={DATA.kualitasAir} />
                    <MetricCard title="Sensor Lainnya" values={DATA.sensorLainnya} spanFull />
                </div>
            </div>
            <div className="p-3 md:p-6 bg-white rounded-lg shadow-md">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="text-sm md:text-base font-semibold">Panel 2</div>
                    <div className="text-[11px] text-gray-500">
                        Latitude : “-5.389880009606335, 105.19889445526517”
                    </div>
                </div>

                {/* Grid 2 kolom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <MetricCard title="Suhu" values={DATA.suhu} />
                    <MetricCard title="pH" values={DATA.ph} />
                    <MetricCard title="Salinitas" values={DATA.salinitas} />
                    <MetricCard title="Kualitas Air" values={DATA.kualitasAir} />
                    <MetricCard title="Sensor Lainnya" values={DATA.sensorLainnya} spanFull />
                </div>
            </div>
        </div>
    );
}
