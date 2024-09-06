"use client";
import { MutationOptions, useMutation } from "@tanstack/react-query";
import { createSafeAtom } from "@xionwcfm/jotai";
import { delay } from "es-toolkit";
import { atom } from "jotai";
import { useRouter } from "next/navigation";
import { wrap } from "@suspensive/react";
const [AuthContextProvider, authStore] = createSafeAtom(atom({ isLogin: false }));

export const NeedLoginPage = () => {
  return (
    <AuthContextProvider>
      <Component />
    </AuthContextProvider>
  );
};

const Component = () => {
  const [auth, setAuth] = authStore.useAtom();
  return null;
};
