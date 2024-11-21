"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useVirtualizedCarousel } from "./lib";
import { Slide } from "./component";
import { Carousel } from "./component";

const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Page() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }); // 기본 옵션 추가

  const { virtualizedIndices, currentIndex } = useVirtualizedCarousel(emblaApi, {
    buffer: 1,
    total: data,
  });

  return (
    <div>
      <div className=" flex flex-col">
        <span>currIndex: {currentIndex}</span>
        <span>virtualizedIndices: {virtualizedIndices.join(", ")}</span>
      </div>

      <Carousel ref={emblaRef}>
        {virtualizedIndices.map((index) => (
          <Slide key={index}>{data.at(index)}</Slide>
        ))}
      </Carousel>
    </div>
  );
}
