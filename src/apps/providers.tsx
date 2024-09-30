"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, Suspense, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "jotai";
export const Providers = ({ children }: PropsWithChildren) => {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<Suspense>
			<Provider>
				<QueryClientProvider client={queryClient}>
					<ReactQueryDevtools initialIsOpen={false} />
					{children}
				</QueryClientProvider>
			</Provider>
		</Suspense>
	);
};
