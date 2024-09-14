"use client";
import React from "react";
import { Virtuoso } from "react-virtuoso";

// 아이템의 타입을 정의합니다
type Item = string;

// 컴포넌트의 props 타입을 정의합니다
interface ItemRendererProps {
  index: number;
  item: Item;
}

const Page = () => {
  // 10,000개의 아이템을 생성합니다
  const items: Item[] = Array.from({ length: 10000 }, (_, index) => `Item ${index + 1}`);

  const ItemRenderer: React.FC<ItemRendererProps> = ({ index, item }) => (
    <div
      style={{
        padding: "1rem",
        borderBottom: "1px solid #ddd",
        background: index % 2 ? "#f8f8f8" : "white",
      }}
    >
      {item}
    </div>
  );

  return (
    <div style={{ height: "400px" }}>
      <Virtuoso
        style={{ height: "100%" }}
        totalCount={items.length}
        itemContent={(index) => <ItemRenderer index={index} item={items[index]} />}
      />
    </div>
  );
};

export default Page;
