"use client";
import { useRouter } from "next/navigation";
import { ComponentPropsWithoutRef, ElementRef, forwardRef, useCallback, useEffect, useState } from "react";
import { Flow, useFlow } from "~/src/hooks/observer-flow";

const steps = ["step1", "step2", "step3"] as const;
const flow = new Flow(steps, {
  plugin: [],
});

import * as DialogPrimitives from "@radix-ui/react-dialog";

export default function Page() {
  const [Funnel] = useFlow(flow);
  const router = useRouter();

  return (
    <div>
      <div className=" flex gap-x-4">
        {steps.map((step) => (
          <button
            key={step}
            onClick={() => {
              flow.pushStep(step);
              router.push("/oflow2?step=1");
            }}
          >
            push {step}
          </button>
        ))}
      </div>
      <div className=" flex gap-x-4">
        {steps.map((step) => (
          <button key={step} onClick={() => flow.replaceStep(step)}>
            replace {step}
          </button>
        ))}
      </div>
      <div className=" flex gap-x-4">
        <button onClick={() => flow.back()}>backstep</button>
      </div>
      <div className=" "> historyStackWithCurrent : {flow.historyStack.concat(flow.step).join(", ")}</div>
      <div className="">stackCount : {flow.getStackCount()}</div>
      <div className="">prevStep: {flow.getPrevStep()}</div>
      <div className="">currentSTep : {flow.step}</div>
      <div className="">historyStack : {flow.historyStack.join(", ")}</div>

      <div className=" mt-32"></div>
      <Funnel>
        <Funnel.Step name="step1">
          <div>현재 : Step 1</div>
        </Funnel.Step>
        <Funnel.Step name="step2">
          <div>현재 : Step 2</div>
        </Funnel.Step>
        <Funnel.Step name="step3">
          <div>현재 : Step 3</div>
        </Funnel.Step>
      </Funnel>
    </div>
  );
}

interface ConfirmHandler {
  (): boolean | Promise<boolean>;
}

interface UseNavigationGuardOptions {
  onBack?: boolean;
  onForward?: boolean;
  onUnload?: boolean;
}

const useNavigationGuard = (confirmHandler: ConfirmHandler, props?: UseNavigationGuardOptions) => {
  const { onBack = true, onForward = true, onUnload = true } = props ?? {};
  const [isNavigating, setIsNavigating] = useState(false);

  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (isNavigating) {
        event.preventDefault();
        event.returnValue = "";
      }
    },
    [isNavigating],
  );

  const handlePopState = useCallback(
    async (event: PopStateEvent) => {
      const confirmed = await confirmHandler();
      if (!confirmed) {
        event.preventDefault();
        history.go(1);
      } else {
        setIsNavigating(true);
      }
    },
    [confirmHandler],
  );

  useEffect(() => {
    if (onUnload) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    if (onBack || onForward) {
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      if (onUnload) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }

      if (onBack || onForward) {
        window.removeEventListener("popstate", handlePopState);
      }
    };
  }, [handleBeforeUnload, handlePopState, onBack, onForward, onUnload]);

  return { setIsNavigating };
};

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
