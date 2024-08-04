"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
  DrawerTrigger,
} from "~/src/@deprecated/drawer/drawer";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import Image from "next/image";

export default function Home() {
  const [open, onOpenChange] = useState(false);
  return (
    <div className="">
      <AspectRatio.Root ratio={450 / 80} className=" w-[38vw]">
        <Image className=" " fill alt="hello" src={"/banner-shop-gather.png"} />
      </AspectRatio.Root>

      <Drawer open={open} onOpenChange={onOpenChange} disablePreventScroll={false}>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <div className=" h-[400px] overflow-y-scroll">
              <div className=" min-h-screen  bg-purple-100">
                <button>Submit</button>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <div className=" h-screen"></div>
      <div className=" h-screen"></div>
    </div>
  );
}
