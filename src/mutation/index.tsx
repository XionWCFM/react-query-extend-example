import { useMutation } from "@tanstack/react-query";
import { delay } from "es-toolkit";

export const exampleMutationOptions = () => ({
  mutationKey: ["example"],
  mutationFn: async () => {
    await delay(5000);
    return {
      id: "1324",
      name: "테스트용도입니다.",
    };
  },
});

export const useExampleMutation = () => {
  return useMutation(exampleMutationOptions());
};


