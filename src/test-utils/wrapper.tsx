import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, Suspense } from "react";

const testingClient = () => new QueryClient({ defaultOptions: { queries: { retry: 0 } } });

export const wrapper =
  () =>
  // eslint-disable-next-line react/display-name
  ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={testingClient()}>
      <Suspense fallback={<div data-testid="loading">loading</div>}>{children}</Suspense>
    </QueryClientProvider>
  );
