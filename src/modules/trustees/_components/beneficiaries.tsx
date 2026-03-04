"use client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2Icon } from "lucide-react";
import {
  AddBeneficiaryForm,
  AddBeneficiaryFormData,
} from "./add-beneficiary-form";
import { Dispatch, SetStateAction, useState } from "react";
import { PencilIcon } from "@/assets/vectors/icons";

interface BeneficiariesProps {
  beneficiaries: AddBeneficiaryFormData[];
  setBeneficiaries: Dispatch<SetStateAction<AddBeneficiaryFormData[]>>;
}

export const Beneficiaries = ({
  beneficiaries,
  setBeneficiaries,
}: BeneficiariesProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<number | undefined>();

  const handleAddBeneficiary = (data: AddBeneficiaryFormData) => {
    if (selected !== undefined) {
      setBeneficiaries((prev) =>
        prev.map((item, index) => (index === selected ? data : item))
      );
      setSelected(undefined);
    } else {
      setBeneficiaries((prev) => [...prev, data]);
    }
  };

  const handleRemove = (index: number) => {
    setBeneficiaries((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <AddBeneficiaryForm
        initData={
          selected !== undefined && selected >= 0
            ? beneficiaries[selected]
            : undefined
        }
        show={showModal}
        close={() => {
          setShowModal(false);
          setSelected(undefined);
        }}
        submit={handleAddBeneficiary}
      />
      <div className="border-b border-[#EEEFF1] py-6">
        {beneficiaries.length > 0 ? (
          <div className="grid gap-2 sm:gap-4 mb-6">
            {beneficiaries.map((item, index) => (
              <div
                key={`beneficiary_${index}`}
                className="flex items-center gap-4 bg-white border border-[#EEEFF1] rounded-[12px] p-3 sm:px-4 sm:py-6 shadow-sm"
              >
                <div>
                  <p className="text-txt-tertiary text-xs mb-1">
                    {item.relationship}
                  </p>
                  <p className="text-primary font-medium">
                    {item.first_name} {item.last_name}, {item.other_names}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-auto">
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
            ))}
          </div>
        ) : null}
        <Button
          onClick={() => setShowModal(true)}
          variant={"secondary"}
          size={"sm"}
        >
          <Plus />
          Add beneficiaries
        </Button>
      </div>
    </>
  );
};
