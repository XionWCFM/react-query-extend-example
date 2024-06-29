"use client";
import { ReactNode, createContext, useContext } from "react";
import { SingleFlight } from "./single-flight";
import { useMutation } from "@tanstack/react-query";

const SingleFlightContext = createContext<null | SingleFlight>(null);

type SingleFlightProviderType = {
  children: ReactNode;
  singleFlight: SingleFlight;
};

export const SingleFlightProvider = (props: SingleFlightProviderType) => {
  const { children, singleFlight } = props;
  return <SingleFlightContext.Provider value={singleFlight}>{children}</SingleFlightContext.Provider>;
};

export const useSingleFlight = () => {
  const context = useContext(SingleFlightContext);
  if (context === null) {
    throw new Error("useSingleFlight must be used within a SingleFlightProvider");
  }
  return context;
};

interface A {
  ok?: boolean;
}

const a: A = { ok: undefined };
const b: A = {};

const useSingleFlightMutation = () => {
  const singleFlight = useSingleFlight();
  const mutation = useMutation({
    mutationFn: async () => {
      console.log("helloworld");
      return "hello";
    },
  });
  const execute = singleFlight.execute({ key: ["hello"], fn: mutation.mutateAsync });

  return;
};
