"use client";
import { useEffect, useState, useTransition } from "react";
import { usePreventPullToRefresh } from "../sync/use-prevent-pull-to-refresh";

const itemList = Array.from({ length: 80000 }, (_, i) => `Item ${i + 1}`);

const FilteredList: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(itemList);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    startTransition(() => {
      const filtered = itemList.filter((item) => item.toLowerCase().includes(value.toLowerCase()));
      setFilteredItems(filtered);
    });
  };

  return (
    <div>
      <input type="text" value={query} onChange={handleChange} placeholder="Search..." />
      {isPending ? <p>Loading...</p> : null}
      <ul>
        {filteredItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default function Pagec() {
  return (
    <div className=" px-4 ">
      <FilteredList />
    </div>
  );
}
