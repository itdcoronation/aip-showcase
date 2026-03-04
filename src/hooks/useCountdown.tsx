import { formatDuration } from "@/lib/time";
import { useState, useEffect } from "react";

export const useCountdown = (initialSeconds: number) => {
  const [countdown, setCountdown] = useState(initialSeconds);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const intervalId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdown]);

  const resetCountdown = () => {
    setCountdown(initialSeconds);
    setCanResend(false);
  };

  const formattedCountdown = formatDuration(countdown);

  return { countdown, canResend, resetCountdown, formattedCountdown };
};
