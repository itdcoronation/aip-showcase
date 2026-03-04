"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { AddBeneficiaryFormData } from "./_components/add-beneficiary-form";
import { NoticeModal } from "@/components/modals/notice-modal";
import { CopySimpleIcon } from "@/assets/vectors/icons";
import { PaymentMethod } from "@/components/payment-method";
import { Checkbox } from "@/components/ui/checkbox";
import { Beneficiaries } from "./_components/beneficiaries";
import { PrivateTrustAssets } from "./_components/private-trust-assets";
import { PrivateTrustAssetFormData } from "./_components/private-trust-asset-form";
import { AssetDistributionFormData } from "./_components/asset-distribution-form";
import { AssetDistribution } from "./_components/asset-distribution";
import {
  illiquidSubTypeOptions,
  liquidSubTypeOptions,
  privateTrustAssetTypeOptions,
} from "@/lib/constants";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

const PrivateTrustUI = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<AddBeneficiaryFormData[]>(
    []
  );
  const [assets, setAssets] = useState<PrivateTrustAssetFormData[]>([]);
  const [distribution, setDistribution] = useState<AssetDistributionFormData[]>(
    []
  );
  return (
    <>
      <NoticeModal
        show={show}
        close={() => setShow(false)}
        title="Successful"
        description="Your form has been successfully submitted. A correspondent will reach out to you soon."
        action={{
          text: (
            <>
              Go to portfolio <ChevronRight />
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
            {step === 1 ? "Purchase Private Trust" : "Select payment method"}
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
  assets: PrivateTrustAssetFormData[];
  setAssets: Dispatch<SetStateAction<PrivateTrustAssetFormData[]>>;
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
    const mainAsset = privateTrustAssetTypeOptions.find(
      (option) => option.value === asset.asset_type
    );
    const liquidSub = liquidSubTypeOptions.find(
      (option) => option.value === asset.sub_type
    );
    const illiquidSub = illiquidSubTypeOptions.find(
      (option) => option.value === asset.sub_type
    );

    const asset_type =
      mainAsset?.value === "liquid"
        ? liquidSub?.label
        : mainAsset?.value === "illiquid"
        ? illiquidSub?.label
        : mainAsset?.label;

    const label =
      "currency" in asset
        ? asset?.currency
        : "instrument_type" in asset
        ? asset?.instrument_type
        : "state" in asset
        ? asset?.state
        : "company_name" in asset
        ? asset?.company_name
        : "name_of_asset" in asset
        ? asset?.name_of_asset
        : "intangible_asset_type" in asset
        ? asset?.intangible_asset_type
        : "";

    const value =
      "volume" in asset
        ? asset?.volume
        : "instrument_name" in asset
        ? asset?.instrument_name
        : "registration_number" in asset
        ? asset?.registration_number
        : "unit_of_shares" in asset
        ? asset?.unit_of_shares
        : "description_of_asset" in asset
        ? asset?.description_of_asset
        : "";
    return {
      value: `${asset_type} - ${label} - ${value}`,
      label: `${asset_type} - ${label} - ${value}`,
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
        <PrivateTrustAssets
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
          I confirm that the information provided in this form is correct and
          can be used by Coronation (Group, Affiliate and Sub-Companies) to
          contact me.
        </li>
        <li className="mb-1">
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

export { PrivateTrustUI };
