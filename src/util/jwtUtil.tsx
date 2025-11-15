// util/jwtUtil.ts
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getCookie, setCookie } from "@/util/cookieUtil";

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

/**
 * ⏱ 토큰 리프레시 API
 * - 반드시 "기본 axios" 사용 (인터셉터 비탑재)
 * - 서버가 @RequestParam("refreshToken") 이므로 3번째 인자에 params 로 전송
 * - 서버가 Authorization 헤더 요구 → 만료된 accessToken이어도 Bearer로 첨부
 */
const refreshJwt = async (
  accessToken: string | undefined,
  refreshToken: string
) => {
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await axios.post(
    `${host}/api/tokens/refresh`, // ← 서버 엔드포인트 유지
    null, // ← Body 없음
    {
      params: { refreshToken }, // ← @RequestParam 매핑
      headers, // ← Bearer 직접 첨부
    }
  );
  // 서버 응답: { accessToken: string, refreshToken: string }
  return res.data as { accessToken: string; refreshToken: string };
};

const jwtAxios = axios.create();

/* =========================
 * 요청 인터셉터
 * ========================= */
const beforeReq = (config: InternalAxiosRequestConfig) => {
  const member = readMember();
  if (member?.accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${member.accessToken}`;
  }
  return config;
};
const requestFail = (err: AxiosError) => Promise.reject(err);
jwtAxios.interceptors.request.use(beforeReq, requestFail);

/* =========================
 * 응답 인터셉터 (401 → 리프레시)
 * - 동시요청 큐 처리
 * - 리프레시 엔드포인트는 재시도 금지
 * ========================= */
let isRefreshing = false;
let waiters: Array<(token: string) => void> = [];
const notifyAll = (token: string) => {
  waiters.forEach((w) => w(token));
  waiters = [];
};

jwtAxios.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // 조건 미충족 시 그대로 실패
    if (!original || original._retry || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // 리프레시 엔드포인트 자체에서의 401은 재시도 금지 (루프 방지)
    if (
      original.url?.includes("/api/members/refresh") ||
      original.url?.includes("/api/tokens/refresh")
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    const member = readMember();
    const refreshToken: string | undefined = member?.refreshToken;
    const accessToken: string | undefined = member?.accessToken;
    if (!refreshToken) return Promise.reject(error);

    try {
      // 이미 다른 요청이 리프레시 중이면 대기
      if (isRefreshing) {
        const token = await new Promise<string>((resolve) =>
          waiters.push(resolve)
        );
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return axios(original); // 기본 axios로 재시도 (headers는 우리가 세팅함)
      }

      isRefreshing = true;

      // ✅ 여기서 "refreshJwt" 사용 (이름 주의!)
      const refreshed = await refreshJwt(accessToken, refreshToken);

      // 쿠키 갱신 (예: 1일)
      const next = { ...(member ?? {}), ...refreshed };
      setCookie("member", JSON.stringify(next), 1);

      isRefreshing = false;
      notifyAll(refreshed.accessToken);

      // 원요청 재시도
      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${refreshed.accessToken}`;
      return axios(original);
    } catch (e) {
      isRefreshing = false;
      waiters = [];
      return Promise.reject(e);
    }
  }
);

export default jwtAxios;
