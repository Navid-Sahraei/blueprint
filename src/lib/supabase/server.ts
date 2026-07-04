import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { supabaseConfigured } from "./client";

/**
 * Server-component client. Returns null when Supabase env vars are absent.
 */
export async function createClient() {
  if (!supabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — proxy refreshes sessions.
          }
        },
      },
    },
  );
}
