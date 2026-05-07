"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CalendarDays,
  Car,
  Download,
  FileText,
  Loader,
  Shield,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  useFetchInsurancePolicyById,
  useDownloadPolicy,
} from "@/requests/services/insurance/policy";
import { toast } from "sonner";
import { InsurancePolicyApiItem } from "@/types/insurance";

const InfoRow = ({
  label,
  value,
  lowercase = false,
}: {
  label: string;
  value: string | number | undefined | null;
  lowercase?: boolean;
}) => (
  <div>
    <p className="text-p4 text-txt-secondary mb-1">{label}</p>
    <p
      className={cn(
        "text-p3 text-txt-primary font-medium",
        !lowercase && "capitalize",
      )}
    >
      {value ?? "—"}
    </p>
  </div>
);

const CoverageItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  const isAmount = typeof value === "number";
  return (
    <div>
      <p className="text-p4 text-txt-secondary mb-1">{label}</p>
      <p
        className={cn(
          "text-p3 font-medium",
          isAmount
            ? "text-txt-primary"
            : value === "Covered"
              ? "text-txt-success"
              : "text-txt-danger",
        )}
      >
        {isAmount ? `₦ ${(value as number).toLocaleString()}` : value}
      </p>
    </div>
  );
};

const InsurancePolicyPreview = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [policyData, setPolicyData] = useState<Record<string, any> | null>(
    null,
  );

  const { mutate: fetchPolicy, isPending: isFetching } =
    useFetchInsurancePolicyById({
      onSuccess: (data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPolicyData((data as any).data ?? null);
      },
    });

  const { mutate: downloadPolicy, isPending: isDownloading } =
    useDownloadPolicy({
      onSuccess: (data) => {
        const url = data?.data?.download_url?.DATA;
        if (url) window.open(url, "_blank");
      },
      onError: (error) => {
        toast.error(
          (error.response?.data as { message?: string })?.message ??
            "Failed to download policy certificate",
        );
      },
    });

  const downloadPolicyCertificate = (policy: InsurancePolicyApiItem) => {
    const latestCertificate = [...(policy.policy_media ?? [])]
      .reverse()
      .find((media) => media.type === "certificate");

    const url = latestCertificate?.media.url;

    if (url) {
      window.open(url, "_blank");
      return;
    }

    downloadPolicy(String(policy.id));
  };

  useEffect(() => {
    if (id) fetchPolicy({ policyId: id });
  }, [fetchPolicy, id]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64 text-txt-secondary">
        Loading policy...
      </div>
    );
  }

  if (!policyData) {
    return (
      <div className="space-y-5">
        <Button onClick={router.back} variant={"ghost"} size={"sm"}>
          <ArrowLeft /> Back to Policies
        </Button>
        <p className="text-txt-secondary text-p3">Policy not found.</p>
      </div>
    );
  }

  const snapshot = policyData.insurance_policy_type_snapshot ?? {};
  const vehicle = policyData.insurance_policy_payload?.vehicle ?? {};
  const policyholder = policyData.insurance_policy_payload?.policyholder ?? {};
  const kind: string = snapshot.kind ?? "";
  const isComprehensive = kind.toLowerCase().includes("comprehensive");

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const status: string = policyData.status ?? "";

  return (
    <div className="space-y-5">
      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <ArrowLeft /> Back to Policies
      </Button>

      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-p2 text-txt-primary font-semibold mb-1">
            Policy Details
          </p>
          <p className="text-p4 text-txt-secondary">
            {policyData.policy_number}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size={"m"}
            onClick={() =>
              downloadPolicyCertificate(policyData as InsurancePolicyApiItem)
            }
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader className="w-4! h-4! animate-spin" />
            ) : (
              <Download className="w-4! h-4!" />
            )}
            {isDownloading ? "Downloading..." : "Download certificate"}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
        <div className="p-5 rounded-2xl border border-[#EEEFF1] shadow-xs bg-white">
          <div className="flex items-center gap-2 text-txt-secondary mb-3">
            <div className="w-8 h-8  bg-[#EFF6FF] rounded-md flex items-center justify-center ">
              <Shield size={16} className="text-blue-500 " />
            </div>
            <p className="text-p4">Status</p>
          </div>
          <p
            className={cn(
              "text-p1 font-semibold capitalize",
              status === "active" || status === "issued"
                ? "text-txt-success"
                : "text-txt-danger",
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-[#EEEFF1] shadow-xs bg-white">
          <div className="flex items-center gap-2 text-txt-secondary mb-3">
            <div className="w-8 h-8 rounded-md bg-[#FFF0F5] flex items-center justify-center">
              <CalendarDays size={16} className="text-[#E5467D]" />
            </div>
            <p className="text-p4">Valid until</p>
          </div>
          <p className="text-p1 font-semibold text-txt-primary">
            {formatDate(policyData.end_date)}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-[#EEEFF1] shadow-xs bg-white">
          <div className="flex items-center gap-2 text-txt-secondary mb-3">
            <div className="w-8 h-8 rounded-md bg-[#EDFDF5] flex items-center justify-center">
              <FileText size={16} className="text-[#12B76A]" />
            </div>
            <p className="text-p4">Annual premium</p>
          </div>
          <p className="text-p1 font-semibold text-txt-primary">
            ₦ {Number(snapshot.premium ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div className="p-6 rounded-2xl border border-[#EEEFF1] shadow-xs bg-white space-y-5">
          <p className="text-p2 text-txt-primary font-semibold">
            Policy information
          </p>
          <InfoRow
            label="Insurance type"
            value={policyData.type.split("_").join(" ")}
          />
          <InfoRow label="Policy number" value={policyData.policy_number} />
          <InfoRow label="Coverage type" value={snapshot.kind} />
          <InfoRow
            label="Start date"
            value={formatDate(policyData.start_date)}
          />
          <InfoRow label="End date" value={formatDate(policyData.end_date)} />
        </div>

        <div className="p-6 rounded-2xl border border-[#EEEFF1] shadow-xs bg-white space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#EEF0FF] flex items-center justify-center">
              <Car size={16} className="text-[#6366F1]" />
            </div>
            <p className="text-p2 text-txt-primary font-semibold">
              Vehicle information
            </p>
          </div>
          <InfoRow
            label="Vehicle"
            value={
              [vehicle.vehicle_make, vehicle.vehicle_model]
                .filter(Boolean)
                .join(" ") || "—"
            }
          />
          <InfoRow label="Registration number" value={vehicle.license_number} />
          <InfoRow label="Chassis number" value={vehicle.vin_number} />
          <InfoRow label="Engine number" value={vehicle.engine_number} />
          <InfoRow
            label="Vehicle Insured Value"
            value={
              snapshot.sum_insured
                ? `₦ ${Number(snapshot.sum_insured).toLocaleString()}`
                : "—"
            }
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-[#EEEFF1] shadow-xs bg-white space-y-5">
        <p className="text-p2 text-txt-primary font-semibold">
          Personal information
        </p>
        <InfoRow
          label="Full name"
          value={
            [
              policyholder.title,
              policyholder.first_name,
              policyholder.middle_name,
              policyholder.last_name,
            ]
              .filter(Boolean)
              .join(" ") || "—"
          }
        />
        <InfoRow label="Email" value={policyholder.email} lowercase={true} />
        <InfoRow label="Phone" value={policyholder.phone} />
        <InfoRow
          label="Date of birth"
          value={formatDate(policyholder.birth_date)}
        />
        <InfoRow
          label="Address"
          value={
            [
              policyholder.house_number,
              policyholder.street,
              policyholder.city,
              policyholder.state,
              policyholder.country,
            ]
              .filter(Boolean)
              .join(", ") || "—"
          }
        />
      </div>

      <div className="p-6 rounded-2xl border border-[#EEEFF1] shadow-xs bg-white">
        <p className="text-p2 text-txt-primary font-semibold mb-6">
          Coverage details
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-y-6">
          <CoverageItem label="Third party liability" value="Covered" />
          <CoverageItem
            label="Own damage"
            value={isComprehensive ? "Covered" : "Not covered"}
          />
          <CoverageItem
            label="Theft"
            value={isComprehensive ? "Covered" : "Not covered"}
          />
          <CoverageItem
            label="Fire"
            value={isComprehensive ? "Covered" : "Not covered"}
          />
          <CoverageItem label="Third party property" value="Covered" />
        </div>
      </div>
    </div>
  );
};

export default InsurancePolicyPreview;
