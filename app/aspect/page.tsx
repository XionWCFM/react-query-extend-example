"use client";

import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import Image from "next/image";

export default function Page() {
  return (
    <div>
      <AspectRatio.Root ratio={21 / 29.7} className=" w-screen max-w-[430px]">
        <Image src={"/banner-shop-gather.png"} alt="" fill className=" object-cover" />
      </AspectRatio.Root>
    </div>
  );
}
