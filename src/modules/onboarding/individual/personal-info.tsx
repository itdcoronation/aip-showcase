"use client";
import useOnboardingStore from "@/store/onboarding";
import { useEffect } from "react";
import { FormHeader } from "@/components/form/header";
import {
  PersonalInfoForm,
  PersonalInfoFormData,
} from "../_components/personal-info-form";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/user";
import { useSubmitPersonalInfo } from "@/requests/services/onboarding/personal-info";
import { useQueryClient } from "@tanstack/react-query";
import { PersonalInfoRequestBody } from "@/types/onboarding";
import { format } from "date-fns";
import { toast } from "sonner";
import { useGetOnboardingSteps } from "@/requests/services/onboarding/status";

const IndividualPersonalInfoUI: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refetch } = useGetOnboardingSteps();

  const { markStepComplete, setCurrentStep, data } = useOnboardingStore();
  const { basic_info, staging_id } = useUserStore();

  // Personal info mutation
  const { mutate, isPending } = useSubmitPersonalInfo({
    id: staging_id,
    onSuccess: (data) => {
      markStepComplete("personal");
      toast.success(data.message ?? "Personal information saved successfully");
      router.push(ROUTES.onboarding_individual_bank);
      refetch();
      queryClient.invalidateQueries({
        queryKey: ["fetch-onboarding-user-data"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "An error occurred. Please try again."
      );
    },
  });

  useEffect(() => {
    setCurrentStep("personal");
  }, []);

  const handleSubmit = (data: PersonalInfoFormData) => {
    const payload: PersonalInfoRequestBody = {
      email_address: data.email,
      surname: data.last_name,
      first_name: data.first_name,
      other_names: data.other_names || undefined,
      account_type: "IND",
      title: data.title,
      sex: data.gender === "Male" ? 1 : 2,
      date_of_birth: format(data.dob, "yyyy-MM-dd"),
      state: data.state_name,
      state_code: data.state,
      lga: data.lga,
      nationality: data.nationality,
      telephone: data.phone,
      city: data.city,
      country: data.country,
      permanent_address: data.street,
      mothers_maiden_name: data.mother_maiden_name,
      is_diaspora: data.dispora_client === "Yes" ? 1 : 0,
      postal_code: data.postal_code,
      bvn: data.bvn,
      alternate_phone: data.alt_phone || undefined,
    };
    mutate(payload);
  };

  return (
    <>
      <FormHeader
        title="Personal information"
        description="Tell us a bit about yourself"
        titleType="h2"
      />
      <PersonalInfoForm
        formId="individual-personal-info"
        submit={handleSubmit}
        isPending={isPending}
        initData={{
          email: basic_info?.email || data?.email_address || "",
          bvn: basic_info.bvn || data?.bvn || "",
          phone: basic_info.phone || data?.telephone || "",
          alt_phone: data?.alternate_phone || "",
          first_name: basic_info?.first_name || data?.first_name || "",
          last_name: basic_info?.last_name || data?.surname || "",
          nationality: data?.nationality || "",
          street: data?.permanent_address || "",
          city: data?.city || "",
          country: "Nigeria",
          state: data?.state_code || "",
          state_name: data?.state || "",
          mother_maiden_name: data?.mothers_maiden_name || "",
          gender: data?.sex ? (data?.sex === 1 ? "Male" : "Female") : "",
          lga: data?.lga || "",
          title: data?.title || "",
          dispora_client: data?.is_diaspora ? "Yes" : "No",
          other_names: data?.other_names || "",
          dob: data?.date_of_birth ? new Date(data.date_of_birth) : undefined,
          postal_code: data?.postal_code || "",
        }}
      />
    </>
  );
};

export { IndividualPersonalInfoUI };
