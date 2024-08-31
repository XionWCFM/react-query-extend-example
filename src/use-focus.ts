import { useState, useEffect, useRef } from "react";

const useFocus = () => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const element = ref.current;
    if (element) {
      element.addEventListener("focus", handleFocus);
      element.addEventListener("blur", handleBlur);
    }

    return () => {
      if (element) {
        element.removeEventListener("focus", handleFocus);
        element.removeEventListener("blur", handleBlur);
      }
    };
  }, [ref]);

  return [isFocused, ref] as const;
};

export default useFocus;
