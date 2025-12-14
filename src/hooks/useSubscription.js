import { useState, useEffect } from "react";

export function useSubscription(user, userLoading) {
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  useEffect(() => {
    if (user && !userLoading) {
      setSubscriptionLoading(true);
      fetch("/api/subscription/status")
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          setSubscription(data);
        })
        .catch(() => {
          // Silently fail for subscription status
        })
        .finally(() => {
          setSubscriptionLoading(false);
        });
    }
  }, [user, userLoading]);

  return { subscription, subscriptionLoading };
}
