import { Modal } from "@/components/modal";
import { checkImg } from "@/assets/images"
import { Button } from "@/components/ui/button";
import { XIcon, ChevronRight } from "lucide-react";
import { NoticeModal } from "@/components/modals/notice-modal";
import Image from "next/image";

// Modal 1: Shows transfer details
export const TransferDetailsModal = ({
  show,
  close,
  amount,
  accountNumber,
  bankName,
  onConfirm,
}: {
  show: boolean;
  close: () => void;
  amount: string;
  accountNumber: string;
  bankName: string;
  onConfirm: () => void;
}) => {
  if (!show) return null;

  return (
    <Modal
      show={show}
      close={close}
      dialogClassName="bg-[#3F2D491F]"
      contentClassName="bg-white w-full max-w-[480px] rounded-[12px] px-4 md:px-8 py-8 text-center flex flex-col items-center justify-center gap-6"
    >
      <XIcon role="button" className="ml-auto" onClick={close} />
      <h2 className="text-lg font-semibold mb-2">NIP Transfer Details</h2>
      <p>Please transfer the exact amount to the account number below.</p>
      <div className="text-center my-4">
        <p className="text-lg font-semibold">Amount: {amount}</p>
        <p className="text-lg font-semibold">Bank Name: {bankName}</p>
        <p className="text-lg font-semibold">Account Number: {accountNumber}</p>
      </div>
      <Button className="w-full max-w-[336px]" onClick={onConfirm}>
        I have made the transfer <ChevronRight />
      </Button>
    </Modal>
  );
};

// Modal 2: Shows countdown and polling status
export const PollingConfirmationModal = ({
  show,
  close,
  countdown,
  message,
}: {
  show: boolean;
  close: () => void;
  countdown: string;
  message: string;
}) => {
  if (!show) return null;

  return (
    <Modal
      show={show}
      close={close}
      dialogClassName="bg-[#3F2D491F]"
      contentClassName="bg-white w-full max-w-[480px] rounded-[12px] px-4 md:px-8 py-8 text-center flex flex-col items-center justify-center gap-6"
    >
      <XIcon role="button" className="ml-auto" onClick={close} />
      <h2 className="text-lg font-semibold mb-2">Confirming Your Transfer</h2>
      <p>Please wait while we confirm your transfer. This might take a few minutes.</p>
      <div className="text-4xl font-bold my-4">{countdown}</div>
      <p className="text-txt-secondary">{message}</p>
    </Modal>
  );
};

// Success Modal
export const SuccessModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  if (!show) return null;

  return (
    <Modal
      show={show}
      close={onClose}
      dialogClassName="bg-[#3F2D491F]"
      contentClassName="bg-white w-full max-w-[480px] rounded-[12px] px-4 md:px-8 py-8 text-center flex flex-col items-center justify-center gap-6"
    >
      <XIcon role="button" className="ml-auto" onClick={onClose} />

      {/* ✅ SUCCESS IMAGE (same as NoticeModal type=success) */}
      <Image
        className="w-[70%] max-w-[229px]"
        width={229}
        height={232}
        src={checkImg}
        alt="Success"
      />

      <h2 className="text-lg font-semibold mb-2">Success</h2>
      <p>Your investment has been confirmed successfully!</p>

      <Button className="w-full max-w-[336px]" onClick={onClose}>
        Go to Mutual Funds <ChevronRight />
      </Button>
    </Modal>
  );
};


interface InfoModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  actionText?: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  show,
  onClose,
  title = "Information",
  message,
  actionText = "Go to Mutual Funds",
}) => {
  return (
    <NoticeModal
      show={show}
      close={onClose}
      title={title}
      description={message}
      type="info"
      action={{
        text: actionText,
        action: onClose,
      }}
    />
  );
};
