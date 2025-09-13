"use client";

import { BASE_URL } from "@/constants";
import Cookies from "js-cookie";

export const fetcher = async (url: string) => {
  const token = Cookies.get("accessToken");
  // Atau ambil dari state/context
  try {
    const res = await fetch(`${BASE_URL}/api/${url}`, {
      headers: {
        method: "GET",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch");
    }
    return await res.json();
  } catch (e) {
    console.log(e);
  }
};

export const fetcherWithoutAuth = async (url: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const hasFile = (data: object): boolean => {
  return Object.values(data).some((value) => {
    if (Array.isArray(value)) {
      return value.some((item) => item instanceof File);
    }
    return value instanceof File;
  });
};

export const sendData = async <T, D extends object>(
  url: string,
  data: D,
  method: "POST" | "PUT" | "DELETE" | "PATCH",
  isFormData?: boolean
): Promise<T> => {
  const token = Cookies.get("accessToken");
  const shouldUseFormData = isFormData || hasFile(data);

  const headers: HeadersInit = shouldUseFormData
    ? { Authorization: `Bearer ${token}` }
    : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

  const options: RequestInit = {
    method,
    headers,
  };

  if (method !== "DELETE") {
    options.body = shouldUseFormData
      ? convertToFormData(data)
      : JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}/api/${url}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json() as Promise<T>;
};

// Fungsi untuk mengonversi objek ke FormData
const convertToFormData = <D extends object>(data: D): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item as string | Blob));
    } else {
      formData.append(key, value as string | Blob);
    }
  });

  return formData;
};
