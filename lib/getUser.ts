// src/lib/getUser.ts
// -----------------------------------------------------------------
// A thin wrapper around Better-Auth so the rest of your codebase
// never has to touch its SDK directly.
//
// Returned object shape matches what Prisma expects elsewhere:
//
//   {
//     id:    string,
//     email: string,
//     role:  "INVESTOR" | "FOUNDER" | "ADMIN"
//   }
//
// If unauthenticated ➜ returns null.
// -----------------------------------------------------------------

import { cookies, headers } from "next/headers";

type UserRole = "INVESTOR" | "FOUNDER" | "ADMIN";

// Mock implementation for development
const betterAuth = {
  verifySession: async (_token: string) => {
    // For demo purposes, always return a mock user
    return {
      id: "demo-user-id",
      email: "demo@example.com",
      role: "INVESTOR" as UserRole
    };
  },
  verifyToken: async (_token: string) => {
    return betterAuth.verifySession(_token);
  }
};

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
};

export async function getUser(req?: Request): Promise<SessionUser | null> {
  /* -------------------------------------------------------------
   * 1) Try the Better-Auth session cookie  (web browser flow)
   * ----------------------------------------------------------- */
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("ba_session")?.value;

  if (sessionCookie) {
    try {
      const user = await betterAuth.verifySession(sessionCookie);
      if (user) return user as SessionUser;            // { id, email, role }
    } catch {
      // fall through to header check
    }
  }

  /* -------------------------------------------------------------
   * 2) Try an Authorization: Bearer <token> header   (API calls)
   * ----------------------------------------------------------- */
  const authHeader = req?.headers?.get("authorization") ?? (await headers()).get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (token) {
    try {
      const user = await betterAuth.verifyToken(token); // or `verifyJwt`
      if (user) return user as SessionUser;
    } catch {
      /* ignore — treated as unauthenticated */
    }
  }

  /* -------------------------------------------------------------
   * No valid session found
   * ----------------------------------------------------------- */
  return null;
}
