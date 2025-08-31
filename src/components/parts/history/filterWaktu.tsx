"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const FilterWaktu = () => {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (start) {
            params.set("start", start);
        } else {
            params.delete("start");
        }

        if (end) {
            params.set("end", end);
        } else {
            params.delete("end");
        }

        router.push(`?${params.toString()}`);

        // auto close modal
        setOpen(false);
    };

    const handleReset = () => {
        setStart("");
        setEnd("");

        const params = new URLSearchParams(searchParams.toString());
        params.delete("start");
        params.delete("end");

        router.push(`?${params.toString()}`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Filter Waktu</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Filter Waktu</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3 text-sm">
                    <div>
                        <label className="block text-xs text-gray-500">Dari Jam</label>
                        <input
                            type="time"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="border p-1 rounded-md w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500">Ke Jam</label>
                        <input
                            type="time"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="border p-1 rounded-md w-full"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                        <Button variant="outline" onClick={handleReset}>
                            Reset
                        </Button>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleApply}>
                            Terapkan
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FilterWaktu;
