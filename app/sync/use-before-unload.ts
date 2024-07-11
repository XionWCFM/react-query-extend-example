import { useEffect } from "react";

type BeforeUnloadCallback = () => Promise<boolean> | boolean;

const useBeforeUnload = (callback: BeforeUnloadCallback) => {
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      const shouldUnload = await callback();
      if (!shouldUnload) {
        e.preventDefault();
        e.returnValue = ""; // Modern browsers will ignore this, but it's required for compatibility
      }
    };

    const handlePopState = async (e: PopStateEvent) => {
      const shouldUnload = await callback();
      if (!shouldUnload) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [callback]);

  useEffect(() => {
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const handleStateChange = async () => {
      const shouldUnload = await callback();
      if (!shouldUnload) {
        window.history.go(1); // Prevents going back
      }
    };

    window.history.pushState = function (...args) {
      handleStateChange()
        .then(() => {
          return originalPushState.apply(this, args);
        })
        .catch(() => {
          // Error handling if needed
        });
    };

    window.history.replaceState = function (...args) {
      handleStateChange()
        .then(() => {
          return originalReplaceState.apply(this, args);
        })
        .catch(() => {
          // Error handling if needed
        });
    };

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [callback]);

  return null;
};

export default useBeforeUnload;
