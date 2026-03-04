import { cn } from "@/lib/utils";

export interface ModalProps {
  close: () => void;
  show: boolean;
}

interface ModalUIProps extends ModalProps {
  children: any;
  position?: "centered" | "left" | "right";
  dialogClassName?: string;
  contentClassName?: string;
  testId?: string;
}

const Modal: React.FC<ModalUIProps> = ({
  children,
  position = "centered",
  close,
  show,
  dialogClassName,
  contentClassName,
  testId,
}) => {
  if (!show) return null;

  return (
    <>
      <aside
        onClick={close}
        role="dialog"
        className={cn(
          "w-full h-full fixed bg-[#2B2C31]/16 z-[1500] p-4 top-0 left-0 flex",
          dialogClassName
        )}
        data-testid={testId}
      >
        <section
          onClick={(e) => e.stopPropagation()}
          className={cn(
            `bg-white p-4 rounded-lg w-full max-w-[450px] max-h-[90dvh] overflow-auto`,
            `${
              position === "right" ? "" : position === "left" ? "" : "m-auto"
            }`,
            contentClassName
          )}
        >
          {children}
        </section>
      </aside>
    </>
  );
};

export { Modal };
