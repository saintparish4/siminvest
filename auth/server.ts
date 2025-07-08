import { auth } from "./auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
// import { betterAuth } from "better-auth";
// import { magicLink } from "better-auth/plugins";

export const authenticatedAction = async () => {
    "use server";
    
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return {
                error: "Unauthorized"
            };
        }

        return {
            session
        };
    } catch (error) {
        if (error instanceof APIError) {
            return {
                error: error.message,
                status: error.status
            };
        }
        return {
            error: "An unexpected error occurred"
        };
    }
}

export const signInAction = async (email: string, password: string) => {
    "use server";
    
    try {
        const { headers: responseHeaders, response } = await auth.api.signInEmail({
            returnHeaders: true,
            body: {
                email,
                password
            },
            headers: await headers()
        });

        return {
            success: true,
            headers: responseHeaders,
            data: response
        };
    } catch (error) {
        if (error instanceof APIError) {
            return {
                error: error.message,
                status: error.status
            };
        }
        return {
            error: "An unexpected error occurred"
        };
    }
}

export const verifyEmailAction = async (token: string) => {
    "use server";
    
    try {
        const response = await auth.api.verifyEmail({
            query: {
                token
            }
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        if (error instanceof APIError) {
            return {
                error: error.message,
                status: error.status
            };
        }
        return {
            error: "An unexpected error occurred"
        };
    }
}

// export const auth = betterAuth({
   //  plugins: [
      //  magicLink({
            // sendMagicLink: async ({ email, token, url }) => {
                // TODO: Send magic link to email
            // }
        // })
    // ]
// })