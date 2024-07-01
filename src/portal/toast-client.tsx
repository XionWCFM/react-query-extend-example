"use client";
import { useEffect, useReducer, useRef } from "react";
import { ClientOnlyPortal } from "./client-only-portal";
import { ToastType, ToastAction, ToastParamType, toastPubsub } from "./toast";

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
      let timeoutid = setTimeout(() => {
        dispatch({ type: "delete", payload: { id } });
        clearTimeout(timeoutid);
      }, time);
      timeoutIds.current[id] = timeoutid;
    };

    const deleteHandler = (id: ToastType["id"]) => {
      dispatch({ type: "delete", payload: { id } });
    };

    toastPubsub.subscribe("add", addHandler);
    toastPubsub.subscribe("delete", deleteHandler);
    return () => {
      toastPubsub.unsubscribe("add", addHandler);
      toastPubsub.unsubscribe("delete", deleteHandler);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(timeoutIds.current).forEach(clearTimeout);
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
