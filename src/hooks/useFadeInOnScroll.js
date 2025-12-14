import { useEffect } from "react";

export function useFadeInOnScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      {
        // Trigger a bit later so the headline is more likely in view
        threshold: 0.5,
        rootMargin: "0px 0px -30% 0px",
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}
