import { useEffect, useState } from "react";

export const useExtractUrlFragments = () => {
  const [fragments, setFragments] = useState<{
    token: string | null;
    callback: string | null;
  }>({
    token: null,
    callback: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);

    const token = params.get("token");
    const callbackEncoded = params.get("callback");

    let callback: string | null = null;
    if (callbackEncoded) {
      try {
        callback = decodeURIComponent(atob(callbackEncoded));
      } catch (err) {
        console.error("Failed to decode callback:", err);
      }
    }
    setFragments({ token, callback });
  }, []);
console.log(fragments, "fragments");
  return fragments;
};
