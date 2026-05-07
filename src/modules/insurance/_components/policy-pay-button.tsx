import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { NoticeModal } from "@/components/modals/notice-modal";
import PageLoader from "@/components/page-loader";
import { verifyPolicyPaymentService } from "@/requests/services/insurance/policy";
import { isShowcaseMode } from "@/lib/showcase";

interface PolicyPayButtonProps {
  email?: string;
  amountInNaira?: number;
  paymentMode?: "pay_now" | "pay_later";
  policyID?: string | number;
  onProceedToPayNow?: () => void;
  disabled?: boolean;
  autoStart?: boolean;
  autoStartKey?: string | number;
  showButton?: boolean;
  successTitle?: string;
  successDescription?: string;
  successActionText?: string;
  onSuccessAction?: () => void;
  onModalClose?: () => void;
}

export const PolicyPayButton = ({
  email,
  amountInNaira,
  paymentMode,
  policyID,
  onProceedToPayNow,
  disabled,
  autoStart,
  autoStartKey,
  showButton = true,
  successTitle = "Payment successful",
  successDescription = "Your insurance policy has been successfully activated. You can now download your certificate or view policy details.",
  successActionText = "View my policy",
  onSuccessAction,
  onModalClose,
}: PolicyPayButtonProps) => {
  const amountInKobo = amountInNaira ? Math.round(amountInNaira * 100) : 0;
  const publicKey = isShowcaseMode
    ? "showcase-key"
    : (process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "");
  const canProceedToPayment = Boolean(
    email && amountInKobo > 0 && (isShowcaseMode || publicKey),
  );

  const [isVerifyingPayment, setIsVerifyingPayment] = React.useState(false);
  const [showSuccessNotice, setShowSuccessNotice] = React.useState(false);
  const lastAutoStartKeyRef = React.useRef<string | number | null>(null);

  const reference = policyID
    ? `policy-${policyID}-${Date.now()}`
    : Date.now().toString();

  const startPayment = React.useCallback(() => {
    if (!email) {
      toast.error("Please provide an email before proceeding to payment.");
      return;
    }

    if (!amountInKobo) {
      toast.error("Unable to determine payment amount.");
      return;
    }

    if (!policyID) {
      toast.error("Unable to proceed with payment. Missing policy ID.");
      return;
    }

    if (isShowcaseMode) {
      setIsVerifyingPayment(true);
      verifyPolicyPaymentService(reference, policyID)
        .then(() => {
          setIsVerifyingPayment(false);
          setShowSuccessNotice(true);
          toast.success(
            "Payment successful! Verifying and finalizing your policy...",
          );
        })
        .catch(() => {
          setIsVerifyingPayment(false);
          toast.error("Payment verification failed. Please contact support.");
        });
      return;
    }

    toast.error("Payment is not configured. Please contact support.");
  }, [amountInKobo, email, policyID, reference]);

  React.useEffect(() => {
    const shouldAutoStart = autoStart || paymentMode === "pay_now";

    if (!shouldAutoStart || !policyID || !canProceedToPayment) {
      return;
    }

    const key = autoStartKey ?? policyID;
    if (lastAutoStartKeyRef.current === key) {
      return;
    }

    lastAutoStartKeyRef.current = key;
    startPayment();
  }, [
    autoStart,
    autoStartKey,
    canProceedToPayment,
    paymentMode,
    policyID,
    startPayment,
  ]);

  const label = (() => {
    if (isVerifyingPayment) return "Verifying payment...";
    if (disabled) return "Preparing payment...";
    return "Proceed to payment";
  })();

  const closeSuccessModal = () => {
    setShowSuccessNotice(false);
    onModalClose?.();
  };

  return (
    <>
      {isVerifyingPayment && <PageLoader className="fixed inset-0 z-100" />}

      {showButton && (
        <Button
          onClick={() => {
            if (onProceedToPayNow) {
              if (!email) {
                toast.error(
                  "Please provide an email before proceeding to payment.",
                );
                return;
              }

              if (!amountInKobo) {
                toast.error("Unable to determine payment amount.");
                return;
              }

              onProceedToPayNow();
              return;
            }

            startPayment();
          }}
          variant={"neutral"}
          className="w-full"
          disabled={!canProceedToPayment || disabled || isVerifyingPayment}
        >
          {label}
        </Button>
      )}

      <NoticeModal
        show={showSuccessNotice}
        close={closeSuccessModal}
        title={successTitle}
        description={successDescription}
        type="success"
        action={{
          text: successActionText,
          action: () => {
            if (onSuccessAction) {
              onSuccessAction();
            } else {
              closeSuccessModal();
            }
          },
        }}
      />
    </>
  );
};
