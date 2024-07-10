"use client";

import { RecursiveCheckList, useRecursiveCheckList } from "~/__tests__/use-recursive-check-list";

const initialList = [
  {
    id: 1,
    checked: false,
    children: [
      { id: 2, checked: false },
      { id: 3, checked: false, children: [{ id: 4, checked: false }] },
    ],
  },
  { id: 5, checked: false },
];

const CheckListItem: React.FC<{ item: RecursiveCheckList; toggle: (id: RecursiveCheckList["id"]) => void }> = ({
  item,
  toggle,
}) => {
  return (
    <div style={{ marginLeft: 20 }}>
      <label>
        <input type="checkbox" checked={item.checked} onChange={() => toggle(item.id)} />
        {`Item ${item.id}`}
      </label>
      {item.children && (
        <div>
          {item.children.map((child) => (
            <CheckListItem key={child.id} item={child} toggle={toggle} />
          ))}
        </div>
      )}
    </div>
  );
};

const CheckList: React.FC = () => {
  const { list, checkAll, uncheckAll, toggleAll, toggle, isAllChecked, getCheckedIds, isChecked } =
    useRecursiveCheckList(initialList);

  return (
    <div className=" flex flex-col gap-y-4">
      <button onClick={checkAll}>Check All</button>
      <button onClick={uncheckAll}>Uncheck All</button>
      <button onClick={toggleAll}>toggle All</button>
      <button onClick={() => toggle(1)}>Toggle Item 1</button>
      <button onClick={() => toggle(3)}>Toggle Item 3</button>
      <div className="">is Checked id: 1{isChecked(1) ? "true" : "false"}</div>
      <div>All checked: {isAllChecked() ? "Yes" : "No"}</div>
      <div>Checked IDs: {getCheckedIds().join(", ")}</div>
      <div>
        {list.map((item) => (
          <CheckListItem key={item.id} item={item} toggle={toggle} />
        ))}
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div>
      <CheckList />
    </div>
  );
}
