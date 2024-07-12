"use client";

import { useCallback, useEffect, useReducer, useState } from "react";

type NonEmptyArray<T> = readonly [T, ...T[]];
type FlowOption<T extends NonEmptyArray<string>> = {
  initialStep?: T[number];
};

type FlowType<T extends NonEmptyArray<string>> = {
  pageCount: number;
  currentStep: T[number];
  historyStack: T[number][];
};

type FlowActionType<T extends NonEmptyArray<string>> =
  | {
      type: "next";
      payload: {
        step: T[number];
      };
    }
  | {
      type: "back";
    }
  | {
      type: "clear";
    };

const reducer = <T extends NonEmptyArray<string>>(state: FlowType<T>, action: FlowActionType<T>): FlowType<T> => {
  switch (action.type) {
    case "next":
      return {
        pageCount: state.pageCount + 1,
        currentStep: action.payload.step,
        historyStack: [...state.historyStack, action.payload.step],
      } satisfies FlowType<T>;
    case "back":
      if (state.pageCount === 0) {
        return state;
      }
      return {
        pageCount: state.pageCount - 1,
        currentStep: state.currentStep,
        historyStack: state.historyStack.slice(0, -1),
      } satisfies FlowType<T>;
    case "clear":
      return state;
    default:
      return state;
  }
};

const useFlow = <T extends NonEmptyArray<string>>(list: T, option?: FlowOption<T>) => {
  const initialState: FlowType<T> = {
    pageCount: 0,
    currentStep: option?.initialStep ?? list[0],
    historyStack: [option?.initialStep ?? list[0]],
  };
  const [state, dispatch] = useReducer(reducer, initialState);
};

export default function Home() {
  return <div className=""></div>;
}
