"use client";
import { useEffect, useReducer, useRef } from "react";
import { ToastType, ToastAction, ToastParamType, toastPubsub } from "./toast";
import * as ToastPrimitives from "@radix-ui/react-toast";

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

export const Toaster = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timeoutIds = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    const addHandler = async (toast: ToastParamType) => {
      const id = Math.random().toString(36).substring(7);
      const title = toast.title ?? "";
      const option = toast.option ?? "success";
      const time = toast.time ?? 1500;
      dispatch({ type: "add", payload: { id, title, option, time } });
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
    // <ClientOnlyPortal selector={"#toast"}>
    <ToastPrimitives.Provider duration={5000}>
      {state.map((toast) => (
        <ToastPrimitives.Root key={toast.id} duration={toast.time}>
          <ToastPrimitives.Title className=" bg-purple-50 ">{toast.title}</ToastPrimitives.Title>
        </ToastPrimitives.Root>
      ))}
      <ToastPrimitives.Viewport className=" fixed bottom-0 left-[50%] translate-x-[-50%]  flex flex-col gap-y-16" />
    </ToastPrimitives.Provider>
    // </ClientOnlyPortal>
  );
};
