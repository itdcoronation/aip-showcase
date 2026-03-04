import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export const fileSchema = z
  .any()
  .refine((files) => {
    if (!files || !files[0]) return false;
    return true;
  }, "This file is required")
  .refine((files) => {
    if (!files || !files[0]) return true;
    return files[0].size <= MAX_FILE_SIZE;
  }, "File size must be less than 10MB")
  .refine((files) => {
    if (!files || !files[0]) return true;
    return ACCEPTED_FILE_TYPES.includes(files[0].type);
  }, "Only .jpg, .jpeg, .png and .pdf files are accepted");

const ACCEPTED_IMG_TYPES = ["image/jpeg", "image/png"];

export const imgSchema = z
  .any()
  .refine((files) => {
    if (!files || !files[0]) return false;
    return true;
  }, "This file is required")
  .refine((files) => {
    if (!files || !files[0]) return true;
    return files[0].size <= MAX_FILE_SIZE;
  }, "File size must be less than 10MB")
  .refine((files) => {
    if (!files || !files[0]) return true;
    return ACCEPTED_IMG_TYPES.includes(files[0].type);
  }, "Only .jpg, .jpeg, .png and .pdf files are accepted");

export function base64ToFile(base64DataURL, filename) {
  // Validate the input is a data URL
  if (
    !base64DataURL ||
    typeof base64DataURL !== "string" ||
    !base64DataURL.startsWith("data:")
  ) {
    console.warn("Invalid Base64 input:", base64DataURL);
    throw new Error(
      'Invalid Base64 input: must be a data URL starting with "data:"'
    );
  }

  // Split the data URL into parts
  const [header, data] = base64DataURL.split(";base64,");

  if (!header || !data) {
    throw new Error("Invalid Base64 data URL format");
  }

  // Extract MIME type (remove "data:" prefix)
  const mimeType = header.replace("data:", "");

  // Determine file extension from MIME type
  let fileExtension = "bin"; // Default
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
    fileExtension = "jpg";
  } else if (mimeType.includes("png")) {
    fileExtension = "png";
  } else if (mimeType.includes("pdf")) {
    fileExtension = "pdf";
  }

  // Decode Base64 to binary
  const byteCharacters = atob(data);
  const byteArray = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }

  // Create and return File object with proper name and extension
  const file = new File(
    [byteArray],
    `${filename || "passport"}.${fileExtension}`,
    { type: mimeType }
  );

  return file;
}

export const base64ToFileList = (base64DataURL, filename) => {
  let newFile;
  try {
    const file = base64ToFile(base64DataURL, filename);
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    newFile = dataTransfer.files;

    return newFile as FileList;
  } catch (error) {
    console.error("Error converting file:", error);
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const downloadBase64 = (base64Data: string, fileName: string) => {
  const file = base64ToFile(base64Data, fileName);
  const url = window.URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadFromUrl = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const getBase64FileSize = (base64String: string): string => {
  if (!base64String) return "0 Bytes";

  // Calculate the size in bytes
  const padding = (base64String.match(/=+$/) || [""])[0].length;
  const base64Length = base64String.length;
  const sizeInBytes = (base64Length * 3) / 4 - padding;

  // Convert to a more readable format
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (sizeInBytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const size = parseFloat((sizeInBytes / Math.pow(1024, i)).toFixed(2));

  return `${size} ${sizes[i]}`;
};