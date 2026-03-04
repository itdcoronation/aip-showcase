import { FileIcon } from "@/assets/vectors/icons";
import { SelectInput } from "@/components/form/select-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { identityTypeOptions } from "@/lib/constants";
import { downloadFromUrl } from "@/lib/file";
import { cn } from "@/lib/utils";
import useOnboardingStore from "@/store/onboarding";
import { DownloadIcon } from "lucide-react";

const Documents = () => {
  const { data } = useOnboardingStore();

  return (
    <div className="grid gap-4">
      <SelectInput
        label="Identity document type"
        options={identityTypeOptions}
        required
        value={data?.identity_document_type || ""}
        parentClassName="w-full"
        disabled
        onChange={console.log}
      />
      <Input
        label="Identity document number"
        name="identity_document_no"
        placeholder="Enter your document number"
        value={data?.identity_document_number || ""}
        required
        disabled
      />
      <FileListItem
        label={"Passport photograph"}
        file_name={`${data?.first_name} - Passport photograph`}
        isUploaded={!!data?.kyc_photo}
        file={data?.kyc_photo ?? undefined}
      />
      <FileListItem
        label={"Identity document"}
        file_name={`${data?.first_name} - ${
          data?.identity_document_type ?? "Identity Document"
        }`}
        isUploaded={!!data?.kyc_link}
        file={data?.kyc_link ?? undefined}
      />
      <FileListItem
        label={"Proof of address"}
        file_name={`${data?.first_name} - Proof of address`}
        isUploaded={!!data?.kyc_address}
        file={data?.kyc_address ?? undefined}
      />
      <FileListItem
        label={"Signature"}
        file_name={`${data?.first_name} - Signature`}
        isUploaded={!!data?.kyc_signature}
        file={data?.kyc_signature ?? undefined}
      />
    </div>
  );
};

export { Documents };

interface FileListItemProps {
  label: string;
  file_name: string;
  isUploaded: boolean;
  file?: string;
}

const FileListItem = ({
  label,
  file_name,
  isUploaded,
  file,
}: FileListItemProps) => {
  return (
    <div className="">
      <p className={"block font-medium mb-1 text-txt-primary !text-p3"}>
        {label} *
      </p>
      <div className="grid grid-cols-[32px_1fr_36px] gap-4 items-start justify-between rounded-md bg-transparent border border-stroke-primary p-4">
        <FileIcon className={!isUploaded ? "opacity-50" : ""} />
        <div className="my-auto p-0 gap-4">
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-p3 font-medium",
                isUploaded ? "" : "text-txt-disabled font-normal"
              )}
            >
              {isUploaded ? file_name : "No document uploaded"}
            </p>
            {/* <p className="text-p3 text-txt-tertiary">
              {isUploaded && file ? getBase64FileSize(file) : "-"}
            </p> */}
          </div>
        </div>
        {isUploaded && !!file ? (
          <Button
            onClick={() => downloadFromUrl(file, file_name)}
            size={"icon"}
            variant="ghost"
            className="shrink-0 hover:outline"
          >
            <DownloadIcon />
          </Button>
        ) : null}
      </div>
    </div>
  );
};
