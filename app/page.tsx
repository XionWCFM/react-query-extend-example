"use client";

import { exampleAction } from "~/actions/example-actions";

export default function Home() {
  return (
    <div className="">
      <button
        onClick={() => {
          exampleAction("hello");
        }}
      >
        click
      </button>
    </div>
  );
}
