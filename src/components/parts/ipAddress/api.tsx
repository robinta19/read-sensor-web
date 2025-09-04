import { ApiResponse, DataObject } from "@/types";
import { IpAddressFormPayload } from "./validation";
import { fetcher, sendData } from "@/services/api/fetcher";
import { useFormMutation } from "@/hooks/useFormMutation";
import { useQuery } from "@tanstack/react-query";
import { IpAddressResponse } from "./interface";


// get all noce
const getIpAddressAll = async (
  query?: string
): Promise<ApiResponse<IpAddressResponse[]>> => {
  return await fetcher(
    query ? `nodes/get-all?${query}` : `nodes/get-all`
  );
};

export const useGetIpAddressAll = (query?: string) => {
  return useQuery<ApiResponse<IpAddressResponse[]>, Error>({
    queryKey: ["useGetIpAddressAll", query],
    queryFn: () => getIpAddressAll(query),
    placeholderData: (prev) => prev, // pengganti keepPreviousData
    refetchIntervalInBackground: true,
  });
};

// get by id
export const getIpAddressId = async (
  id: number
): Promise<ApiResponse<DataObject<IpAddressResponse>>> => {
  return await fetcher(`category-potential/${id}/get`);
};

export const useGetIpAddressId = (id: number) => {
  return useQuery<ApiResponse<DataObject<IpAddressResponse>>, Error>({
    queryKey: ["useGetIpAddressId", id],
    queryFn: () => getIpAddressId(id),
  });
};


// post
export const useIpAddress = (
  method: "POST" | "PUT" = "POST",
  id?: number
) => {
  return useFormMutation<
    ApiResponse<DataObject<IpAddressFormPayload>>,
    Error,
    IpAddressFormPayload
  >({
    mutationFn: async (
      data
    ): Promise<ApiResponse<DataObject<IpAddressFormPayload>>> => {
      const endpoint = id
        ? `nodes/send-data/${id}`
        : "nodes/send-data";
      const delay = new Promise((resolve) => setTimeout(resolve, 2000));
      const response: ApiResponse<DataObject<IpAddressFormPayload>> =
        await sendData(endpoint, data, method);
      await delay;
      return response;
    },
    loadingMessage:
      method === "POST" ? "Menyimpan data..." : "Memperbarui data...",
    successMessage:
      method === "POST"
        ? "Data berhasil ditambahkan"
        : "Data berhasil diperbarui",
  });
};

