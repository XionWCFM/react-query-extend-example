"use client";

import { Portal } from "@radix-ui/react-portal";
import { createSafeContext, useInputState } from "@xionwcfm/react";
import { useState } from "react";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen((prev) => !prev)} type="button">
        hello
      </button>
      <Provider value={{ value: "1" }}>
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </Provider>
    </div>
  );
}

const Dialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { value } = useC();
  if (!isOpen) {
    return null;
  }

  return (
    <div>
      <Portal>
        <div>{value}</div>
      </Portal>
    </div>
  );
};

const [Provider, useC] = createSafeContext<{ value: string }>(null);
