import { VehicleInfoData } from "@/types/insurance";
import { Pencil, Trash2 } from "lucide-react";

interface VehicleInfoPreviewProps {
  data: VehicleInfoData;
  onEdit: () => void;
  onClear: () => void;
}

const VehicleInfoPreview = ({
  data,
  onEdit,
  onClear,
}: VehicleInfoPreviewProps) => {
  return (
    <div className="border border-[#EEEFF1] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-p4 text-txt-secondary">Vehicle Information</p>
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

      <p className="text-p2 font-semibold text-txt-primary">
        {data.year} {data.make} {data.model}
      </p>

      <div className="border-t border-[#EEEFF1] pt-3 grid grid-cols-2 gap-y-2">
        <p className="text-p4 text-txt-secondary">
          Type:{" "}
          <span className="text-txt-primary font-medium capitalize">
            {data.vehicleType}
          </span>
        </p>
        <p className="text-p4 text-txt-secondary">
          Use:{" "}
          <span className="text-txt-primary font-medium capitalize">
            {data.useType}
          </span>
        </p>
        <p className="text-p4 text-txt-secondary">
          Color:{" "}
          <span className="text-txt-primary font-medium">{data.color}</span>
        </p>
        <p className="text-p4 text-txt-secondary">
          Plate:{" "}
          <span className="text-txt-primary font-medium">
            {data.plateNumber}
          </span>
        </p>
        <p className="text-p4 text-txt-secondary">
          Policy start:{" "}
          <span className="text-txt-primary font-medium">
            {data.start_date || "-"}
          </span>
        </p>
      </div>
    </div>
  );
};

export { VehicleInfoPreview };
