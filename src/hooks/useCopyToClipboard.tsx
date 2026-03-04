import { toast } from "sonner";

export const useCopyToClipboard = () => {
  const copy = async (text: string) => {
    if (!navigator.clipboard) {
      console.error("Clipboard API not supported");
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
      return true;
    } catch (err) {
      console.error("Failed to copy text: ", err);
      return false;
    }
  };

  return { copy };
};
