"use client";
import { Button } from "@/components/ui/button";
import { AddSignatoryForm } from "./_components/signatories";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { PencilIcon } from "@/assets/vectors/icons";

interface SignatoriesData {
  bvn: string;
  full_name: string;
  email: string;
  id: string;
}

const signatories: SignatoriesData[] = [
  {
    bvn: "12345678901",
    full_name: "Jane Doe",
    email: "jane.doe@example.com",
    id: "1",
  },
  {
    bvn: "10987654321",
    full_name: "John Smith",
    email: "john.smith@example.com",
    id: "2",
  },
];

const SignatoriesUI: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AddSignatoryForm
        submit={() => setShowModal(false)}
        show={showModal}
        close={() => {
          setShowModal(false);
        }}
      />
      <section className="max-w-md grid gap-4">
        {signatories.map(({ bvn, full_name, email }, index) => (
          <div
            key={`bank-info-${index}`}
            className="relative space-y-3 border border-dashed border-stroke-primary p-4 rounded-[8px] bg-bg-secondary"
          >
            <div className="flex items-center gap-2 absolute right-4 top-2">
              <Button
                variant={"outline"}
                size={"icon"}
                className="h-[28px] w-[28px]"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <PencilIcon fill="#141415" />
              </Button>

              <Button
                // variant={"brand"}
                size={"icon"}
                className="h-[28px] w-[28px] bg-white"
                onClick={() => console.log(index)}
              >
                <Trash2Icon color="#141415" />
              </Button>
            </div>

            <div className="space-y-1">
              <p className="text-txt-secondary text-l3">BVN</p>
              <p className="text-txt-primary text-p3">{bvn}</p>
            </div>
            <div className="space-y-1">
              <p className="text-txt-secondary text-l3">Full Name</p>
              <p className="text-txt-primary text-p3">{full_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-txt-secondary text-l3">Email</p>
              <p className="text-txt-primary text-p3">{email}</p>
            </div>
          </div>
        ))}
        <Button
          variant={"ghost"}
          className="h-[32px] w-fit"
          onClick={() => setShowModal(true)}
        >
          <PlusIcon />
          Add a new signatory
        </Button>
        {/* <SignatoriesForm submit={handleSubmit} /> */}
      </section>
    </>
  );
};

export { SignatoriesUI };
