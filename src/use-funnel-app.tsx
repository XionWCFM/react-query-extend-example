import { useMemo, useState } from "react";
import { createUseFunnel } from "@use-funnel/core";
import { useRouter, useSearchParams } from "next/navigation";

export const useFunnel = createUseFunnel(({ id, initialState }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 현재 단계의 인덱스를 쿼리스트링에서 불러옴 (없으면 기본값 0)
  const currentIndex = Number(searchParams.get("step")) || 0;

  // history는 여전히 메모리에서 관리하지만, 현재 상태는 쿼리스트링에서 관리함
  const history = useMemo(() => {
    const initialHistory = searchParams.get("history")
      ? JSON.parse(searchParams.get("history") || "[]")
      : [initialState];
    return initialHistory;
  }, [searchParams, initialState]);

  // 쿼리스트링을 업데이트하는 함수
  const updateSearchParams = (nextHistory: any[], step: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("history", JSON.stringify(nextHistory));
    params.set("step", step.toString());
    router.push(`?${params.toString()}`);
  };

  // push 함수는 새로운 상태를 추가하고, 히스토리를 쿼리스트링으로 저장함
  const push = (state: any) => {
    const nextHistory = [...history.slice(0, currentIndex + 1), state];
    updateSearchParams(nextHistory, currentIndex + 1);
  };

  // replace 함수는 현재 상태를 덮어씌우고, 쿼리스트링에 반영함
  const replace = (state: any) => {
    const nextHistory = [...history.slice(0, currentIndex), state];
    updateSearchParams(nextHistory, currentIndex);
  };

  // go 함수는 현재 인덱스를 이동시키고, 쿼리스트링을 업데이트함
  const go = (delta: number) => {
    const nextIndex = currentIndex + delta;
    if (nextIndex >= 0 && nextIndex < history.length) {
      updateSearchParams(history, nextIndex);
    }
  };

  return {
    history,
    currentIndex,
    push,
    replace,
    go,
  };
});
