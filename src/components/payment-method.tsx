// import { Plus } from "lucide-react";
import {
  PaymentMethodCard,
  PaymentMethodCardData,
} from "./cards/payment-method-card";
import { /* DebitCard, DebitCardData */ } from "./cards/debit-card-card";
// import { Label } from "./ui/label";
// import { Button } from "./ui/button";
import { AddCardModal } from "./modals/add-card";
import { useState } from "react";
import { CopySimpleIcon } from "@/assets/vectors/icons";
import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface PaymentMethodProps {
  method: string;
  onSelectMethod: (value: string) => void;
  card: string;
  onSelectCard: (value: string) => void;
  bankInfo?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    reference: string;
  };
  cards?: {
    expiry: string;
    number: string;
    type: "visa" | "mastercard";
  }[];
  methods?: PaymentMethodCardData[];
  hideCardSelection?: boolean;
}

const paymentMethods: PaymentMethodCardData[] = [
  {
    value: "bank",
    icon: "bank",
    title: "Pay with vNUBAN",
    description:
      "Make payment to details shown below to complete this transaction.",
  },
  {
    value: "card",
    icon: "card",
    title: "Pay with debit card",
    description:
      "Add a new card or select an existing one to complete this transaction",
  },
];

// const debitCards: DebitCardData[] = [
//   {
//     value: "2345",
//     type: "mastercard",
//     title: "Mastercard - xxxx 2345",
//     description: "Expiry 04/2026",
//   },
//   {
//     value: "2346",
//     type: "visa",
//     title: "Visa - xxxx 2346",
//     description: "Expiry 04/2026",
//   },
//   {
//     value: "2347",
//     type: "visa",
//     title: "Visa - xxxx 2347",
//     description: "Expiry 04/2026",
//   },
// ];

export const PaymentMethod = ({
  method,
  onSelectMethod,
  // card,
  // onSelectCard,
  methods = paymentMethods,
  bankInfo,
  hideCardSelection = false,
}: PaymentMethodProps) => {
  const [addCard, setAddCard] = useState(false);

  return (
    <>
      <AddCardModal
        show={addCard}
        close={() => setAddCard(false)}
        handleContinue={() => {
          setAddCard(false);
        }}
      />
      <section className="grid gap-8">
        <div
          className={cn(
            "grid gap-4",
            methods.length === 1 ? "" : "sm:grid-cols-2"
          )}
        >
          {methods.map((item) => (
            <PaymentMethodCard
              {...item}
              selected={method === item.value}
              onSelect={onSelectMethod}
              key={item.value}
            />
          ))}
        </div>
        {method === "bank" ? (
          <BankDetails bankInfo={bankInfo} />
        ) : method === "card" && !hideCardSelection ? (
          <div className="grid gap-4">
            {/* CARD SELECTION - COMMENTED OUT FOR CARD PAYMENT FLOW */}
            {/* <Label className="">Select card</Label>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {debitCards.map((item) => (
                <DebitCard
                  {...item}
                  key={item.value}
                  selected={card === item.value}
                  onSelect={onSelectCard}
                />
              ))}
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setAddCard(true);
              }}
              variant={"ghost"}
              size={"sm"}
              className="w-fit"
            >
              <Plus /> Add new card
            </Button> */}
          </div>
        ) : (
          ""
        )}
      </section>
    </>
  );
};

const BankDetails = ({
  bankInfo,
}: {
  bankInfo?: PaymentMethodProps["bankInfo"];
}) => {
  const { copy } = useCopyToClipboard();
  return (
    <div className="border-0.5 border border-[#EEEFF1] bg-white rounded-[12px] p-4">
      <p className="text-p2 font-semibold text-txt-primary mb-6">
        Bank details
      </p>
      <div className="text-txt-tertiary border-t border-stroke-primary py-5">
        <div className="flex justify-between items-start gap-4">
          <p className="flex-shrink-0 min-w-[100px]">Bank name</p>
          <div className="flex items-center gap-2 flex-1">
            {/* REPLACED: was hardcoded "11,020,084" - now using API response */}
            <p className="text-right flex-1">
              {bankInfo?.bankName || "Coronation Merchant Bank"}
            </p>
            {bankInfo?.bankName ? (
              <CopySimpleIcon
                onClick={() => copy(bankInfo?.bankName)}
                className="flex-shrink-0 w-4 h-4"
                viewBox="0 0 24 24"
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary py-5">
        <div className="flex justify-between items-start gap-4">
          <p className="flex-shrink-0 min-w-[100px]">Account name</p>
          <div className="flex items-center gap-2 flex-1">
            {/* REPLACED: was hardcoded "11,020,084" - now using API response */}
            <p className="text-right flex-1 break-words">
              {bankInfo?.accountName || "Mercy Nweke"}
            </p>
            {bankInfo?.accountName ? (
              <CopySimpleIcon
                onClick={() => copy(bankInfo?.accountName)}
                className="flex-shrink-0 w-4 h-4"
                viewBox="0 0 24 24"
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="text-txt-tertiary border-t border-stroke-primary py-5">
        <div className="flex justify-between items-start gap-4">
          <p className="flex-shrink-0 min-w-[100px]">Account number</p>
          <div className="flex items-center gap-2 flex-1">
            {/* REPLACED: was hardcoded "11,020,084" - now using API response */}
            <p className="text-right flex-1">
              {bankInfo?.accountNumber || "7110359449"}
            </p>
            {bankInfo?.accountNumber ? (
              <CopySimpleIcon
                onClick={() => copy(bankInfo?.accountNumber)}
                className="flex-shrink-0 w-4 h-4"
                viewBox="0 0 24 24"
              />
            ) : null}
          </div>
        </div>
      </div>
      {/* REFERENCE SECTION - COMMENTED OUT (can be enabled if needed) */}
      {/* <div className="text-txt-tertiary border-t border-stroke-primary py-5">
        <div className="flex justify-between items-start gap-4">
          <p className="flex-shrink-0 min-w-[100px]">Reference</p>
          <div className="flex items-center gap-2 flex-1">
            <p className="text-right flex-1">{bankInfo?.reference || "N/A"}</p>
            <CopySimpleIcon className="flex-shrink-0 w-4 h-4" viewBox="0 0 24 24" />
          </div>
        </div>
      </div> */}
    </div>
  );
};
