import { BankFilledIcon, CheckCircleIcon } from "@/assets/vectors/icons";
import { cn } from "@/lib/utils";

export interface DebitCardData {
  value: string;
  title: string;
  description: string;
  type: "visa" | "mastercard";
}

interface DebitCardProps extends DebitCardData {
  onSelect: (value: string) => void;
  value: string;
  selected: boolean;
}

const DebitCard: React.FC<DebitCardProps> = ({
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
      <div className="bg-bg-secondary rounded-full flex items-center justify-center w-[40px] h-[40px]">
        <BankFilledIcon size={20} />
      </div>
      <div>
        <p className="font-medium text-txt-primary text-p3 sm:text-p2">{title}</p>
        <p className="text-txt-secondary text-p4 sm:text-p3">{description}</p>
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

export { DebitCard };
