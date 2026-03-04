"use client";

import { CloudUploadIcon, FileIcon } from "@/assets/vectors/icons";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneTrigger,
  DropzoneMessage,
  DropzoneRemoveFile,
  InfiniteProgress,
  useDropzone,
} from "@/components/ui/dropzone";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { Accept } from "react-dropzone";

interface FileUploadProps {
  maxFiles?: number;
  label?: string;
  validatormessage?: string;
  parentClassName?: string;
  labelClassName?: string;
  accept?: Accept;
  maxSizeInMb?: number;
  required?: boolean;
  hint?: string;
  value?: File[];
  onChange?: (files: File[]) => void;
  trigger?: React.ReactNode;
  hideProgress?: boolean;
  instructions?: string;
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const {
    maxFiles = 1,
    labelClassName,
    label,
    accept,
    maxSizeInMb,
    required,
    validatormessage,
    hint,
    parentClassName,
    trigger,
    onChange,
    value = [],
    hideProgress = false,instructions
  } = props;
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onChange) {
        onChange([...value, file]);
      }

      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: accept,
      maxSize: (maxSizeInMb ?? 10) * 1024 * 1024,
      maxFiles: maxFiles,
    },
  });

  const isMultiple = maxFiles > 1;

  return (
    <div className={parentClassName}>
      <Dropzone {...dropzone}>
        <div>
          <div className="flex justify-between">
            {label ? (
              <DropzoneDescription
                className={cn(
                  "block font-medium mb-1 text-txt-primary !text-p3",
                  labelClassName
                )}
              >
                {label}{" "}
                {required && <span className="text-txt-brand ml-[2px]">*</span>}
              </DropzoneDescription>
            ) : null}
          </div>
          {isMultiple || dropzone.fileStatuses.length === 0 ? (
            <DropZoneArea
              onChange={console.log}
              className="border-stroke-primary p-0"
            >
              <DropzoneTrigger className="flex flex-col items-center gap-2 bg-transparent p-4 text-center w-full">
                {trigger ?? (
                  <>
                    <CloudUploadIcon className="size-10" />
                    <div className="space-y-2">
                      <p className="text-p3 text-txt-tertiary">
                        <span className="text-txt-primary font-semibold">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-p4 text-txt-tertiary">
                        {instructions  ?? `PDF, PNG, or JPG (max. ${maxSizeInMb ?? 5}MB )`}
                      </p>
                    </div>
                  </>
                )}
              </DropzoneTrigger>
            </DropZoneArea>
          ) : null}
        </div>

        <DropzoneFileList
          className={cn(
            "p-0",
            isMultiple ? "grid gap-3 md:grid-cols-2 lg:grid-cols-3" : ""
          )}
        >
          {dropzone.fileStatuses.map((file) => (
            <DropzoneFileListItem
              className="overflow-hidden rounded-md bg-transparent border border-stroke-primary p-4"
              key={file.id}
              file={file}
            >
              {/* {file.status === "pending" && (
                <div className="aspect-video animate-pulse bg-black/20" />
              )}
              {file.status === "success" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={file.result}
                  alt={`uploaded-${file.fileName}`}
                  className="aspect-video object-cover"
                />
              )} */}
              <div className="grid grid-cols-[32px_1fr_36px] gap-4 items-center justify-between">
                <FileIcon />
                <div className=" p-0 gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-p3 font-medium">
                      {file.fileName}
                    </p>
                    <p className="text-p3 text-txt-tertiary">
                      {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {file.status === "success" ? (
                  <DropzoneRemoveFile
                    variant="ghost"
                    className="shrink-0 hover:outline"
                  >
                    <Trash2Icon className="size-4" />
                  </DropzoneRemoveFile>
                ) : (
                  ""
                )}
              </div>

              {hideProgress ? null : (
                <div className="flex items-center justify-between gap-3 ml-12 mr-8">
                  <InfiniteProgress status={file.status} />
                  <span className="text-p4 font-medium">
                    {file.status === "success"
                      ? "100%"
                      : file.status === "error"
                      ? "0%"
                      : "..."}
                  </span>
                </div>
              )}
            </DropzoneFileListItem>
          ))}
        </DropzoneFileList>
        <DropzoneMessage
          className="block mt-1 text-txt-danger !text-p3"
          message={validatormessage}
        />
        {hint && (
          <small className="block mt-1 text-txt-tertiary !text-p3">
            {hint}
          </small>
        )}
      </Dropzone>
    </div>
  );
};

export { FileUpload };
