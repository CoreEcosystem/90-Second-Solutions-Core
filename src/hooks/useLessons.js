import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

export function useLessons() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [usageData, setUsageData] = useState(null);
  const [usageLoading, setUsageLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { data: user } = useUser();

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
    } finally {
      setUsageLoading(false);
    }
  };

  const trackUsage = async (type) => {
    try {
      const response = await fetch("/api/usage/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (response.status === 403) {
        const data = await response.json();
        if (data.paywalled || data.limit_reached) {
          setShowUpgradeModal(true);
          return false;
        }
      }

      if (response.ok) {
        await fetchUsageData();
        return true;
      }
    } catch (error) {
      console.error("Error tracking usage:", error);
    }
    return false;
  };

  const markComplete = (lessonId) => {
    setCompletedLessons((prev) => new Set([...prev, lessonId]));
  };

  return {
    selectedCategory,
    setSelectedCategory,
    completedLessons,
    markComplete,
    usageData,
    usageLoading,
    showUpgradeModal,
    setShowUpgradeModal,
    trackUsage,
    user,
  };
}
