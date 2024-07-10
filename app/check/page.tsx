"use client";

import { useCheckList } from "~/__tests__/use-checklist";

export default function Page() {
  const check = useCheckList([
    { id: "1", checked: false, externalValue: "hello" },
    { id: "2", checked: false, externalValue: "world" },
    { id: "3", checked: false, externalValue: "hi" },
    { id: "4", checked: false, externalValue: "h" },
  ]);

  return (
    <div className=" m-40">
      <div className=" flex flex-col gap-y-4">
        <input
          className=" bg-purple-100"
          id="all"
          type={"checkbox"}
          checked={check.isAllChecked()}
          onChange={() => {
            check.toggleAll();
          }}
        />
        {check.list.map(({ id, checked }) => (
          <input
            key={id}
            id={id}
            checked={checked}
            type={"checkbox"}
            onChange={() => {
              check.toggle(id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
