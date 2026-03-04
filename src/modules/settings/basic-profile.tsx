"use client";

import { useSearchParams } from "next/navigation";
import { PersonalInfoForm } from "./_components/personal-info-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyInfoForm } from "./_components/company-info-form";
import useOnboardingStore from "@/store/onboarding";

const BasicProfileUI = () => {
  const params = useSearchParams();
  const type = params.get("type");
  const { data } = useOnboardingStore();

  // Show first three and last three and mask the middle four digits with asterisks.
  const maskBVN = (bvn: string) => {
    if (bvn.length !== 11) return bvn; // BVN should be 11 digits
    return `${bvn.slice(0, 3)}*****${bvn.slice(8)}`;
  };

  const maskedBvn = data?.bvn ? maskBVN(data.bvn) : "";

  return (
    <div className="max-w-md">
      {type === "joint" ? (
        <>
          <Tabs defaultValue="user_1">
            <TabsList className="mb-6">
              <TabsTrigger value="user_1">User 1</TabsTrigger>
              <TabsTrigger value="user_2">User 2</TabsTrigger>
            </TabsList>
            <TabsContent value="user_1">
              <PersonalInfoForm key={"user_1"} />
            </TabsContent>
            <TabsContent value="user_2">
              <PersonalInfoForm key={"user_2"} />
            </TabsContent>
          </Tabs>
        </>
      ) : type === "corporate" ? (
        <CompanyInfoForm />
      ) : (
        <PersonalInfoForm
          initData={{
            email:  data?.email_address || "",
            bvn: maskedBvn,
            phone:  data?.telephone || "",
            alt_phone: data?.alternate_phone || "",
            first_name: data?.first_name || "",
            last_name: data?.surname || "",
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
      )}
    </div>
  );
};

export { BasicProfileUI };
