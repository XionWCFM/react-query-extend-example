import { Pubsub } from "../packages/pub-sub";

export type ToastEvent = "add" | "delete" | "clear";

export type ToastType = {
  id: string;
  title: string;
  option: "success" | "error";
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

export type ToastOmitOptionType = Omit<ToastParamType, "option">;

export const toastPubsub = new Pubsub<ToastEvent>();

export const toast = {
  show: (param: ToastParamType) => {
    toastPubsub.publish<ToastParamType>("add", param);
  },
  delete: (id: string) => {
    toastPubsub.publish<DeleteAction["payload"]>("delete", { id });
  },
  success: (param: ToastOmitOptionType) => {
    toastPubsub.publish<ToastParamType>("add", { ...param, option: "success" });
  },
  error: (param: ToastOmitOptionType) => {
    toastPubsub.publish<ToastParamType>("add", { ...param, option: "error" });
  },
};
