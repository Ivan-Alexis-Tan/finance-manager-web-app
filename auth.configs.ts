import { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./src/lib/prisma";

const publicRoutes = ["/"]

export const authCofigs = {
    pages: {
        signIn: "/"
    },
    callbacks: {
        authorized({ auth, request: {nextUrl} }) {
            const isLoggedIn = !!auth?.user
            const isInPublicRoute = publicRoutes.includes(nextUrl.pathname)
            
            if (!isInPublicRoute) {
                if (!isLoggedIn) return NextResponse.redirect(`${nextUrl.origin}/`);
                return true 
            }
            if (isLoggedIn) return NextResponse.redirect(`${nextUrl.origin}/records`);
            
            return true
        }
    },
    adapter: PrismaAdapter(prisma),
    providers: [],
} satisfies NextAuthConfig