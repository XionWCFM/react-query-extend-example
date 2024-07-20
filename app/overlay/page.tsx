"use client";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { overlay } from "overlay-kit";
import { useState } from "react";

const exampleAtom = atom("example");

export default function Page() {
  const [notWorkingText, setNotWorkingText] = useState("world");
  const setter = useSetAtom(exampleAtom);

  return (
    <div className=" flex flex-col">
      <button
        onClick={() => {
          overlay.open(({ isOpen }) => {
            return isOpen ? (
              <div className=" fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div>{notWorkingText}</div>
                <button
                  onClick={() => {
                    setNotWorkingText("hello");
                  }}
                >
                  text change
                </button>
              </div>
            ) : null;
          });
        }}
      >
        not work example button
      </button>

      <button
        onClick={() => {
          overlay.open(({ isOpen, close }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [workingText, setWorkingText] = useState("world");
            return isOpen ? (
              <div className=" fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div>{workingText}</div>
                <button
                  onClick={() => {
                    setWorkingText("hello");
                  }}
                >
                  text change
                </button>
                <button onClick={close}>close</button>
              </div>
            ) : null;
          });
        }}
      >
        work example
      </button>
      <button
        onClick={() => {
          overlay.open(({ isOpen }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const value = useAtomValue(exampleAtom);
            return (
              <div>
                <div className="">{value}</div>
                <button onClick={() => setter("hello")}>onCLick</button>
              </div>
            );
          });
        }}
      >
        state
      </button>
    </div>
  );
}
