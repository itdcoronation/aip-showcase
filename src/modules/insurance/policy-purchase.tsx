"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, LoaderCircle, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AddPersonalInformationModal } from "@/modules/insurance/_components/modals/add-personal-information";
import { AddVehicleInformationModal } from "@/modules/insurance/_components/modals/add-vehicle-information";
import { PersonalInfoPreview } from "./_components/personal-info-preview";
import { VehicleInfoPreview } from "./_components/vehicle-info-preview";
import useInsuranceStore from "@/store/insurance";
import {
  InsurancePolicyApiItem,
  PersonalInfoData,
  VehicleInfoData,
} from "@/types/insurance";
import { isValid } from "date-fns";
import { useFetchInsurancePolicyById } from "@/requests/services/insurance/policy";
import { toast } from "sonner";
import { useFetchInsuranceProducts } from "@/requests/services/insurance/products";

const INSURANCE_CATEGORY_IDS = ["private-motor", "commercial-motor"];

const mapPolicyToPurchaseForm = (
  policy: InsurancePolicyApiItem,
): {
  personalInfo: Partial<PersonalInfoData>;
  vehicleInfo: Partial<VehicleInfoData>;
} => {
  const policyholder = policy.insurance_policy_payload?.policyholder;
  const vehicle = policy.insurance_policy_payload?.vehicle;
  const snapshot = policy.insurance_policy_type_snapshot;

  return {
    personalInfo: {
      title: policyholder?.title ?? "",
      firstName: policyholder?.first_name ?? "",
      middleName: policyholder?.middle_name ?? "",
      lastName: policyholder?.last_name ?? "",
      email: policyholder?.email ?? "",
      phoneNumber: policyholder?.phone ?? "",
      dateOfBirth: policyholder?.birth_date
        ? new Date(policyholder.birth_date)
        : undefined,
      state: policyholder?.state ?? "",
      city: policyholder?.city ?? "",
      houseNumber: policyholder?.house_number ?? "",
      residentialAddress: policyholder?.street ?? "",
    },
    vehicleInfo: {
      vehicleType: snapshot?.vehicle_type ?? vehicle?.vehicle_type ?? "",
      make: vehicle?.vehicle_make ?? "",
      model: vehicle?.vehicle_model ?? "",
      start_date: policy.start_date ?? "",
      year: vehicle?.production_year ? String(vehicle.production_year) : "",
      plateNumber: vehicle?.license_number ?? "",
      chassisNumber: vehicle?.vin_number ?? "",
      engineNumber: vehicle?.engine_number ?? "",
      color: vehicle?.color ?? "",
      useType:
        snapshot?.kind === "private" || snapshot?.kind === "commercial"
          ? snapshot.kind
          : "",
    },
  };
};

export const InsurancePolicyPurchase = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const policyId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEditingDraft = !INSURANCE_CATEGORY_IDS.includes(policyId);
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showVehicleInfoModal, setShowVehicleInfoModal] = useState(false);
  const [hydratedDraftId, setHydratedDraftId] = useState<string | null>(null);

  const {
    personalInfo,
    vehicleInfo,
    setPersonalInfo,
    setVehicleInfo,
    clearPersonalInfo,
    clearVehicleInfo,
    resetPurchaseFlow,
  } = useInsuranceStore();

  useFetchInsuranceProducts();

  const { mutate: fetchDraftPolicy, isPending: isFetchingDraftPolicy } =
    useFetchInsurancePolicyById({
      onSuccess: (response) => {
        const policy = response.data as InsurancePolicyApiItem | undefined;

        if (!policy) {
          toast.error("Unable to load draft policy details.");
          router.push("/insurance/policy");
          return;
        }

        if (policy.status !== "draft") {
          toast.error("Only draft policies can be edited.");
          router.push(`/insurance/policy/${policy.id}`);
          return;
        }

        const mappedPolicy = mapPolicyToPurchaseForm(policy);
        resetPurchaseFlow();
        setPersonalInfo(mappedPolicy.personalInfo);
        setVehicleInfo(mappedPolicy.vehicleInfo);
        setHydratedDraftId(String(policy.id));
      },
      onError: () => {
        toast.error("Unable to load draft policy details.");
        router.push("/insurance/policy");
      },
    });

  useEffect(() => {
    if (!isEditingDraft || !policyId || hydratedDraftId === policyId) {
      return;
    }

    fetchDraftPolicy({ policyId });
  }, [fetchDraftPolicy, hydratedDraftId, isEditingDraft, policyId]);

  const normalizedDateOfBirth =
    personalInfo.dateOfBirth instanceof Date
      ? personalInfo.dateOfBirth
      : typeof personalInfo.dateOfBirth === "string"
        ? new Date(personalInfo.dateOfBirth)
        : undefined;

  const hasPersonalInfo =
    !!personalInfo.title &&
    !!personalInfo.firstName &&
    !!personalInfo.lastName &&
    !!personalInfo.email &&
    !!personalInfo.phoneNumber &&
    !!normalizedDateOfBirth &&
    !!personalInfo.state &&
    !!personalInfo.city &&
    !!personalInfo.houseNumber &&
    !!personalInfo.residentialAddress &&
    isValid(normalizedDateOfBirth);

  const hasVehicleInfo =
    !!vehicleInfo.vehicleType &&
    !!vehicleInfo.make &&
    !!vehicleInfo.model &&
    !!vehicleInfo.start_date &&
    !!vehicleInfo.plateNumber;

  const handleContinue = () => {
    router.push(`/insurance/${policyId}/quote`);
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-p2 text-txt-primary font-semibold mb-1">
              {isEditingDraft
                ? "Edit draft motor insurance"
                : "Purchase motor insurance"}
            </p>
            <p className="text-p4 text-txt-secondary">
              Complete the information below to get a quote
            </p>
          </div>

          <Button
            onClick={() => {
              resetPurchaseFlow();
              router.back();
            }}
            variant={"ghost"}
            size={"sm"}
          >
            <X /> Cancel
          </Button>
        </div>

        {isFetchingDraftPolicy ? (
          <div className="flex h-48 items-center justify-center gap-2 text-txt-secondary">
            <LoaderCircle className="size-4 animate-spin" />
            Loading draft policy...
          </div>
        ) : (
          <div className="lg:max-w-4xl max-w-full space-y-5">
            <div className="divide-y divide-[#EEEFF1]/80">
              <div className="py-5">
                {hasPersonalInfo ? (
                  <PersonalInfoPreview
                    data={personalInfo as PersonalInfoData}
                    onEdit={() => setShowPersonalInfoModal(true)}
                    onClear={() => {
                      clearPersonalInfo();
                    }}
                  />
                ) : (
                  <Button
                    variant={"ghost"}
                    size={"m"}
                    className="font-bold"
                    onClick={() => setShowPersonalInfoModal(true)}
                  >
                    <Plus className="mr-2" />
                    <span>Add personal information</span>
                  </Button>
                )}
              </div>

              <div className="py-5">
                {hasVehicleInfo ? (
                  <VehicleInfoPreview
                    data={vehicleInfo as VehicleInfoData}
                    onEdit={() => setShowVehicleInfoModal(true)}
                    onClear={() => clearVehicleInfo()}
                  />
                ) : (
                  <Button
                    variant={"ghost"}
                    size={"m"}
                    className="font-bold"
                    onClick={() => setShowVehicleInfoModal(true)}
                    disabled={!hasPersonalInfo}
                  >
                    <Plus className="mr-2" />
                    <span>Add vehicle information</span>
                  </Button>
                )}
              </div>
            </div>

            <Button
              variant={"neutral"}
              size={"m"}
              className="font-bold w-full"
              disabled={!hasPersonalInfo || !hasVehicleInfo}
              onClick={() => handleContinue()}
            >
              <span>Continue</span>
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        )}
      </div>

      <AddPersonalInformationModal
        show={showPersonalInfoModal}
        close={() => setShowPersonalInfoModal(false)}
        initData={
          hasPersonalInfo
            ? ({
                ...personalInfo,
                dateOfBirth: normalizedDateOfBirth,
              } as PersonalInfoData)
            : null
        }
        handleContinue={(data) => {
          setPersonalInfo(data);
          setShowPersonalInfoModal(false);
        }}
        requireProofOfIdentity={!isEditingDraft}
      />
      <AddVehicleInformationModal
        show={showVehicleInfoModal}
        close={() => setShowVehicleInfoModal(false)}
        initData={hasVehicleInfo ? vehicleInfo : null}
        handleContinue={(data) => {
          setVehicleInfo(data);
          setShowVehicleInfoModal(false);
        }}
        requireProofOfOwnership={!isEditingDraft}
      />
    </>
  );
};
