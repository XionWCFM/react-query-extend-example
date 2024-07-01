
import { Pubsub } from "../packages/pub-sub";

export type ToastEvent = "add" | "delete" | "clear";

export type ToastType = {
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

export type ToastAction = AddAction | DeleteAction;

export type ToastParamType = Partial<Pick<ToastType, "title" | "option" | "time">>;



export const toastPubsub = new Pubsub<ToastEvent>();


export const toast = {
  show: (param: ToastParamType) => {
    toastPubsub.publish("add", param);
  },
  delete: (id: string) => {
    toastPubsub.publish("delete", { id });
  },
};
