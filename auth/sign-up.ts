import { authClient } from "./auth-client";

export const signUp = async (email: string, password: string, name: string) => await authClient.signUp.email({
    email,
    password,
    name,
    callbackURL: "/",
  },
  {
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
