import { useState, useEffect } from "react";
import { getNepalBusinessStatus, BusinessStatus } from "@/utils/nepalTime";

export function useNepalBusinessStatus(): BusinessStatus {
  const [status, setStatus] = useState<BusinessStatus>(() => getNepalBusinessStatus());

  useEffect(() => {
    // Initial check
    setStatus(getNepalBusinessStatus());

    // Update every 10 seconds for real-time accuracy
    const timer = setInterval(() => {
      setStatus(getNepalBusinessStatus());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return status;
}
