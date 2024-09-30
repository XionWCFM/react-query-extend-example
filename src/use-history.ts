import { useSuspenseQuery } from "@tanstack/react-query";

export function useHistory(): History {
  return useSuspenseQuery({
    queryKey: ["history"],
    queryFn: async () => {
      if (typeof window !== "undefined") {
        return window.history;
      }
      return {} as History;
    },
  }).data;
}
