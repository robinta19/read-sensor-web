import { z } from "zod";

export const ipAddressFormSchema = z.object({
  name: z.string().min(1, "IP Address wajib diisi"),
});

export type IpAddressFormPayload = z.infer<typeof ipAddressFormSchema>;
