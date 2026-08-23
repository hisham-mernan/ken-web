import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element the first time it scrolls into view.
 *
 * Returns a ref and a class name to spread onto the element, rather than
 * wrapping it in another div -- several sections here are flex or grid
 * children, and an extra wrapper would break their layout.
 *
 * Two deliberate safeguards, because a reveal that fails leaves content
 * permanently invisible:
 *
 *   - Anyone who has asked for reduced motion gets the content immediately,
 *     with no transition at all.
 *   - If IntersectionObserver is missing, or never fires because the element
 *     started on screen in a browser that does not emit an initial entry, a
 *     timeout reveals it anyway.
 */
export const useReveal = ({ threshold = 0.15, delay = 0 } = {}) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const node = ref.current;
    if (!node) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);

    // Nothing on this site should stay hidden because an observer misfired.
    const failsafe = window.setTimeout(() => setShown(true), 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [threshold]);

  return {
    ref,
    revealClass: `reveal ${shown ? "is_shown" : ""}`,
    style: delay ? { transitionDelay: `${delay}ms` } : undefined,
  };
};

export default useReveal;
