import { checkImg, infoImg, xImg } from "@/assets/images";
import { Modal, ModalProps } from "../modal";
import Image from "next/image";
import { Button } from "../ui/button";
import { ReactNode } from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoticeModalProps extends ModalProps {
  title: string;
  description: string;
  action?: {
    text: string | ReactNode;
    action: () => void;
    className?: string;
  };
  secondaryAction?: {
    text: string | ReactNode;
    action: () => void;
  };
  type?: "success" | "failure" | "info";
}
const NoticeModal: React.FC<NoticeModalProps> = ({
  title,
  description,
  action,
  type = "success",
  secondaryAction,
  ...props
}) => {
  return (
    <Modal
      {...props}
      dialogClassName="bg-[#3F2D491F]"
      contentClassName="bg-white w-full max-w-[480px] rounded-[12px] px-4 md:px-8 py-8 text-center flex flex-col items-center justify-center gap-10"
    >
      <XIcon role="button" className="ml-auto min-h-[24px]" onClick={props.close} />
      <Image
        className="w-[70%] max-w-[229px]"
        width={229}
        height={232}
        src={type === "info" ? infoImg : type === "failure" ? xImg : checkImg}
        alt="check mark"
      />
      <div>
        <h1 className="text-p1 sm:text-h3 font-semibold text-txt-primary mb-2">{title}</h1>
        <p className="text-p4 sm:text-p3 text-txt-secondary">{description}</p>
      </div>
      <div className="grid gap-2 w-full">
        {action ? (
          <Button className={cn("w-full", action.className || "")} onClick={action.action}>
            {action.text}
          </Button>
        ) : null}
        {secondaryAction ? (
          <Button
            variant={"ghost"}
            className="w-full"
            onClick={secondaryAction.action}
          >
            {secondaryAction.text}
          </Button>
        ) : null}
      </div>
    </Modal>
  );
};

export { NoticeModal };
