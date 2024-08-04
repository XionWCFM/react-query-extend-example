import { overlay as toverlay } from "overlay-kit";
import { FC } from "react";

type OverlayControllerProps = {
  overlayId: string;
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
};
type OverlayControllerComponent = FC<OverlayControllerProps & { resolve: (bool: boolean) => void }>;

type OpenOverlayOptions = {
  overlayId?: string;
};

const promise = (controller: OverlayControllerComponent, options?: OpenOverlayOptions) => {
  return new Promise((resolve) => resolve(true));
};

const overlay = Object.assign(toverlay, { promise });
const Hello = () => {
  const before = async () => {
    const result = await new Promise((resolve) =>
      overlay.open(({ close, isOpen }) => (
        <div>
          <button onClick={() => resolve(true)}>resolve</button>
        </div>
      )),
    );
    if (result) {
      //...
    }
  };

  const after = async () => {
    const result = await overlay.promise(({ isOpen, close, resolve }) => (
      <div>
        <button onClick={() => resolve(true)}>resolove</button>
      </div>
    ));
    if (result) {
      //...
    }
  };
};
