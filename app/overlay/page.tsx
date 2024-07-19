"use client";
import { overlay } from "overlay-kit";
import { useState } from "react";

export default function Page() {
  const [notWorkingText, setNotWorkingText] = useState("world");
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
    </div>
  );
}
