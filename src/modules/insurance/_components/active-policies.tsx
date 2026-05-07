import { EmptyStateSvg } from "@/assets/vectors";
import React from "react";
import { Button } from "@/components/ui/button";
import { InsurancePolicyApiItem, PolicyData } from "@/types/insurance";
import { Building2, Car, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ActivePoliciesProps {
  policyData?: Array<PolicyData | InsurancePolicyApiItem>;
  loading?: boolean;
}

const ActivePolicies = ({ policyData, loading }: ActivePoliciesProps) => {
  const router = useRouter();
  const policies = policyData ?? [];

  const handleSeeAllPolicies = () => {
    router.push("/insurance/policy");
  };

  return (
    <>
      <div>
        <div className="flex-wrap flex items-center justify-between gap-2 mb-6">
          <div>
            <p className="text-p2 text-txt-primary font-semibold mb-1">
              Active Policies
            </p>
            <p className="text-p4 text-txt-secondary">
              A list of your active insurance policies
            </p>
          </div>

          <Button
            onClick={handleSeeAllPolicies}
            size={"sm"}
            variant={"ghost"}
            className="text-xs flex items-center"
          >
            <span>See more</span>
            <ChevronRight size={16} className="w-6! h-6!" />
          </Button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
            {Array.from({ length: 2 }).map((_, index) => (
              <ActivePolicySkeleton key={index} />
            ))}
          </div>
        ) : policies.length === 0 ? (
          <div className="bg-white shadow-sm border border-[#EEEFF1] py-12 px-4 rounded-[12px]">
            <EmptyActivePolicies />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
            {policies.map((policy) => (
              <Link key={policy.id} href={`/insurance/policy/${policy.id}`}>
                <PolicyCard policy={policy} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export { ActivePolicies };

const ActivePolicySkeleton = () => {
  return (
    <div className="bg-white shadow-sm border border-[#EEEFF1] py-4 px-4 rounded-[12px] flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3 w-full">
        <div className="w-12 h-12 rounded-lg bg-slate-100 shrink-0" />

        <div className="space-y-2 w-full max-w-[220px]">
          <div className="h-4 rounded bg-slate-100 w-3/4" />
          <div className="h-3 rounded bg-slate-100 w-1/2" />
        </div>
      </div>

      <div className="space-y-2 min-w-[88px]">
        <div className="h-4 rounded bg-slate-100 w-20 ml-auto" />
        <div className="h-6 rounded-full bg-slate-100 w-16 ml-auto" />
      </div>
    </div>
  );
};

const EmptyActivePolicies = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-2">
      <EmptyStateSvg />
      <p className="text-p2 text-txt-primary font-semibold">
        You have no active insurance policies
      </p>
      <p className="text-l3 text-txt-secondary max-w-[280px] text-center">
        Choose an insurance category above to get started
      </p>
    </div>
  );
};

const policyIconConfig: Record<
  string,
  { icon: React.ReactNode; bg: string; color: string; border: string }
> = {
  private: {
    icon: <Car size={22} className="text-blue-500" />,
    bg: "bg-blue-50",
    color: "text-blue-500",
    border: "border border-blue-100",
  },
  commercial: {
    icon: <Building2 size={22} className="text-purple-500" />,
    bg: "bg-purple-50",
    color: "text-purple-500",
    border: "border border-purple-100",
  },
  other: {
    icon: <Car size={22} className="text-blue-500" />,
    bg: "bg-blue-50",
    color: "text-blue-500",
    border: "border border-blue-100",
  },
};

const policyStatusConfig: Record<string, string> = {
  active: "bg-[#F0FDF4] text-[#008236]",
  inactive: "bg-[#F8FAFC] text-[#475467]",
  pending: "bg-[#FFFAEB] text-[#B54708]",
  issued: "bg-[#F0FDF4] text-[#008236]",
  expired: "bg-[#FEF2F2] text-[#B42318]",
  payment_failed: "bg-[#FEF2F2] text-[#B42318]",
  awaiting_payment_process: "bg-[#FFFAEB] text-[#B54708]",
  upcoming: "bg-[#EFF8FF] text-[#175CD3]",
  draft: "bg-[#F8FAFC] text-[#475467]",
};

const formatName = (policy: PolicyData | InsurancePolicyApiItem): string => {
  if ("name" in policy && policy.name) {
    return policy.name;
  }

  const firstName =
    "insurance_policy_payload" in policy
      ? policy.insurance_policy_payload?.policyholder?.first_name
      : undefined;
  const lastName =
    "insurance_policy_payload" in policy
      ? policy.insurance_policy_payload?.policyholder?.last_name
      : undefined;

  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  return fullName || "Unnamed policyholder";
};

const formatPolicyNumber = (
  policy: PolicyData | InsurancePolicyApiItem,
): string => {
  if ("policyNumber" in policy && policy.policyNumber) {
    return policy.policyNumber;
  }

  if ("policy_number" in policy && policy.policy_number) {
    return policy.policy_number;
  }

  return `${policy.id}`;
};

const formatAmount = (policy: PolicyData | InsurancePolicyApiItem): number => {
  if ("amount" in policy && Number.isFinite(policy.amount)) {
    return policy.amount;
  }

  if (
    "insurance_policy_type_snapshot" in policy &&
    Number.isFinite(policy.insurance_policy_type_snapshot?.premium)
  ) {
    return policy.insurance_policy_type_snapshot.premium;
  }

  return 0;
};

const getPolicyKind = (policy: PolicyData | InsurancePolicyApiItem): string => {
  if (
    "insurance_policy_type_snapshot" in policy &&
    policy.insurance_policy_type_snapshot?.kind
  ) {
    return policy.insurance_policy_type_snapshot.kind.toLowerCase();
  }

  return String(policy.type || "other").toLowerCase();
};

const getPolicyStatus = (
  policy: PolicyData | InsurancePolicyApiItem,
): string => {
  return String(policy.status || "inactive").toLowerCase();
};

const PolicyCard = ({
  policy,
}: {
  policy: PolicyData | InsurancePolicyApiItem;
}) => {
  const iconCfg =
    policyIconConfig[getPolicyKind(policy)] ?? policyIconConfig.other;
  const status = getPolicyStatus(policy);
  const statusClass =
    policyStatusConfig[status] ?? "bg-[#F8FAFC] text-[#475467]";
  const displayName = formatName(policy);
  const displayPolicyNumber = formatPolicyNumber(policy);
  const displayAmount = formatAmount(policy);

  return (
    <div className="bg-white shadow-sm border border-[#EEEFF1] py-4 px-4 rounded-[12px] flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-lg ${iconCfg.bg} ${iconCfg.border} ${iconCfg.color} flex items-center justify-center`}
        >
          {iconCfg.icon}
        </div>

        <div>
          <p className="text-p2 text-txt-primary font-semibold mb-1">
            {displayName}
          </p>
          <p className="text-p4 text-txt-secondary">
            Policy #{displayPolicyNumber}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-p2 font-semibold text-txt-primary mb-1">
          ₦ {displayAmount.toLocaleString()}
        </p>

        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-p4 font-medium leading-none capitalize ${statusClass}`}
        >
          {status.replaceAll("_", " ")}
        </span>
      </div>
    </div>
  );
};
