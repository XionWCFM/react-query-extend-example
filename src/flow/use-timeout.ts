import { useEffect, useState } from "react";

export const useTimeout = (delay: number): boolean => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return show;
};
