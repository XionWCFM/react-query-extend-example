"use client";

import React, { useCallback, useEffect } from "react";
import { memo, useState } from "react";

export default function Page() {
  return <div className=" px-16 py-16"></div>;
}

export type ExampleType = {
  id: string;
  content: string;
  done: boolean;
};

export const MemoizedComponent = ({ list }: { list: ExampleType[] }) => {
  const [state, setState] = useState(list);
  const handleCheck = useCallback((id: string) => {
    setState((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, done: !item.done };
        }
        return item;
      });
    });
  }, []);
  return (
    <div className=" flex flex-col gap-y-16">
      {state.map((item) => (
        <MemoizedItemComponent
          key={item.id}
          id={item.id}
          onClick={handleCheck}
          content={item.content}
          done={item.done}
        />
      ))}
    </div>
  );
};

// eslint-disable-next-line react/display-name
const MemoizedItemComponent = memo((props: ExampleType & { onClick: (item: string) => void }) => {
  return (
    <div>
      <input type="checkbox" checked={props.done} onChange={() => props.onClick(props.id)} />
      <span>{props.content}</span>
    </div>
  );
});

export const UnmemoComponent = ({ list }: { list: ExampleType[] }) => {
  const [state, setState] = useState(list);
  const handleCheck = (id: string) => {
    setState((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, done: !item.done };
        }
        return item;
      });
    });
  };
  return (
    <div className=" flex flex-col gap-y-16">
      {state.map((item) => (
        <UnmemoItem key={item.id} id={item.id} onClick={handleCheck} content={item.content} done={item.done} />
      ))}
    </div>
  );
};

const UnmemoItem = (props: ExampleType & { onClick: (item: string) => void }) => {
  return (
    <div>
      <input type="checkbox" checked={props.done} onChange={() => props.onClick(props.id)} />
      <span>{props.content}</span>
    </div>
  );
};

export const useRenderTime = (componentName: string) => {
  useEffect(() => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`${componentName} 렌더링 시간: ${end - start}ms`);
    };
  });
};
