import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "https://hex-phi.vercel.app/api/auth",
})

export const revokeSession = async (token: string) => await authClient.revokeSession({ token });