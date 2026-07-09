import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

import { authCofigs } from "./auth.configs";

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authCofigs,

    session: {
        strategy: "database",
    },

    providers: [
        Google,
        GitHub,
    ],

    callbacks: {
        ...authCofigs.callbacks,

        session({ session, user }) {
            // console.log(`user (root/auth.ts) =`, user)
            return session
        },
    }
})