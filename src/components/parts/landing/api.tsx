import { ApiResponse, DataObject } from "@/types";
import { SensorFormPayload } from "./validation";
import { fetcher, sendData } from "@/services/api/fetcher";
import { useFormMutation } from "@/hooks/useFormMutation";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { LatestDataResponse, RecordDataResponse, SensorResponse } from "./interface";

// LANDING

// get node lat loNg
const getSensorLatLong = async (
  query?: string
): Promise<ApiResponse<LatestDataResponse[]>> => {
  return await fetcher(
    query ? `nodes/get-long-lat?${query}` : `nodes/get-long-lat`
  );
};

export const useGetSensorLatLong = (query?: string) => {
  return useQuery<ApiResponse<LatestDataResponse[]>, Error>({
    queryKey: ["useGetSensorLatLong", query],
    queryFn: () => getSensorLatLong(query),
    placeholderData: (prev) => prev, // pengganti keepPreviousData
    refetchInterval: 60000, // 🔄 refetch tiap 1 menit
    refetchIntervalInBackground: true,
  });
};


export const getSensorLatestId = async (
  id: string
): Promise<ApiResponse<DataObject<LatestDataResponse>>> => {
  return await fetcher(`nodes/get/${id}`);
};

export const useGetSensorLatestId = (id: string) => {
  return useQuery<ApiResponse<DataObject<LatestDataResponse>>, Error>({
    queryKey: ["useGetSensorLatestId", id],
    queryFn: () => getSensorLatestId(id),
    placeholderData: (prev) => prev, // pengganti keepPreviousData
    refetchInterval: 60000, // 🔄 refetch tiap 1 menit
    refetchIntervalInBackground: true,
  });
};

// LANDING

// get all noce
const getSensorAll = async (
  query?: string
): Promise<ApiResponse<LatestDataResponse[]>> => {
  return await fetcher(
    query ? `nodes/get-all?${query}` : `nodes/get-all`
  );
};

export const useGetSensorAll = (query?: string) => {
  return useQuery<ApiResponse<LatestDataResponse[]>, Error>({
    queryKey: ["useGetSensorAll", query],
    queryFn: () => getSensorAll(query),
    placeholderData: (prev) => prev, // pengganti keepPreviousData
    refetchIntervalInBackground: true,
  });
};

// get graph
const getSensor = async (
  query?: string
): Promise<ApiResponse<SensorResponse[]>> => {
  return await fetcher(
    query ? `datas/graph?${query}` : `datas/graph`
  );
};

export const useGetSensor = (query?: string) => {
  return useQuery<ApiResponse<SensorResponse[]>, Error>({
    queryKey: ["useGetSensor", query],
    queryFn: () => getSensor(query),
    placeholderData: (prev) => prev, // pengganti keepPreviousData
    refetchIntervalInBackground: true,
  });
};

// get by id
export const getSensorId = async (
  id: number
): Promise<ApiResponse<DataObject<SensorResponse>>> => {
  return await fetcher(`category-potential/${id}/get`);
};

export const useGetSensorId = (id: number) => {
  return useQuery<ApiResponse<DataObject<SensorResponse>>, Error>({
    queryKey: ["useGetSensorId", id],
    queryFn: () => getSensorId(id),
  });
};

// record data
export const getSensorRecordId = async (
  id: string
): Promise<ApiResponse<RecordDataResponse[]>> => {
  return await fetcher(`datas/per-day/${id}`);
};

export const useGetSensorRecordId = (id: string) => {
  return useQuery<ApiResponse<RecordDataResponse[]>, Error>({
    queryKey: ["useGetSensorRecordId", id],
    queryFn: () => getSensorRecordId(id),
  });
};

// post
export const useSensor = (
  method: "POST" | "PUT" = "POST",
  id?: number
) => {
  return useFormMutation<
    ApiResponse<DataObject<SensorFormPayload>>,
    Error,
    SensorFormPayload
  >({
    mutationFn: async (
      data
    ): Promise<ApiResponse<DataObject<SensorFormPayload>>> => {
      const endpoint = id
        ? `nodes/send-data/${id}`
        : "nodes/send-data";
      const delay = new Promise((resolve) => setTimeout(resolve, 2000));
      const response: ApiResponse<DataObject<SensorFormPayload>> =
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

// hsitory by id
// service/commandService.ts
export const getCommandId = async (
  id: string
): Promise<ApiResponse<any>> => {
  return await fetcher(`commands/get-one/${id}`);
};

// ✅ Hook bisa terima opsi supaya fleksibel (misalnya polling interval)

export const useGetCommandId = (
  id: string,
  options?: Partial<UseQueryOptions<ApiResponse<any>, Error>>
) => {
  return useQuery<ApiResponse<any>, Error>({
    queryKey: ["useGetCommandId", id],
    queryFn: () => getCommandId(id),
    enabled: !!id, // default hanya jalan kalau ada id
    ...options,    // bisa override enabled, refetchInterval, dsb
  });
};
