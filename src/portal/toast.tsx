"use client";

import { useEffect, useLayoutEffect, useReducer, useState } from "react";
import { Pubsub } from "../packages/pub-sub";
import { ClientOnlyPortal } from "./client-only-portal";

type ToastEvent = "add" | "delete" | "clear";

type ToastType = {
  id: string;
  title: string;
  option: "success" | "error" | "warning";
  time: number;
};

type AddAction = {
  type: "add";
  payload: ToastType;
};

type DeleteAction = {
  type: "delete";
  payload: { id: string };
};

type ToastAction = AddAction | DeleteAction;

type ToastParamType = Partial<Pick<ToastType, "title" | "option" | "time">>;

const initialState: ToastType[] = [];

const reducer = (state: ToastType[], action: ToastAction): ToastType[] => {
  switch (action.type) {
    case "add":
      return [...state, action.payload];
    case "delete":
      return state.filter((toast) => toast.id !== action.payload.id);
    default:
      return state;
  }
};

const toastPubsub = new Pubsub<ToastEvent>();

export const Toaster = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useLayoutEffect(() => {
    const addHandler = (toast: ToastParamType) => {
      const id = Math.random().toString(36).substring(7);
      const title = toast.title ?? "";
      const option = toast.option ?? "success";
      const time = toast.time ?? 1500;
      dispatch({ type: "add", payload: { id, title, option, time } });
      let timeoutId = setTimeout(() => {
        dispatch({ type: "delete", payload: { id } });
        clearTimeout(timeoutId);
      }, time);
    };

    const deleteHandler = (id: ToastType["id"]) => {
      dispatch({ type: "delete", payload: { id } });
    };

    toastPubsub.subscribe("add", addHandler);
    toastPubsub.subscribe("delete", deleteHandler);
    return () => {
      toastPubsub.unsubscribe("add", addHandler);
      toastPubsub.unsubscribe("delete", deleteHandler);
    };
  }, []);

  return (
    <ClientOnlyPortal selector={"#toast"}>
      <div className=" fixed  bottom-0 left-[50%] translate-x-[-50%]  flex flex-col gap-y-16">
        {state.map((toast) => (
          <div key={toast.id} className=" bg-purple-300 px-16 py-4 text-purple-800 rounded-full">
            {toast.title}
          </div>
        ))}
      </div>
    </ClientOnlyPortal>
  );
};

export const toast = {
  show: (param: ToastParamType) => {
    toastPubsub.publish("add", param);
  },
  delete: (id: string) => {
    toastPubsub.publish("delete", { id });
  },
};
