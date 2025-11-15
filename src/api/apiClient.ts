// api/apiClient.ts
import axios from "axios";
import jwtAxios from "@/util/jwtUtil";
import { getCookie } from "@/util/cookieUtil";

const host = import.meta.env.VITE_API_SERVER_HOST;

// 쿠키 → 객체 파서 (문자/객체 모두 대응)
const readMember = () => {
  const raw = getCookie("member");
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return raw as any;
  }
};

const hasToken = () => !!readMember()?.accessToken;

const getHttpClient = () => (hasToken() ? jwtAxios : axios);

export const apiGet = async <T>(
  url: string,
  params?: Record<string, any>
): Promise<T> => {
  const http = getHttpClient();
  const res = await http.get(`${host}${url}`, { params });
  return res.data as T;
};

export const apiPost = async <T>(url: string, data?: any): Promise<T> => {
  const http = getHttpClient();
  const res = await http.post(`${host}${url}`, data);
  return res.data as T;
};
