import { AllowedValue } from "./types";

// types.ts

export interface debounceInterface {
  value: string;
  delay: number;
}

// Generic API response structure
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  pagination?: Pagination; // Optional pagination info
}

// Pagination format matching the JSON format
export interface Pagination {
  page: number;
  perPage: number;
  totalPages: number;
  totalCount: number;
  links: Links;
}

// Navigation links for paginated responses
export interface Links {
  prev: string | null;
  next: string | null;
}

// Login response data
export interface LoginData {
  email: string | null;
  name: string;
  role: string;
  token: string;
  type: string;
  user_data: string | null;
}
