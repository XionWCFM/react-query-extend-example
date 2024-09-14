/* eslint-disable react/display-name */
"use client";

import { ErrorBoundary } from "@suspensive/react";
import { SuspenseInfiniteQuery } from "@suspensive/react-query";
import React, { Suspense } from "react";
import { InView } from "./inview";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { SlowItem } from "./slow";
import { Virtuoso, VirtuosoGrid } from "react-virtuoso";
const dummyData = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
}));

const ITEMS_PER_PAGE = 40; // 10행 * 4열 = 40

const fetchItems = async ({ pageParam = 0 }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const start = pageParam * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const items = dummyData.slice(start, end);
  return {
    items,
    nextPage: end < dummyData.length ? pageParam + 1 : undefined,
  };
};

const itemsInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: ["items"],
  queryFn: fetchItems,
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextPage,
});

const GridItem: React.FC<{ item: { id: number; title: string } }> = ({ item }) => (
  <div className="p-4 border border-gray-200 rounded">
    <SlowItem id={item.id.toString()} title={item.title} />
  </div>
);

const InfiniteScrollList: React.FC = () => {
  return (
    <ErrorBoundary fallback={({ error }) => <div>에러가 발생했습니다: {error.message}</div>}>
      <Suspense fallback={<div>로딩 중...</div>}>
        <SuspenseInfiniteQuery {...itemsInfiniteQueryOptions}>
          {({ data, fetchNextPage }) => {
            const allItems = data.pages.flatMap((page) => page.items);

            return (
              <div className="h-[600px] scrollbar-hide ">
                <VirtuosoGrid
                  className=" h-full"
                  totalCount={allItems.length}
                  overscan={200}
                  components={{
                    List: React.forwardRef((props, ref) => (
                      <div {...props} ref={ref} className="grid grid-cols-4 gap-4" />
                    )),
                    Item: React.forwardRef((props, ref) => <div {...props} ref={ref} className="h-[150px]" />),
                    Footer: () => (
                      <InView onIntersectStart={() => fetchNextPage()}>
                        <div className="bg-red-800 text-white p-2 text-center">더 불러오기</div>
                      </InView>
                    ),
                  }}
                  itemContent={(index) => <GridItem item={allItems[index]} />}
                />
              </div>
            );
          }}
        </SuspenseInfiniteQuery>
      </Suspense>
    </ErrorBoundary>
  );
};

export default function Page() {
  return (
    <div>
      <InfiniteScrollList />
    </div>
  );
}
