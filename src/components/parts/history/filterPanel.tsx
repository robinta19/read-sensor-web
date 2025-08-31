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
import { useGetSensorAll } from "../landing/api";

const FilterPanel = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const { data } = useGetSensorAll();

    const togglePanel = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());

        // hapus dulu biar gak dobel
        params.delete("nodes[]");

        selected.forEach((id) => {
            params.append("nodes[]", id);
        });

        router.push(`?${params.toString()}`);
        setOpen(false); // auto close modal
    };

    const handleReset = () => {
        setSelected([]);
        const params = new URLSearchParams(searchParams.toString());
        params.delete("nodes[]");
        router.push(`?${params.toString()}`);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Filter Panel</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Filter Panel</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    {data?.data?.map((node: any) => (
                        <label key={node.id} className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={selected.includes(node.id)}
                                onChange={() => togglePanel(node.id)}
                            />
                            Panel {node.node}
                        </label>
                    ))}
                </div>
                <div className="flex justify-end gap-2 mt-3">
                    <Button variant="outline" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button className="bg-blue-500 text-white" onClick={handleApply}>
                        Terapkan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FilterPanel;
