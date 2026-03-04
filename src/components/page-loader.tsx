import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const PageLoader = ({ className }: { className?: string }) => {
  return (
    <main
      className={cn(
        "flex items-center justify-center w-dvw h-dvh bg-purple-400",
        className
      )}
    >
      <div className="animate-spin" data-testid="spin-container">
        <Loader color="#fff" width={60} height={60} />
      </div>
    </main>
  );
};

export default PageLoader;
