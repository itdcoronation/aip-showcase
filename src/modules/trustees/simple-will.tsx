"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Beneficiaries } from "./_components/beneficiaries";
import { SimpleWillAssets } from "./_components/simple-will-assets";
import { AddBeneficiaryFormData } from "./_components/add-beneficiary-form";
import { Dispatch, SetStateAction, useState } from "react";
import { SimpleWillAssetFormData } from "./_components/simple-will-asset-form";
import { AssetDistribution } from "./_components/asset-distribution";
import { AssetDistributionFormData } from "./_components/asset-distribution-form";
import { PaymentMethod } from "@/components/payment-method";
import { NoticeModal } from "@/components/modals/notice-modal";
import { CopySimpleIcon } from "@/assets/vectors/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

const SimpleWillUI = () => {
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);

  const router = useRouter();
  const [beneficiaries, setBeneficiaries] = useState<AddBeneficiaryFormData[]>(
    []
  );
  const [assets, setAssets] = useState<SimpleWillAssetFormData[]>([]);
  const [distribution, setDistribution] = useState<AssetDistributionFormData[]>(
    []
  );
  return (
    <>
      <NoticeModal
        show={show}
        close={() => setShow(false)}
        title="Request received"
        description="Dear Customer, your purchase has been successfully submitted, and your Will Document will be delivered to your registered email address shortly."
        action={{
          text: (
            <>
              Go to portfolio <ChevronRight />{" "}
            </>
          ),
          action: console.log,
        }}
      />

      <Button onClick={router.back} variant={"ghost"} size={"sm"}>
        <XIcon /> Cancel
      </Button>

      <section className="mx-auto max-w-[940px] mt-8">
        <div className="mb-4">
          <h2 className="text-h4 sm:text-h3 font-semibold text-txt-primary mb-1">
            {step === 1 ? "Purchase Simple Will" : "Select payment method"}
          </h2>
          <p className="text-p4 sm:text-p3 text-txt-tertiary">
            {step === 1
              ? "Complete the information below to subscribe to this service"
              : "Choose either bank account or debit card to pay for this transaction"}
          </p>
        </div>
        {step === 1 ? (
          <Step1
            handleContinue={() => setStep(2)}
            beneficiaries={beneficiaries}
            setBeneficiaries={setBeneficiaries}
            assets={assets}
            setAssets={setAssets}
            distribution={distribution}
            setDistribution={setDistribution}
          />
        ) : (
          <Step2Form handleContinue={() => setShow(true)} />
        )}
      </section>
    </>
  );
};

interface Step1Props {
  handleContinue: () => void;
  assets: SimpleWillAssetFormData[];
  setAssets: Dispatch<SetStateAction<SimpleWillAssetFormData[]>>;
  beneficiaries: AddBeneficiaryFormData[];
  setBeneficiaries: Dispatch<SetStateAction<AddBeneficiaryFormData[]>>;
  distribution: AssetDistributionFormData[];
  setDistribution: Dispatch<SetStateAction<AssetDistributionFormData[]>>;
}

const Step1 = ({
  handleContinue,
  beneficiaries,
  setAssets,
  setBeneficiaries,
  setDistribution,
  assets,
  distribution,
}: Step1Props) => {
  const assetOptions = assets.map((asset) => {
    let label = "Unknown Asset";
    if (asset.asset_type === "bank_account") {
      label = `Bank Account: ${asset.asset_data.account_number}`;
    } else if (asset.asset_type === "rsa") {
      label = `RSA: ${asset.asset_data.rsa_number}`;
    } else if (asset.asset_type === "nfa") {
      label = `Non-Financial Asset: ${asset.asset_data.asset_name}`;
    }
    return {
      value: label,
      label: label,
    };
  });

  const beneficiaryOptions = beneficiaries.map((beneficiary) => ({
    value: beneficiary.first_name + " " + beneficiary.last_name,
    label: beneficiary.first_name + " " + beneficiary.last_name,
  }));
  return (
    <>
      <section>
        <Beneficiaries
          beneficiaries={beneficiaries}
          setBeneficiaries={setBeneficiaries}
        />
        <SimpleWillAssets
          assets={assets}
          setAssets={setAssets}
          disabled={beneficiaries.length === 0}
        />
        <AssetDistribution
          assetOptions={assetOptions}
          beneficiaryOptions={beneficiaryOptions}
          distribution={distribution}
          setDistribution={setDistribution}
        />
        <Button
          disabled={
            beneficiaries.length === 0 ||
            assets.length === 0 ||
            distribution.length === 0
          }
          onClick={handleContinue}
          className="mt-12 w-full"
        >
          Continue <ChevronRight />{" "}
        </Button>
      </section>
    </>
  );
};

const Step2Form = ({ handleContinue }: { handleContinue: () => void }) => {
  const [method, setMethod] = useState<string | undefined>();
  const [card, setCard] = useState<string | undefined>();
  const { copy } = useCopyToClipboard();
  return (
    <>
      <section className="grid gap-8 mt-8">
        <div>
          <p className="text-xs mb-2 text-black">Amount to pay</p>
          <div className="flex items-center gap-4">
            <p className="text-h2 text-txt-primary font-semibold">
              ₦ 110,736.98
            </p>
            <CopySimpleIcon onClick={() => copy("110736.98")} />
          </div>
        </div>
        <PaymentMethod
          method={method ?? ""}
          onSelectMethod={setMethod}
          card={card ?? ""}
          onSelectCard={setCard}
        />
        <Declaration />
        <div>
          <Button
            disabled={!method || (method === "card" && !card)}
            onClick={handleContinue}
            className="w-full mb-2"
          >
            Purchase <ChevronRight />
          </Button>
        </div>
      </section>
    </>
  );
};

const Declaration = () => {
  return (
    <div className="bg-bg-secondary px-3 py-5 rounded-md border border-[#EEEFF1] shadow-sm">
      <div className="flex gap-2 items-center mb-3">
        <Checkbox className="bg-white" />
        <p className="text-p2 font-semibold text-txt-primary">
          Declaration and Consent
        </p>
      </div>
      <ol className="text-txt-secondary pl-5 list-decimal leading-[20px] mb-2">
        <li className="mb-1">
          In the event of the death of any of my Beneficiaries, and such a
          deceased Beneficiary is survived by offspring of biological descent,
          all bequests and gifts accruing to such deceased Beneficiary shall
          devolve to his or her surviving descendants, and If there are no
          surviving descendants, or If the beneficiary is a corporate
          organization that has been dissolved or is otherwise no longer
          operational and unable to accept the bequests or gifts, its share
          shall be distributed equally among my surviving Beneficiaries.
        </li>
        <li className="mb-1">
          I confirm that the information provided in this form is correct and
          can be used by Coronation (Group, Affiliate and Sub-Companies) to
          contact me.
        </li>
        <li>
          I confirm that I have read and agreed to the Privacy Policy of
          Coronation (Group, Affiliate and Sub-Companies)
        </li>
      </ol>
      <p className="text-txt-primary">
        By checking the “Declaration and Consent” box, I consent to all the
        above.
      </p>
    </div>
  );
};

export { SimpleWillUI };
