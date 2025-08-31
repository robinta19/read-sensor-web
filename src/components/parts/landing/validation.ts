import { z } from "zod";

export const sensorFormSchema = z.object({
  title: z.string().min(1, { message: "Judul wajib diisi" }),
  favicon: z.string().min(1, { message: "Icon wajib diisi" }),
});
export type SensorFormPayload = z.infer<typeof sensorFormSchema>;
