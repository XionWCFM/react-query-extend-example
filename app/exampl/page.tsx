import { MemoizedComponent, UnmemoComponent, ExampleType } from "../../src/rerender/example";

const list: ExampleType[] = Array.from({ length: 200000 }).map((_, i) => ({
  id: i.toString(),
  content: `Hello ${i}`,
  done: false,
}));

export default function Page() {
  return (
    <div>
      <MemoizedComponent list={list} />
      {/* <UnmemoComponent list={list} /> */}
    </div>
  );
}
