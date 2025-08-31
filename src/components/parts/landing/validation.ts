import { z } from "zod";

export const sensorFormSchema = z.object({
  nodeID: z.string().min(1, "Node ID wajib diisi"),
  long: z.string().min(1, "Longitude wajib diisi"),
  lat: z.string().min(1, "Latitude wajib diisi"),
  
  ec: z.union([z.number(), z.string()]).transform((val) => {
    const numberValue = Number(val);
    return isNaN(numberValue) ? val : numberValue;
  }),
  temp: z.union([z.number(), z.string()]).transform((val) => {
    const numberValue = Number(val);
    return isNaN(numberValue) ? val : numberValue;
  }),
  ph: z.union([z.number(), z.string()]).transform((val) => {
    const numberValue = Number(val);
    return isNaN(numberValue) ? val : numberValue;
  }),
  turb: z.union([z.number(), z.string()]).transform((val) => {
    const numberValue = Number(val);
    return isNaN(numberValue) ? val : numberValue;
  }),
  do: z.union([z.number(), z.string()]).transform((val) => {
    const numberValue = Number(val);
    return isNaN(numberValue) ? val : numberValue;
  }),
});

export type SensorFormPayload = z.infer<typeof sensorFormSchema>;
