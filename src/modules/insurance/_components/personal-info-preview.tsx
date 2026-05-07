import { Pencil, Trash2 } from "lucide-react";
import { format, isValid } from "date-fns";
import type { PersonalInfoData } from "@/types/insurance";

interface PersonalInfoPreviewProps {
  data: PersonalInfoData;
  onEdit: () => void;
  onClear: () => void;
}

const PersonalInfoPreview = ({
  data,
  onEdit,
  onClear,
}: PersonalInfoPreviewProps) => {
  const formattedDateOfBirth =
    data.dateOfBirth instanceof Date && isValid(data.dateOfBirth)
      ? format(data.dateOfBirth, "yyyy-MM-dd")
      : "-";
  const fullName = [data.title, data.firstName, data.middleName, data.lastName]
    .filter(Boolean)
    .join(" ");
  const formattedAddress = [
    data.houseNumber,
    data.residentialAddress,
    data.city,
    data.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="border border-[#EEEFF1] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-p4 text-txt-secondary">Personal Information</p>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-lg bg-[#F5F0FF] flex items-center justify-center"
          >
            <Pencil size={14} className="text-[#7C3AED]" />
          </button>
          <button
            onClick={onClear}
            className="w-8 h-8 rounded-lg bg-[#F5F0FF] flex items-center justify-center"
          >
            <Trash2 size={14} className="text-[#7C3AED]" />
          </button>
        </div>
      </div>

      <p className="text-p2 font-semibold text-txt-primary">{fullName}</p>

      <div className="border-t border-[#EEEFF1] pt-3 grid grid-cols-2 gap-y-2">
        <p className="text-p4 text-txt-secondary col-span-2">
          Email:{" "}
          <span className="text-txt-primary font-medium">{data.email}</span>
        </p>
        <p className="text-p4 text-txt-secondary">
          DOB:{" "}
          <span className="text-txt-primary font-medium">
            {formattedDateOfBirth}
          </span>
        </p>
        <p className="text-p4 text-txt-secondary">
          Phone:{" "}
          <span className="text-txt-primary font-medium">
            {data.phoneNumber}
          </span>
        </p>
        <p className="text-p4 text-txt-secondary col-span-2">
          Address:{" "}
          <span className="text-txt-primary font-medium">
            {formattedAddress}
          </span>
        </p>
      </div>
    </div>
  );
};

export { PersonalInfoPreview };
