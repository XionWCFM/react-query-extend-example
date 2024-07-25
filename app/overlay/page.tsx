"use client";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { overlay } from "overlay-kit";
import { useEffect, useState } from "react";

const exampleAtom = atom("example");

export default function Page() {
  const [notWorkingText, setNotWorkingText] = useState("world");
  const setter = useSetAtom(exampleAtom);
  useEffect(() => {
    if (typeof window === "undefined") {
      return () => {};
    }

    if (window.localStorage.getItem("hi") === null) {
      overlay.open(
        ({ isOpen, close }) =>
          isOpen ? (
            <div
              onClick={() => {
                close();
                window.localStorage.setItem("hi", "already");
              }}
            >
              hello
            </div>
          ) : null,
        {
          overlayId: "hello",
        },
      );
    }
  }, []);

  return <div className=" flex flex-col"></div>;
}
