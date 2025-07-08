import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from '../generated/prisma'
import { resend } from "../lib/resend";

const prisma = new PrismaClient();



export const auth = betterAuth({
    appName: " Hex ",
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        minPasswordLength: 8,
        maxPasswordLength: 20,
        requireEmailVerification: false, // TODO: change to true after testing
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await resend.emails.send({
                from: "Hex <onboarding@resend.dev>", // TODO: change to actual email
                to: user.email,
                subject: "Email Verification",
                html: `Click the link to verify your email: ${url}`, // TODO: change to actual email verification template, will use "React" for sending email template later on
            });
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string, // TODO: change to actual client id - NON-FUNCTIONAL
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // TODO: change to actual client secret - NON-FUNCTIONAL
        }, 
    }
});