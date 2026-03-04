"use client";
import { useState, useMemo } from "react";
import { RecurringPaymentsTable } from "@/components/tables/recurring-payments-table";
import { getRecurringPaymentTableColumns } from "@/components/tables/recurring-payments-table/columns";
import { RecurringPaymentTableData } from "@/types/recurring-payment";
import { useFetchRecurringPayments } from "@/requests/services/payments/fetch-recurring";
import { useCancelRecurringPayment } from "@/requests/services/payments/cancel-recurring";
import PageLoader from "@/components/page-loader";
import { NoticeModal } from "@/components/modals/notice-modal";
import { Modal } from "@/components/modal";
import { LoaderCircle } from "lucide-react";

const RecurringPaymentsUI = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [selectedPaymentRef, setSelectedPaymentRef] = useState("");

  // Fetch recurring payments
  const { data, isLoading, refetch } = useFetchRecurringPayments();

  // Cancel mutation
  const { mutate: cancelPayment } = useCancelRecurringPayment({
    onSuccess: () => {
      setShowLoadingModal(false);
      setShowSuccessModal(true);
      refetch(); // Refresh the list after cancellation
    },
    onError: (error) => {
      console.error("=== CANCEL ERROR IN COMPONENT ===");
      console.error("Failed to cancel recurring payment:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("=== END CANCEL ERROR ===");
      setShowLoadingModal(false);
      setShowErrorModal(true);
    },
  });

  // Transform API data to table format
  const tableData = useMemo((): RecurringPaymentTableData[] => {
    if (!data?.data?.data) return [];

    return data.data.data.map((payment) => ({
      transaction_ref: payment.transaction_ref,
      product: payment.product,
      amount: payment.amount,
      currency: payment.currency,
      frequency: payment.frequency,
      status: payment.status,
    }));
  }, [data]);

  // Handle cancel button click - shows confirmation modal
  const handleCancel = (transactionRef: string) => {
    console.log("Requesting confirmation to cancel payment:", transactionRef);
    setSelectedPaymentRef(transactionRef);
    setShowConfirmModal(true);
  };

  // Handle confirmed cancellation - triggers API call
  const handleConfirmCancel = () => {
    console.log("Canceling payment with transaction_ref:", selectedPaymentRef);
    setShowConfirmModal(false);
    setShowLoadingModal(true);
    cancelPayment({
      transaction_ref: selectedPaymentRef,
      reason: "User requested cancellation",
    });
  };

  // Get columns
  const columns = getRecurringPaymentTableColumns({
    handleCancel,
  });

  // Loading state
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      {/* Confirmation Modal */}
      <NoticeModal
        show={showConfirmModal}
        close={() => setShowConfirmModal(false)}
        type="info"
        title="Cancel Recurring Payment?"
        description="Are you sure you want to cancel this recurring payment? This action cannot be undone."
        action={{
          text: "Yes, Cancel Payment",
          action: handleConfirmCancel,
        }}
        secondaryAction={{
          text: "No, Keep Payment",
          action: () => setShowConfirmModal(false),
        }}
      />

      {/* Loading Modal */}
      <Modal
        show={showLoadingModal}
        close={() => {}} // Prevent closing during loading
        dialogClassName="bg-[#3F2D491F]"
        contentClassName="bg-white w-full max-w-[480px] rounded-[12px] px-4 md:px-8 py-8 text-center flex flex-col items-center justify-center gap-6"
      >
        <LoaderCircle className="animate-spin size-16 text-bg-brand" />
        <div>
          <h2 className="text-lg font-semibold mb-2">Canceling Payment</h2>
          <p className="text-txt-secondary">
            Please wait while we process your cancellation request...
          </p>
        </div>
      </Modal>

      {/* Success Modal */}
      <NoticeModal
        show={showSuccessModal}
        close={() => setShowSuccessModal(false)}
        type="success"
        title="Payment Canceled"
        description="Your recurring payment has been successfully canceled."
      />

      {/* Error Modal */}
      <NoticeModal
        show={showErrorModal}
        close={() => setShowErrorModal(false)}
        type="failure"
        title="Cancellation Failed"
        description="We couldn't cancel your recurring payment at this time. Please try again later."
      />

      {/* Recurring Payments Section */}
      <section className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-txt-primary">
              Scheduled Recurring Payments
            </h2>
            <p className="text-sm text-txt-tertiary mt-1">
              Manage your automated recurring investments
            </p>
          </div>
          {data?.data?.count && (
            <p className="text-sm text-txt-tertiary">
              {data.data.count} {data.data.count === 1 ? "payment" : "payments"}
            </p>
          )}
        </div>

        {/* Table */}
        <div className="border border-stroke-primary rounded-lg overflow-hidden bg-white">
          <RecurringPaymentsTable columns={columns} data={tableData} />
        </div>
      </section>
    </>
  );
};

export { RecurringPaymentsUI };
