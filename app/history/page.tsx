"use client";
import { useState, useRef, useEffect } from "react";

interface HistoryState {
  pageIndex: number;
}

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState<number>(
    typeof window !== "undefined" ? window.history.state?.pageIndex || 0 : 0,
  );
  const currentIndexRef = useRef<number>(currentIndex);

  useEffect(() => {
    currentIndexRef.current = currentIndex;

    // 현재 상태를 히스토리에 저장
    const currentState: HistoryState = { pageIndex: currentIndex };
    window.history.replaceState(currentState, "");

    const handlePopState = (event: PopStateEvent) => {
      if (!event.state) return;

      const previousState: HistoryState = event.state;

      if (previousState.pageIndex < currentIndexRef.current) {
        console.log("뒤로가기");
      } else if (previousState.pageIndex > currentIndexRef.current) {
        console.log("앞으로가기");
      } else {
        console.log("히스토리 상태가 변하지 않았어");
      }

      // 현재 상태를 업데이트
      setCurrentIndex(previousState.pageIndex);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentIndex]);

  return <div></div>;
}
