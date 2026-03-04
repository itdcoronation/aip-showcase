import { BankFilledIcon, CheckCircleIcon } from "@/assets/vectors/icons";
import { cn } from "@/lib/utils";

export interface BankAccountData {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
}

interface BankAccountProps extends BankAccountData {
  onSelect: (value: string) => void;
  value: string;
  selected: boolean;
}

const BankAccount: React.FC<BankAccountProps> = ({
  onSelect,
  selected,
  value,
  accountName,
  accountNumber,
  bankName,
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
        <p className="font-medium text-txt-primary text-p3 sm:text-p2">
          {bankName} - {accountNumber}
        </p>
        <p className="text-txt-secondary text-p4 sm:text-p3">{accountName}</p>
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

export { BankAccount };
