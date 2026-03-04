"use client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2Icon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { PencilIcon } from "@/assets/vectors/icons";
import {
  AssetDistributionForm,
  AssetDistributionFormData,
} from "./asset-distribution-form";
import { optionType } from "@/types/util";

interface AssetDistributionProps {
  distribution: AssetDistributionFormData[];
  setDistribution: Dispatch<SetStateAction<AssetDistributionFormData[]>>;
  assetOptions: optionType[];
  beneficiaryOptions: optionType[];
}

export const AssetDistribution = ({
  assetOptions,
  beneficiaryOptions,
  distribution,
  setDistribution,
}: AssetDistributionProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<number | undefined>();

  const handleAddBeneficiary = (data: AssetDistributionFormData) => {
    if (selected !== undefined) {
      distribution[selected] = data;
      setDistribution([...distribution]);
      setSelected(undefined);
    } else {
      setDistribution((prev) => [...prev, data]);
    }
  };

  const handleRemove = (index: number) => {
    setDistribution((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <AssetDistributionForm
        initData={
          selected !== undefined && selected >= 0
            ? distribution[selected]
            : undefined
        }
        show={showModal}
        close={() => {
          setShowModal(false);
          setSelected(undefined);
        }}
        submit={handleAddBeneficiary}
        assetOptions={assetOptions}
        beneficiaryOptions={beneficiaryOptions}
      />
      <div className="border-b border-[#EEEFF1] py-6">
        {distribution.length > 0 ? (
          <div className="grid gap-2 sm:gap-4 mb-6">
            {distribution.map((item, index) => {
              return (
                <div
                  key={`beneficiary_${index}`}
                  className="flex items-center gap-4 bg-white border border-[#EEEFF1] rounded-[12px] p-3 sm:px-4 sm:py-6 shadow-sm"
                >
                  <div>
                    <p className="text-txt-tertiary text-xs mb-1.5">
                      {item.asset}
                    </p>
                    <div className="flex gap-4 items-center">
                      <p className="hidden sm:block text-primary font-medium">
                        Beneficiaries:
                      </p>
                      <div className="flex flex-wrap gap-3 items-center">
                        <p className="sm:hidden text-primary font-medium">
                          Beneficiaries:
                        </p>
                        {item.beneficiaries.map((b) => (
                          <span
                            key={`beneficiary-${b.beneficiary}-${b.beneficiary_share}`}
                            className="bg-[#59CBE8] text-xs font-medium text-white rounded-[6px] px-2 py-0.5"
                          >
                            {b.beneficiary} - {b.beneficiary_share}%
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto mb-auto sm:mb-0">
                    <Button
                      onClick={() => {
                        setSelected(index);
                        setShowModal(true);
                      }}
                      className="w-6 h-6"
                      variant={"outline"}
                      size={"icon"}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      onClick={() => handleRemove(index)}
                      className="w-6 h-6"
                      variant={"brand"}
                      size={"icon"}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
        <Button
          disabled={distribution.length === 0 && assetOptions.length === 0}
          onClick={() => setShowModal(true)}
          variant={"secondary"}
          size={"sm"}
        >
          <Plus />
          Asset distribution
        </Button>
      </div>
    </>
  );
};
