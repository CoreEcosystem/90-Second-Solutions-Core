import { useState, useEffect } from "react";

export function useResetUsage(user) {
  const [usageData, setUsageData] = useState(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUsageData();
    }
  }, [user]);

  const fetchUsageData = async () => {
    try {
      const response = await fetch("/api/usage/check");
      if (response.ok) {
        const data = await response.json();
        setUsageData(data);
      }
    } catch (error) {
      console.error("Error fetching usage data:", error);
    }
  };

  const trackUsage = async () => {
    if (tracking) return false;

    setTracking(true);
    try {
      const response = await fetch("/api/usage/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reset" }),
      });

      if (response.status === 403) {
        return { success: false, limitReached: true };
      }

      if (response.ok) {
        await fetchUsageData(); // Refresh usage data
        return { success: true, limitReached: false };
      }
    } catch (error) {
      console.error("Error tracking usage:", error);
    } finally {
      setTracking(false);
    }
    return { success: false, limitReached: false };
  };

  const isLocked =
    usageData && !usageData.is_premium && usageData.resets_limit_reached;

  return {
    usageData,
    tracking,
    isLocked,
    trackUsage,
  };
}
