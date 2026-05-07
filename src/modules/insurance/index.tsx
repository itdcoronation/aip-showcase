"use client";

import { ActivePolicies } from "./_components/active-policies";
import { InsuranceCategories } from "./_components/categories";
import { StatCard } from "./_components/stat-card";
import { useFetchInsurancePolicies } from "@/requests/services/insurance/policy";
import { InsurancePolicyApiItem } from "@/types/insurance";
import { useEffect, useMemo } from "react";

const getPoliciesFromResponse = (
  responseData: unknown,
): InsurancePolicyApiItem[] => {
  if (Array.isArray(responseData)) {
    return responseData as InsurancePolicyApiItem[];
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "items" in responseData &&
    Array.isArray((responseData as { items?: unknown }).items)
  ) {
    return (responseData as { items: InsurancePolicyApiItem[] }).items;
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "policies" in responseData &&
    Array.isArray((responseData as { policies?: unknown }).policies)
  ) {
    return (responseData as { policies: InsurancePolicyApiItem[] }).policies;
  }

  return [];
};

const InsuranceUI = () => {
  const {
    mutate: fetchActivePolicies,
    data: activePoliciesResponse,
    isPending: isFetchingActivePolicies,
  } = useFetchInsurancePolicies();

  useEffect(() => {
    fetchActivePolicies(["active"]);
  }, [fetchActivePolicies]);

  const activePolicies = useMemo(
    () => getPoliciesFromResponse(activePoliciesResponse?.data),
    [activePoliciesResponse?.data],
  );

  const totalPremiumValue = useMemo(() => {
    if (!activePoliciesResponse?.data) {
      return 0;
    }

    const policies = getPoliciesFromResponse(activePoliciesResponse.data);

    return policies.reduce((total, policy) => {
      return total + (policy.insurance_policy_type_snapshot?.premium || 0);
    }, 0);
  }, [activePoliciesResponse?.data]);

  return (
    <>
      <section className="grid gap-12">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          <StatCard
            label="Active Policies"
            value={activePolicies.length}
            className="bg-[#EFF6FF]"
          />
          <StatCard
            label="Total Premium Value"
            value={totalPremiumValue.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
            hideable
            className="bg-[#F9F3FF]"
          />
        </div>

        <InsuranceCategories />

        <ActivePolicies
          policyData={activePolicies}
          loading={isFetchingActivePolicies}
        />
      </section>
    </>
  );
};

export { InsuranceUI };
