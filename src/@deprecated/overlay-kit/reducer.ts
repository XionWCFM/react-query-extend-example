import { FC } from "react";

type OverlayActionType =
  | {
      type: "ADD";
      overlay: OverlayItem;
    }
  | {
      type: "OPEN";
      overlayId: string;
    }
  | {
      type: "CLOSE";
      overlayId: string;
    }
  | {
      type: "REMOVE";
      overlayId: string;
    }
  | {
      type: "CLOSE_ALL";
    }
  | {
      type: "REMOVE_ALL";
    };

type OverlayId = string;

export type OverlayControllerProps = {
  overlayId: OverlayId;
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
};

export type OverlayControllerComponent = FC<OverlayControllerProps>;

export type OverlayItem = {
  id: OverlayId;
  isOpen: boolean;
  controller: OverlayControllerComponent;
};

export type OverlayData = {
  current: OverlayId | null;
  overlayOrderList: OverlayId[];
  overlayData: Record<OverlayId, OverlayItem>;
};

const overlayInitialState: OverlayData = {
  current: null,
  overlayOrderList: [],
  overlayData: {},
};

const overlayReducer = (state: OverlayData, action: OverlayActionType) => {
  switch (action.type) {
    case "ADD": {
      const isExisted = state.overlayOrderList.includes(action.overlay.id);
      if (isExisted) return state;
    }
  }
};
