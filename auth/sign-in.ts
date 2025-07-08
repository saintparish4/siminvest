import { authClient } from "./auth-client";

export const signIn = async (email: string, password: string) => await authClient.signIn.email({
    email,
    password,
    callbackURL: "/",
    rememberMe: false,
}, {
    onRequest: () => {
        // show loading state
    },
    onSuccess: () => {
        // redirect to home page
    },
    onError: () => {
        // show error message  
    },
});