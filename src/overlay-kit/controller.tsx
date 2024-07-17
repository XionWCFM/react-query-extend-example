import { useEffect, useRef } from "react";
import { OverlayControllerComponent } from "./reducer";

type OverlayControllerProps = {
  isOpen: boolean;
  current: string | null;
  overlayId: string;
  onMounted: () => void;
  onCloseModal: () => void;
  onExitModal: () => void;
  controller: OverlayControllerComponent;
};
export const OverlayController = (props: OverlayControllerProps) => {
  const { isOpen, current, overlayId, onMounted, onCloseModal, onExitModal, controller: Controller } = props;
  const prevCurrent = useRef(current);
  const onMountedRef = useRef(onMounted);

  if (prevCurrent.current !== current) {
    prevCurrent.current = current;

    if (current === overlayId) {
      onMountedRef.current();
    }
  }
  useEffect(() => {
    onMountedRef.current();
  }, []);
  return <Controller overlayId={overlayId} isOpen={isOpen} close={onCloseModal} unmount={onExitModal} />;
};
