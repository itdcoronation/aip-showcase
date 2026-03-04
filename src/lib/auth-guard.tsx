"use client";
import { JSX, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/page-loader";
import { toast } from "sonner";
import { useFetchProfile } from "@/requests/services/user/profile";
import { useGetOnboardingSteps } from "@/requests/services/onboarding/status";
import { useFetchOnboardingData } from "@/requests/services/onboarding/user-data";
import useUserStore from "@/store/user";
import { ROUTES } from "./routes";
import { useFetchRiskProfile } from "@/requests/services/user/risk-profile";

export default function isAuth(Component: (props) => JSX.Element) {
  return function IsAuth(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    const { staging_id } = useUserStore();
    // If tokens are missing, redirect to login
    useEffect(() => {
      if (!accessToken || !refreshToken) {
        toast.error(
          "Session not found. You must be logged in to access this page"
        );
        localStorage.clear();
        router.push(ROUTES.login);
      } else {
        setLoading(false);
      }
    }, [accessToken, refreshToken]);

    const { data: profileData, isPending } = useFetchProfile({
      enabled: !!accessToken,
    });
    const { refetch } = useGetOnboardingSteps(profileData?.data?.user?.email);
    useFetchRiskProfile();

    useFetchOnboardingData({
      id: staging_id ?? "",
      options: {
        enabled: !!accessToken && !!staging_id,
      },
    });

    useEffect(() => {
      if (profileData?.data?.user?.email) {
        refetch();
      }
    }, [profileData]);

    return loading || isPending ? <PageLoader /> : <Component {...props} />;
  };
}
