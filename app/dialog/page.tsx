"use client";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { useState } from "react";

const Dialog2 = () => {
  const [open1, onOpen1Change] = useState(false);
  const [open2, onOpen2Change] = useState(false);

  return (
    <div className="">
      <button
        onClick={() => {
          onOpen2Change(true);

          onOpen1Change(true);
        }}
      >
        클릭 시 다이얼로그
      </button>
      <DialogPrimitives.Root open={open2} onOpenChange={onOpen2Change}>
        <DialogPrimitives.Portal>
          <DialogPrimitives.Overlay className=" fixed top-0 left-0 bottom-0 right-0  bg-slate-400 opacity-40" />

          <DialogPrimitives.Content className=" fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white w-[300px] h-[200px]">
            dialog
          </DialogPrimitives.Content>
        </DialogPrimitives.Portal>
      </DialogPrimitives.Root>

      <DialogPrimitives.Root open={open1} onOpenChange={onOpen1Change}>
        <DialogPrimitives.Portal>
          <DialogPrimitives.Content className=" fixed bottom-[0] left-[50%] translate-x-[-50%]  bg-white w-[300px] h-[200px]">
            bottom sheet
          </DialogPrimitives.Content>
        </DialogPrimitives.Portal>
      </DialogPrimitives.Root>
    </div>
  );
};

export default function Home() {
  return (
    <div className="">
      <Dialog2 />
    </div>
  );
}
