"use client";

import {
  ErrorBoundary,
  useErrorBoundary,
  type ErrorBoundaryFallbackProps,
  type ErrorBoundaryProps,
} from "@suspensive/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
  return (
    <div>
      <ErrorBoundary
        onError={() => {
          toast.error("hello");
        }}
        fallback={ErrorFallback}
      >
        <CanErrorComponent />
      </ErrorBoundary>
    </div>
  );
}

const ErrorFallback = (props: ErrorBoundaryFallbackProps) => {
  return null;
};

const CanErrorComponent = () => {
  const { mutateAsync: request } = useMutation({
    mutationFn: async () => {
      if (Math.random() > 0.5) {
        throw new Error("Random error");
      }
      return "success";
    },
    throwOnError: true,
  });

  return (
    <div>
      <button onClick={() => request()} type="button">
        안녕하세요
      </button>
    </div>
  );
};
