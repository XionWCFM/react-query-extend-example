"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Dialog = (props: { open: boolean; onOpenChange: (bool: boolean) => void }) => {
  return null;
};

const useGodHooks = () => {
  const router = useRouter();
  const { data } = useQuery({ queryKey: ["hello"], queryFn: async () => "hello" });
  const mutation = useMutation({ mutationFn: async () => {} });
  const [open, onOpenChange] = useState(false);

  const handleCtaClick = async () => {
    onOpenChange(true);
  };

  const dialogSubmit = async () => {
    await mutation.mutateAsync();
    router.push("/hello");
  };

  return {
    data,
    handleCtaClick,
  };
};

export default function Page() {
  const { data, handleCtaClick } = useGodHooks();
  return (
    <div>
      <div>{data}</div>
      <button onClick={handleCtaClick}> 클릭</button>
    </div>
  );
}
