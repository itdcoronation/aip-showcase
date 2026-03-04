import axios, { InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "./token";

const authBaseURL = `${process.env.NEXT_PUBLIC_AUTH_API_BASE_URL}/api`; // Auth service base URL
const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`; // User service base URL

/**
 * Unauthenticated API URL
 */
export const axiosInstanceUnauth = axios.create({
  baseURL: authBaseURL,
});

/**
 * Authenticated Authentication Service API URL
 */
export const axiosInstanceAuth2 = axios.create({
  baseURL: authBaseURL,
});

/**
 * Authenticated API URL
 */
export const axiosInstanceAuth = axios.create({
  baseURL,
});

const unauthRequestInterceptor = async (config: InternalAxiosRequestConfig) => {
  if (config.headers) {
    config.headers["X-API-KEY"] = process.env.NEXT_PUBLIC_AUTH_API_KEY!;
  }
  return config;
};

const authRequestInterceptor = async (config: InternalAxiosRequestConfig) => {
  if (config.headers) {
    const token = await getAccessToken();
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
      config.withCredentials = true;
    }
  }
  return config;
};

const authRequestInterceptor2 = async (config: InternalAxiosRequestConfig) => {
  if (config.headers) {
    config.headers["X-API-KEY"] = process.env.NEXT_PUBLIC_AUTH_API_KEY!;
    const token = await getAccessToken();
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
      config.withCredentials = true;
    }
  }
  return config;
};

axiosInstanceAuth.interceptors.request.use(authRequestInterceptor);
axiosInstanceAuth2.interceptors.request.use(authRequestInterceptor2);
axiosInstanceUnauth.interceptors.request.use(unauthRequestInterceptor);
