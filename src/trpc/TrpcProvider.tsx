"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, getFetch, loggerLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { api as trpc } from "@/trpc/utils";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: 'http://localhost:3000/api/trpc',
            // You can pass any HTTP headers you wish here
            async headers() {
              return {
                // authorization: getAuthCookie(),
              };
            },
          }),
        ],
      }),
    );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
