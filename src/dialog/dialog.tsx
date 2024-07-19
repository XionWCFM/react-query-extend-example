import * as DialogPrimitives from "@radix-ui/react-dialog";
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from "react";

const Root = DialogPrimitives.Root;
const Overlay = forwardRef<
  ElementRef<typeof DialogPrimitives.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitives.Overlay>
>(function Overlay(props, ref) {
  const { className, children, ...rest } = props;
  return (
    <DialogPrimitives.Overlay
      className={` bg-neutral-200 opacity-60 w-screen h-screen fixed top-0 left-0`}
      {...props}
      ref={ref}
    />
  );
});

const Content = forwardRef<
  ElementRef<typeof DialogPrimitives.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitives.Content>
>(function Content(props, ref) {
  const { className, children, ...rest } = props;
  return (
    <DialogPrimitives.Portal>
      <DialogPrimitives.Content
        className={
          " data-[state=open]:animate-contentShow data-[state=closed]:animate-toastDown fixed top-[50%] left-[50%] translate-x-[-50%] z-10 translate-y-[-50%] bg-white min-w-[260px] min-h-[200px] rounded-lg"
        }
        ref={ref}
        {...rest}
      >
        {children}
      </DialogPrimitives.Content>
      <Overlay />
    </DialogPrimitives.Portal>
  );
});

const Dialog = {
  Root,
  Content,
};
