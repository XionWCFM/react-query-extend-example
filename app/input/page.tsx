"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "~/src/@deprecated/dialog/dialog";

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, onOpenChange] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          onOpenChange(true);
        }}
      >
        오픈
      </button>

      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content>
          <button tabIndex={0}></button>

          <input ref={inputRef} type="text" className=" focus:bg-purple-200 bg-purple-50" />
          {/* <input type="text" className=" focus:bg-slate-300 bg-purple-50" /> */}
          <button className=" focus:bg-slate-500 bg-purple-50">class</button>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
