"use client";

import { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { getRepository } from "@/lib/data";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: true,
        retry: 1,
      },
    },
  });
}

/**
 * Bridges the repository's realtime stream into React Query — whenever the
 * data changes (staff edit, another tab, Supabase realtime) all queries are
 * invalidated so the public site updates instantly.
 */
function RealtimeBridge() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const unsubscribe = getRepository().subscribe(() => {
      queryClient.invalidateQueries();
    });
    return unsubscribe;
  }, [queryClient]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <RealtimeBridge />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "14px",
              border: "1px solid var(--color-line)",
              background: "var(--color-surface)",
              color: "var(--color-ink)",
              boxShadow: "0 8px 24px -12px rgba(33,30,26,0.18)",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
