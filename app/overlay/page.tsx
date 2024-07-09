"use client";
import { overlay } from "overlay-kit";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

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
  const { className, ...rest } = props;
  return (
    <DialogPrimitives.Portal>
      <DialogPrimitives.Content
        className={
          " fixed top-[50%] left-[50%] translate-x-[-50%] z-10 translate-y-[-50%] bg-white min-w-[260px] min-h-[200px] rounded-lg"
        }
        ref={ref}
        {...rest}
      />
      <Overlay />
    </DialogPrimitives.Portal>
  );
});

const Dialog = {
  Root,
  Content,
};

export default function Page() {
  return (
    <div>
      <button
        onClick={() => {
          overlay.open(({ isOpen, close }) => {
            return (
              <Dialog.Root open={isOpen} onOpenChange={close}>
                <Dialog.Content>
                  <button onClick={close}>닫기</button>
                </Dialog.Content>
              </Dialog.Root>
            );
          });
        }}
      >
        button
      </button>

      <button
        onClick={async () => {
          const agreed = await new Promise((res) =>
            overlay.open(({ isOpen, close }) => {
              return (
                <Dialog.Root open={isOpen} onOpenChange={close}>
                  <Dialog.Content>
                    <button
                      onClick={() => {
                        res(true);
                        close();
                      }}
                    >
                      동의하기
                    </button>
                    <button
                      onClick={() => {
                        res(false);
                        close();
                      }}
                    >
                      거절하기
                    </button>
                  </Dialog.Content>
                </Dialog.Root>
              );
            }),
          );
          if (agreed) {
            alert("agreed event");
          } else {
            alert("disagreed event");
          }
        }}
      >
        async button
      </button>
    </div>
  );
}
