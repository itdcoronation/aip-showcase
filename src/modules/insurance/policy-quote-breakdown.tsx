import { Button } from "@/components/ui/button";
import { ArrowRight, Car, Pencil } from "lucide-react";
import React, { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useInsuranceStore from "@/store/insurance";
import { addYears, format, isValid, parseISO } from "date-fns";
import { InsuranceProductOption } from "@/types/insurance";
import {
  InsurancePolicyMutationResponse,
  useCreateDraftPolicy,
  useUpdateDraftPolicy,
} from "@/requests/services/insurance/policy";
import { toast } from "sonner";
import { NoticeModal } from "@/components/modals/notice-modal";
import { PolicyPayButton } from "./_components/policy-pay-button";
import { useFetchInsuranceProducts } from "@/requests/services/insurance/products";

const INSURANCE_CATEGORY_IDS = ["private-motor", "commercial-motor"];

const getDraftPolicyId = (
  response: InsurancePolicyMutationResponse,
): string | number => {
  const data = response?.data;

  if (!data || typeof data !== "object") {
    return "";
  }

  const record = data as Record<string, unknown>;
  const idCandidate =
    record.id ?? record.policy_id ?? record.policyId ?? record.draft_id;

  return typeof idCandidate === "string" || typeof idCandidate === "number"
    ? idCandidate
    : "";
};

const InfoRow = ({
  label,
  value,
  showLine,
}: {
  label: string;
  value: string | number;
  showLine?: boolean;
}) => (
  <div
    className={`flex items-center justify-between py-4 first:pt-0 last:pb-0 ${showLine ? "border-b border-[#000000]/10" : ""}`}
  >
    <p className="text-p2 text-txt-secondary">{label}</p>
    <p className="text-p2 text-txt-primary font-medium">{value}</p>
  </div>
);

export const InsurancePolicyQuoteBreakdown = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const policyId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEditingDraft = !INSURANCE_CATEGORY_IDS.includes(policyId);
  const { vehicleInfo, personalInfo, products, resetPurchaseFlow } =
    useInsuranceStore();
  const { make, model, year, plateNumber } = vehicleInfo;
  const paymentModeRef = useRef<"pay_now" | "pay_later" | undefined>(
    undefined,
  );

  useFetchInsuranceProducts();

  const startDate = (() => {
    if (vehicleInfo.start_date) {
      const parsedStartDate = parseISO(vehicleInfo.start_date);

      if (isValid(parsedStartDate)) {
        return parsedStartDate;
      }
    }

    const fallbackStartDate = new Date();
    fallbackStartDate.setDate(fallbackStartDate.getDate() + 1);
    return fallbackStartDate;
  })();

  const endDate = addYears(startDate, 1);

  const vehicleType = vehicleInfo.vehicleType;
  const insuranceType = vehicleInfo.useType;

  const insuranceProducts =
    insuranceType === "private" || insuranceType === "commercial"
      ? products.third_party_motor_insurance[insuranceType]
      : undefined;

  const selectedProduct: InsuranceProductOption | undefined =
    insuranceProducts?.[vehicleType ?? ""];

  const [paymentMode, setPaymentMode] = useState<"pay_now" | "pay_later">();
  const [draftPolicyId, setDraftPolicyId] = useState<string | number>("");

  const handleDraftMutationSuccess = (
    response: InsurancePolicyMutationResponse,
  ) => {
    const generatedDraftId =
      getDraftPolicyId(response) || (isEditingDraft ? policyId : "");
    setDraftPolicyId(generatedDraftId);

    if (paymentModeRef.current === "pay_now") {
      if (!generatedDraftId) {
        toast.error(
          "Unable to start payment. Draft ID was not generated successfully.",
        );
        return;
      }

      toast.success(
        isEditingDraft
          ? "Draft policy updated. Opening payment..."
          : "Draft policy created. Opening payment...",
      );
    } else {
      setIsDraftNoticeModalVisible(true);
    }
  };

  const handleDraftMutationError = () => {
    toast.error(
      isEditingDraft
        ? "Failed to update draft policy. Please try again."
        : "Failed to save policy as draft. Please try again.",
    );
  };

  const { mutate: createDraftPolicy, isPending: isSavingDraft } =
    useCreateDraftPolicy({
      onSuccess: handleDraftMutationSuccess,
      onError: handleDraftMutationError,
    });

  const { mutate: updateDraftPolicy, isPending: isUpdatingDraft } =
    useUpdateDraftPolicy({
      onSuccess: handleDraftMutationSuccess,
      onError: handleDraftMutationError,
    });

  const [isDraftNoticeModalVisible, setIsDraftNoticeModalVisible] =
    React.useState(false);

  const handleCloseDraftNoticeModal = () => {
    setIsDraftNoticeModalVisible(false);
    resetPurchaseFlow();
    router.push("/insurance/policy");
  };

  const buildDraftPolicyFormData = () => {
    setDraftPolicyId("");
    const formData = new FormData();

    formData.append("license_number", vehicleInfo.plateNumber ?? "");
    formData.append("vehicle_type", vehicleInfo.vehicleType ?? "");
    formData.append("type", "third_party_motor_insurance");
    formData.append("kind", vehicleInfo.useType ?? "");
    formData.append("make", vehicleInfo.make ?? "");
    formData.append("model", vehicleInfo.model ?? "");
    formData.append("year", vehicleInfo.year ?? "");
    formData.append("chassis_number", vehicleInfo.chassisNumber ?? "");
    formData.append("engine_number", vehicleInfo.engineNumber ?? "");
    formData.append("color", vehicleInfo.color ?? "");

    formData.append("first_name", personalInfo.firstName ?? "");
    formData.append("middle_name", personalInfo.middleName ?? "");
    formData.append("last_name", personalInfo.lastName ?? "");
    formData.append("title", personalInfo.title ?? "");
    formData.append("email", personalInfo.email ?? "");
    formData.append("phone", personalInfo.phoneNumber ?? "");
    formData.append(
      "birth_date",
      personalInfo.dateOfBirth
        ? format(new Date(personalInfo.dateOfBirth), "yyyy-MM-dd")
        : "",
    );
    formData.append("street", personalInfo.residentialAddress ?? "");
    formData.append("house_number", personalInfo.houseNumber ?? "");
    formData.append("city", personalInfo.city ?? "");
    formData.append("state", personalInfo.state ?? "");

    if (vehicleInfo.proofOfOwnership) {
      formData.append("proof_of_ownership_media", vehicleInfo.proofOfOwnership);
    }

    if (personalInfo.proofOfIdentity) {
      formData.append(
        "identification_document_media",
        personalInfo.proofOfIdentity,
      );
    }

    formData.append("start_date", format(startDate, "yyyy-MM-dd"));

    return formData;
  };

  const handleSaveAsDraft = (mode: "pay_now" | "pay_later") => {
    setPaymentMode(mode);
    paymentModeRef.current = mode;

    const formData = buildDraftPolicyFormData();

    if (isEditingDraft) {
      updateDraftPolicy({
        policyId,
        data: formData,
      });
      return;
    }

    createDraftPolicy(formData);
  };

  const handleProceedToPayNow = () => {
    handleSaveAsDraft("pay_now");
  };

  const handleSaveAndPayLater = () => {
    handleSaveAsDraft("pay_later");
  };

  const isSavingPolicy = isSavingDraft || isUpdatingDraft;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:divide-x">
        <section className="sm:w-2/3 pl-0 sm:pr-6">
          <div className="space-y-5">
            <Button
              variant={"ghost"}
              size={"sm"}
              className="px-2"
              onClick={() => router.back()}
            >
              <ArrowRight className="rotate-180" />
              Back
            </Button>

            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-p2 text-txt-primary font-semibold mb-1">
                  Quote summary
                </p>
                <p className="text-p4 text-txt-secondary">
                  Review your insurance quote
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-[#000000]/10 space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-p2 text-txt-primary font-semibold">
                  Quote breakdown
                </p>

                <Button
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => router.replace(`/insurance/${policyId}/buy`)}
                >
                  <Pencil className="mr-2" />
                  Edit details
                </Button>
              </div>

              <div className="divide-y pt-3">
                <InfoRow
                  label="Base Premium"
                  value={
                    selectedProduct?.premium
                      ? `₦ ${selectedProduct.premium.toLocaleString()}`
                      : "N/A"
                  }
                />
                <InfoRow
                  label="Sum Insured"
                  value={
                    selectedProduct?.sum_insured
                      ? `₦ ${selectedProduct.sum_insured.toLocaleString()}`
                      : "N/A"
                  }
                />
                <InfoRow
                  label="Product Code"
                  value={selectedProduct?.product_code ?? "N/A"}
                />
                <InfoRow
                  label="Cover Code"
                  value={selectedProduct?.cover_code ?? "N/A"}
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-[#000000]/10 space-y-5">
              <p className="text-p2 text-txt-primary font-semibold">
                Coverage details
              </p>

              <div className="pt-3">
                <InfoRow
                  label="Policy duration"
                  value={"12 months"}
                  showLine={false}
                />
                <InfoRow
                  label="Start date"
                  value={format(startDate, "MMMM d, yyyy")}
                  showLine={false}
                />
                <InfoRow
                  label="End date"
                  value={format(endDate, "MMMM d, yyyy")}
                  showLine={false}
                />
              </div>
            </div>
          </div>
        </section>
        <aside className="sm:w-1/3 sm:pl-6 pr-0 flex flex-col justify-between mt-8 sm:mt-0">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-p2 text-txt-primary font-semibold mb-1">
                  Summary
                </p>
              </div>
            </div>

            <div className="bg-[#F4EBF7] rounded-2xl p-6 mt-5 space-y-3">
              <div className="flex flex-row items-start gap-5">
                <div className="bg-white rounded-2xl grid place-content-center w-12 h-12 flex-none">
                  <Car size={24} className="text-txt-secondary" />
                </div>

                <div>
                  <p className="text-p2 capitalize">
                    {insuranceType} Motor Insurance
                  </p>
                  <p className="text-txt-secondary">Comprehensive</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-p2 text-txt-secondary">{`${make} ${model} ${year}`}</p>
                <p className="text-p2 text-txt-secondary">{plateNumber}</p>
              </div>
            </div>

            <div className="pt-5">
              <InfoRow
                label="Total premium"
                value={
                  selectedProduct?.premium
                    ? `₦ ${selectedProduct.premium.toLocaleString()}`
                    : "N/A"
                }
              />
              <InfoRow label="Processing fee" value={"₦ 0"} />
              <hr className="border-[#000000]/10" />
              <InfoRow
                label="Total amount"
                value={
                  selectedProduct?.premium
                    ? `₦ ${selectedProduct.premium.toLocaleString()}`
                    : "N/A"
                }
              />
            </div>
          </div>

          <div className="space-y-3 pt-10">
            <PolicyPayButton
              email={personalInfo.email}
              amountInNaira={selectedProduct?.premium}
              paymentMode={paymentMode}
              policyID={draftPolicyId}
              onProceedToPayNow={handleProceedToPayNow}
              disabled={isSavingPolicy}
              autoStart={paymentMode === "pay_now"}
              autoStartKey={draftPolicyId}
              onSuccessAction={() => {
                resetPurchaseFlow();
                router.push("/insurance/policy");
              }}
            />
            <Button
              variant={"outline"}
              className="w-full"
              onClick={handleSaveAndPayLater}
              disabled={isSavingPolicy}
            >
              {isSavingPolicy ? "Saving..." : "Save & pay later"}
            </Button>
          </div>
        </aside>
      </div>

      <NoticeModal
        show={isDraftNoticeModalVisible}
        close={() => handleCloseDraftNoticeModal()}
        title="Policy saved as draft"
        description="Your insurance policy has been saved as a draft. You can find it in your policies list and complete the purchase whenever you're ready."
        type="success"
        action={{
          text: "Close",
          action: () => handleCloseDraftNoticeModal(),
          className: "!bg-bg-secondary !text-txt-primary mt-4",
        }}
      />
    </>
  );
};
