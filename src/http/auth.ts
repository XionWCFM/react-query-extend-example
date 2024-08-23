import { KyInstance } from "ky";

const LOCAL_STORAGE_ACCESS_TOKEN = "acessToken";
const AUTHORIZATION_HEADER = "Authorization";
const REFRESH_TOKEN_END_POINT = "api/auth/reissue";
const LOGIN_END_POINT = "api/auth/login";
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
};

const refreshAccessToken = async (kyInstance: KyInstance): Promise<string | null> => {
  try {
    const response = await kyInstance.get(REFRESH_TOKEN_END_POINT, {
      credentials: "include",
      retry: {
        limit: 2,
        methods: ["get"],
        statusCodes: [500, 502, 503, 504],
        backoffLimit: 1000,
      },
    });
    const accessToken = response.headers.get(auth.AUTHORIZATION_HEADER);
    if (accessToken) {
      auth.setAccessToken(auth.removeBearer(accessToken));
    }
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return null;
  }
};

const login = async (instance: KyInstance) => {
  const response = await instance.get(LOGIN_END_POINT);
  const token = response.headers.get(AUTHORIZATION_HEADER);
  if (token) {
    setAccessToken(removeBearer(token));
  }
  return token;
};

const addBearer = (value: string) => {
  if (!value.startsWith("Bearer ")) {
    return `Bearer ${value}`;
  }
  return value;
};

const removeBearer = (value: string) => value.replace("Bearer ", "");

const setAccessToken = (token: string): void => {
  safeLocalStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, removeBearer(token));
};

const getAccessToken = () => {
  const result = safeLocalStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
  if (result) {
    return removeBearer(result);
  }
  return result;
};

export const auth = {
  LOCAL_STORAGE_ACCESS_TOKEN,
  AUTHORIZATION_HEADER,
  getAccessToken,
  setAccessToken,
  addBearer,
  removeBearer,
  refreshAccessToken,
  login,
};
