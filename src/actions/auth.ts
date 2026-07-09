"use server"

import { signIn, signOut } from "@/auth";

export async function SigninWithGoogle() {
    await signIn("google", {redirectTo: "/records"})
}

export async function SigninWithGithub() {
    await signIn("github", {redirectTo: "/records"})
}

export async function logout() {
    await signOut({ redirectTo: "/"})
}