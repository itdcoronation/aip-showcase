"use server";
import { resetStores } from "@/store/useStores";
import axios from "axios";
import { cookies } from "next/headers";

export const getAccessToken = async () => {
  const tokenCookie = await cookies();
  return tokenCookie.get("access_token")?.value;
};

export const getRefreshToken = async () => {
  const refreshCookie = await cookies();
  return refreshCookie.get("refresh_token")?.value;
};

export const getNewToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    // A POST request to the Next.js route for refresh-token
    const response = await axios.post(`/api/auth/refresh-token`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    return newAccessToken;
  } catch (error) {
    console.error("Error getting new token:", error);
  }
};

export const clearTokens = async () => {
  const cookiesInstance = await cookies();
  cookiesInstance.delete("access_token");
  cookiesInstance.delete("refresh_token");
  resetStores();
};
