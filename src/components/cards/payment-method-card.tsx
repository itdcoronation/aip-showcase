import { BankFilledIcon, CheckCircleIcon } from "@/assets/vectors/icons";
import { cn } from "@/lib/utils";

export interface PaymentMethodCardData {
  value: string;
  title: string;
  description: string;
  icon: string // "bank" | "card";
}

interface PaymentMethodCardProps extends PaymentMethodCardData {
  onSelect: (value: string) => void;
  value: string;
  selected: boolean;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  onSelect,
  selected,
  value,
  title,
  description,
}) => {
  return (
    <div
      role="button"
      onClick={() => onSelect(value)}
      className={cn(
        "flex gap-2 items-center border border-stroke-primary shadow-sm rounded-[10px] px-3 py-3 bg-white",
        selected ? "border-stroke-brand" : ""
      )}
    >
      <div className="bg-bg-secondary rounded-full flex items-center justify-center min-w-[40px] h-[40px]">
        <BankFilledIcon size={20} />
      </div>
      <div>
        <p className="font-medium text-txt-primary text-p3 sm:text-p2">{title}</p>
        <p className="text-p4 sm:text-p3 text-txt-secondary">{description}</p>
      </div>
      <span className="mb-auto ml-auto">
        {selected ? (
          <CheckCircleIcon />
        ) : (
          <div className="w-[18px] h-[18px] border border-2 border-bg-secondary rounded-full"></div>
        )}
      </span>
    </div>
  );
};

export { PaymentMethodCard };
