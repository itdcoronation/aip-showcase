"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInsurancePolicyColumns } from "@/components/tables/insurance-policy-table/columns";
import { InsurancePolicyTable } from "@/components/tables/insurance-policy-table";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  useDeleteDraftPolicy,
  useFetchInsurancePolicies,
  useDownloadPolicy,
} from "@/requests/services/insurance/policy";
import { InsurancePolicyApiItem, PolicyStatus } from "@/types/insurance";
import { PolicyPayButton } from "./_components/policy-pay-button";
import { toast } from "sonner";

const INACTIVE_POLICY_STATUSES: PolicyStatus[] = [
  "expired",
  "draft",
  "issued",
  "payment_failed",
  "upcoming",
  "awaiting_payment_process",
];

const PER_PAGE = 10;

interface PoliciesPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface PaymentTarget {
  key: string;
  policy: InsurancePolicyApiItem;
}

type PolicyTab = "active" | "inactive";

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

const getPaginationFromResponse = (response: unknown): PoliciesPagination => {
  const defaultPagination: PoliciesPagination = {
    current_page: 1,
    per_page: PER_PAGE,
    total: 0,
    last_page: 1,
  };

  if (!response || typeof response !== "object") {
    return defaultPagination;
  }

  const pagination = (response as { pagination?: unknown }).pagination;
  if (!pagination || typeof pagination !== "object") {
    return defaultPagination;
  }

  const parsed = pagination as Partial<PoliciesPagination>;

  return {
    current_page: Number(parsed.current_page) || 1,
    per_page: Number(parsed.per_page) || PER_PAGE,
    total: Number(parsed.total) || 0,
    last_page: Number(parsed.last_page) || 1,
  };
};

const InsurancePolicyUI = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get("tab");
  const [selectedTab, setSelectedTab] = useState<PolicyTab>(() =>
    tabQuery === "inactive" ? "inactive" : "active",
  );
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);
  const [paymentTarget, setPaymentTarget] = useState<PaymentTarget | null>(
    null,
  );
  const [downloadingPolicyId, setDownloadingPolicyId] = useState<string | null>(
    null,
  );
  const [deletingPolicyId, setDeletingPolicyId] = useState<string | null>(null);

  const {
    mutate: fetchActivePolicies,
    data: activeResponse,
    isPending: isFetchingActivePolicies,
  } = useFetchInsurancePolicies();

  const {
    mutate: fetchInactivePolicies,
    data: inactiveResponse,
    isPending: isFetchingInactivePolicies,
  } = useFetchInsurancePolicies();

  const { mutate: downloadPolicy, isPending: isDownloading } =
    useDownloadPolicy({
      onSuccess: (response, policyId) => {
        setDownloadingPolicyId(null);

        const downloadUrl =
          response.data?.download_url?.DATA2 ??
          response.data?.download_url?.DATA;

        if (!downloadUrl) {
          alert("Policy document is not available for download yet.");
          return;
        }

        const link = document.createElement("a");

        link.href = downloadUrl;
        link.setAttribute("download", `policy_${policyId}.pdf`);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
      onError: () => {
        setDownloadingPolicyId(null);
        alert("Failed to download policy document. Please try again.");
      },
    });

  const { mutate: deleteDraftPolicy, isPending: isDeletingDraftPolicy } =
    useDeleteDraftPolicy({
      onSuccess: (response) => {
        setDeletingPolicyId(null);
        toast.success(response.message ?? "Draft policy deleted successfully.");

        if (inactivePolicies.length === 1 && inactivePage > 1) {
          setInactivePage((prev) => Math.max(1, prev - 1));
          return;
        }

        fetchInactivePolicies({
          statuses: INACTIVE_POLICY_STATUSES,
          page: inactivePage,
          per_page: PER_PAGE,
        });
      },
      onError: (error) => {
        setDeletingPolicyId(null);
        toast.error(
          (error.response?.data as { message?: string })?.message ??
            "Failed to delete draft policy. Please try again.",
        );
      },
    });

  const handlePolicyDocumentAction = (policyId: string, action: "download") => {
    if (action === "download") {
      setDownloadingPolicyId(policyId);
      downloadPolicy(policyId);
    }
  };

  const handleDownloadPolicyCertificate = (policy: InsurancePolicyApiItem) => {
    const latestCertificate = [...(policy.policy_media ?? [])]
      .reverse()
      .find((media) => media.type === "certificate");

    const url = latestCertificate?.media.url;

    if (url) {
      window.open(url, "_blank");
      return;
    }

    handlePolicyDocumentAction(String(policy.id), "download");
  };

  const handleDeleteDraftPolicy = (policy: InsurancePolicyApiItem) => {
    const shouldDelete = window.confirm(
      "Delete this draft policy? This action cannot be undone.",
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingPolicyId(String(policy.id));
    deleteDraftPolicy(String(policy.id));
  };

  const columns = getInsurancePolicyColumns({
    handleView: (id) => router.push(`/insurance/policy/${id}`),
    handleDownload: handleDownloadPolicyCertificate,
    handleEdit: (id) => router.push(`/insurance/${id}/buy`),
    handleDelete: handleDeleteDraftPolicy,
    handlePayNow: (policy) =>
      setPaymentTarget({
        key: `pay-now-${policy.id}-${Date.now()}`,
        policy,
      }),
    handlePayAgain: (policy) =>
      setPaymentTarget({
        key: `pay-again-${policy.id}-${Date.now()}`,
        policy,
      }),
    downloadingPolicyId,
    deletingPolicyId,
    isDownloading,
    isDeleting: isDeletingDraftPolicy,
  });

  useEffect(() => {
    const nextTab = tabQuery === "inactive" ? "inactive" : "active";

    setSelectedTab((currentTab) =>
      currentTab === nextTab ? currentTab : nextTab,
    );
  }, [tabQuery]);

  const handleTabChange = (value: string) => {
    const nextTab = value as PolicyTab;
    const params = new URLSearchParams(searchParams.toString());

    setSelectedTab(nextTab);

    if (nextTab === "inactive") {
      params.set("tab", "inactive");
    } else {
      params.delete("tab");
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  useEffect(() => {
    if (selectedTab === "inactive") {
      fetchInactivePolicies({
        statuses: INACTIVE_POLICY_STATUSES,
        page: inactivePage,
        per_page: PER_PAGE,
      });
    } else {
      fetchActivePolicies({
        statuses: ["active"],
        page: activePage,
        per_page: PER_PAGE,
      });
    }
  }, [
    selectedTab,
    activePage,
    inactivePage,
    fetchInactivePolicies,
    fetchActivePolicies,
  ]);

  const activePolicies = useMemo(
    () => getPoliciesFromResponse(activeResponse?.data),
    [activeResponse?.data],
  );

  const inactivePolicies = useMemo(
    () => getPoliciesFromResponse(inactiveResponse?.data),
    [inactiveResponse?.data],
  );

  const activePagination = useMemo(
    () => getPaginationFromResponse(activeResponse),
    [activeResponse],
  );

  const inactivePagination = useMemo(
    () => getPaginationFromResponse(inactiveResponse),
    [inactiveResponse],
  );

  const tableData =
    selectedTab === "active" ? activePolicies : inactivePolicies;
  const isPending =
    selectedTab === "active"
      ? isFetchingActivePolicies
      : isFetchingInactivePolicies;
  const currentPagination =
    selectedTab === "active" ? activePagination : inactivePagination;

  const hasPreviousPage = currentPagination.current_page > 1;
  const hasNextPage =
    currentPagination.current_page < currentPagination.last_page;

  const handlePrevPage = () => {
    if (!hasPreviousPage) return;

    if (selectedTab === "active") {
      setActivePage((prev) => Math.max(1, prev - 1));
    } else {
      setInactivePage((prev) => Math.max(1, prev - 1));
    }
  };

  const handleNextPage = () => {
    if (!hasNextPage) return;

    if (selectedTab === "active") {
      setActivePage((prev) => prev + 1);
    } else {
      setInactivePage((prev) => prev + 1);
    }
  };

  return (
    <>
      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <ArrowLeft /> Back
      </Button>

      <section className="bg-white shadow-sm border border-[#EEEFF1] rounded-[12px] py-6 px-4 overflow-auto mt-4">
        <Tabs
          defaultValue="active"
          value={selectedTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Policies</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Policies</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <InsurancePolicyTable
              columns={columns}
              data={tableData}
              loading={isPending}
            />
          </TabsContent>
          <TabsContent value="inactive">
            <InsurancePolicyTable
              columns={columns}
              data={tableData}
              loading={isPending}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-xs text-txt-secondary">
            Page {currentPagination.current_page} of{" "}
            {currentPagination.last_page}
          </p>

          <div className="flex gap-2">
            <Button
              disabled={!hasPreviousPage || isPending}
              onClick={handlePrevPage}
              size={"icon"}
              variant={"outline"}
              className="rounded-full"
            >
              <ChevronLeft size={18} className="w-[18px]! h-[18px]!" />
            </Button>
            <Button
              disabled={!hasNextPage || isPending}
              onClick={handleNextPage}
              size={"icon"}
              variant={"outline"}
              className="rounded-full"
            >
              <ChevronRight size={18} className="w-[18px]! h-[18px]!" />
            </Button>
          </div>
        </div>
      </section>

      <PolicyPayButton
        showButton={false}
        autoStart={Boolean(paymentTarget)}
        autoStartKey={paymentTarget?.key}
        email={
          paymentTarget?.policy.insurance_policy_payload?.policyholder?.email
        }
        amountInNaira={
          paymentTarget?.policy.insurance_policy_type_snapshot?.premium
        }
        policyID={paymentTarget?.policy.id}
        onModalClose={() => setPaymentTarget(null)}
        onSuccessAction={() => {
          const currentPolicyId = paymentTarget?.policy.id;
          setPaymentTarget(null);

          if (currentPolicyId) {
            router.push(`/insurance/policy/${currentPolicyId}`);
          }
        }}
      />
    </>
  );
};

export { InsurancePolicyUI as InsurancePolicyList };
