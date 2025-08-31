"use client";

import { SensorFormPayload, sensorFormSchema } from "@/components/parts/landing/validation";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSensor } from "@/components/parts/landing/api";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CustomFormInput } from "@/components/form/customFormInput";
import dynamic from "next/dynamic";
const MapWithMarker = dynamic(
    () => import("@/components/map/mapWithMarker"),
    {
        ssr: false,
    }
);

const CreateNodePage = () => {
    const router = useRouter();
    const createSensorMutation = useSensor("POST");

    const form = useForm<SensorFormPayload>({
        resolver: zodResolver(sensorFormSchema),
        defaultValues: {
            nodeID: "",
            long: "",
            lat: "",
            ec: "",
            temp: "",
            ph: "",
            turb: "",
            do: "",
        },
    });

    const onSubmit = (data: SensorFormPayload) => {
        console.log(data);
        createSensorMutation.mutate(data, {
            onSuccess: () => {
                router.push("/");
            },
        });
    };

    return (
        <div className="pt-[100px] gap-6 px-5 pb-5">
            <div className="flex flex-col gap-4 p-5 rounded-lg shadow-md">
                <div className="font-semibold text-lg">Tambah Data Panel</div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="h-[400px]">
                            <MapWithMarker
                                lat={form.watch("lat")}
                                long={form.watch("long")}
                                onChange={(lat, long) => {
                                    form.setValue("lat", lat);
                                    form.setValue("long", long);
                                }}
                            />
                        </div>
                        <CustomFormInput<SensorFormPayload>
                            name="long"
                            label="Longitude"
                            placeholder="Masukkan longitude"
                        />
                        <CustomFormInput<SensorFormPayload>
                            name="lat"
                            label="Latitude"
                            placeholder="Masukkan latitude"
                        />
                        <CustomFormInput<SensorFormPayload>
                            name="nodeID"
                            label="Node ID"
                            placeholder="Masukkan ID Node"
                        />
                        <CustomFormInput<SensorFormPayload>
                            name="ec"
                            label="EC"
                            placeholder="Masukkan nilai EC"
                            type="number"
                        />
                        <CustomFormInput<SensorFormPayload>
                            name="temp"
                            label="Temperature"
                            placeholder="Masukkan suhu"
                            type="number"
                        />
                        <CustomFormInput<SensorFormPayload>
                            name="ph"
                            label="pH"
                            placeholder="Masukkan nilai pH"
                            type="number"
                        />
                        <CustomFormInput<SensorFormPayload>
                            name="turb"
                            label="Turbidity"
                            placeholder="Masukkan nilai turbidity"
                            type="number"
                        />
                        <CustomFormInput<SensorFormPayload>
                            name="do"
                            label="Dissolved Oxygen (DO)"
                            placeholder="Masukkan nilai DO"
                            type="number"
                        />

                        <div className="flex justify-center mt-6 gap-3">
                            <Button type="submit" className="rounded-full w-[200px] bg-blue-500 hover:bg-blue-600">
                                Tambah Panel
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreateNodePage;
