"use client";

import React, { useMemo, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetSensor } from "@/components/parts/landing/api";
import Image from "next/image";
import { start } from "repl";
import FilterWaktu from "@/components/parts/history/filterWaktu";
import { useSearchParams } from "next/navigation";
import FilterPanel from "@/components/parts/history/filterPanel";

// Registrasi ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

// ==================================
// Utility
// ==================================
const tinyBaseline = new Array(24).fill(0.4);

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
            },
        },
    },
    scales: {
        x: {
            grid: { color: "rgba(0,0,0,0.08)" },
            ticks: {
                font: { size: 10 },
            },
        },
        y: {
            grid: { color: "rgba(0,0,0,0.08)" },
            ticks: { stepSize: 5, font: { size: 10 } },
            suggestedMin: 0,
            suggestedMax: 30,
        },
    },
    elements: {
        point: { radius: 2, hoverRadius: 4 },
        line: { tension: 0.35, borderWidth: 2 },
    },
};

function makeDataset(values: number[], label: string) {
    return [
        {
            label,
            data: values,
            borderColor: "#4F7DF3",
            backgroundColor: "rgba(79,125,243,0.15)",
            fill: false,
        },
        {
            label: "baseline",
            data: tinyBaseline,
            borderColor: "#f87171",
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
        },
    ];
}

// ==================================
// Chart Metric Card
// ==================================
function MetricCard({ title, values, timestamps }: { title: string; values: number[]; timestamps: string[] }) {
    const data = useMemo(
        () => ({
            labels: timestamps, // 🔑 langsung pakai timestamp dari API
            datasets: makeDataset(values, title),
        }),
        [values, timestamps, title]
    );

    return (
        <div className="rounded-xl border p-3 bg-white shadow-sm">
            <div className="text-sm font-semibold mb-2">{title}</div>
            <div className="h-[220px]">
                <Line data={data} options={baseOptions} />
            </div>
        </div>
    );
}


// ==================================
// Kalibrasi Modal
// ==================================
function KalibrasiModal({ panelName }: { panelName: string }) {
    const [selected, setSelected] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [open, setOpen] = useState(false);

    const sensors = [
        "Sensor Suhu",
        "Sensor pH",
        "Sensor Salinitas",
        "Sensor Kekeruhan",
        "Sensor Oksigen Terlarut",
    ];

    const handleKalibrasi = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setDone(true);
        }, 2000);
    };

    const reset = () => {
        setSelected("");
        setLoading(false);
        setDone(false);
    };

    const handleClose = () => {
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">Kalibrasi Sensor</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                {!done ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Kalibrasi {panelName}</DialogTitle>
                        </DialogHeader>
                        {!loading ? (
                            <div className="space-y-4">
                                <p className="text-sm">Pilih Sensor yang ingin dikalibrasi ulang:</p>
                                <div className="space-y-2">
                                    {sensors.map((s) => (
                                        <label key={s} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="sensor"
                                                value={s}
                                                checked={selected === s}
                                                onChange={(e) => setSelected(e.target.value)}
                                            />
                                            {s}
                                        </label>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={handleClose}>
                                        Batal
                                    </Button>
                                    <Button
                                        disabled={!selected}
                                        onClick={handleKalibrasi}
                                        className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                    >
                                        Kalibrasi
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <p className="text-sm">
                                    Sedang Kalibrasi <b>{selected}</b>
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <motion.div
                        className="flex flex-col items-center justify-center py-6 gap-3"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        <Check className="w-10 h-10 text-green-500" />
                        <p className="font-semibold text-sm">Kalibrasi Berhasil</p>
                        <Button onClick={handleClose} className="bg-blue-500 text-white">
                            Ok
                        </Button>
                    </motion.div>
                )}
            </DialogContent>
        </Dialog>
    );
}

// ==================================
// Panel
// ==================================
function Panel({ panelName, metrics }: { panelName: string; metrics: any }) {
    return (
        <div className="p-3 md:p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="font-semibold">{panelName}</div>
                </div>
                <KalibrasiModal panelName={panelName} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard title="Suhu (°C)" values={metrics.temp || []} timestamps={metrics.timestamps || []} />
                <MetricCard title="pH" values={metrics.ph || []} timestamps={metrics.timestamps || []} />
                <MetricCard title="EC" values={metrics.ec || []} timestamps={metrics.timestamps || []} />
                <MetricCard title="Kekeruhan" values={metrics.turb || []} timestamps={metrics.timestamps || []} />
                <MetricCard title="Oksigen Terlarut" values={metrics.do || []} timestamps={metrics.timestamps || []} />
            </div>
        </div>
    );
}


// MAIN PAGE
// ==================================
export default function PanelPage() {
    const searchParams = useSearchParams();

    // langsung jadi string query: start=00:00&end=08:09
    const queryString = searchParams.toString();

    const { data, isLoading } = useGetSensor(queryString);

    if (isLoading) {
        return <div className="p-10">Loading data...</div>;
    }

    return (
        <div className="flex flex-col pt-[100px] gap-6 px-5 pb-5">
            <div className="flex gap-3">
                <FilterWaktu />
                <FilterPanel />
            </div>
            {data?.data && data.data.length > 0 ? (
                data.data.map((node) => (
                    <Panel
                        key={node.node_id}
                        panelName={`Panel ${node.node}`}
                        metrics={node.metrics}
                    />
                ))
            ) : (
                <div className="bg-white p-5 rounded-md shadow-md flex flex-col items-center justify-center">
                    <div className="h-[140px]">
                        <Image
                            alt="no-data"
                            src="/images/no-data.jpg"
                            width={140}
                            height={140}
                        />
                    </div>
                    Tidak ada data
                </div>
            )}

        </div>
    );
}
