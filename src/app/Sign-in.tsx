"use client"

import Image from "next/image"
import { SigninWithGithub, SigninWithGoogle } from "../actions/auth"

export default function Signin() {
    return (
        <div className="flex flex-wrap justify-center items-center gap-5 p-5 bg-(--fg-tint-clr) rounded-2xl"
        >
            <h2 className="text-2xl font-bold">Continue with:</h2>

            <div className="flex justify-center gap-10
                            [&>button]:flex [&>button]:gap-3 [&>button]:items-center [&>button]:p-2
                            [&>button]:hover:bg-(--accent-clr)
                            [&>button]:rounded-xl [&>button]:bg-foreground [&>button]:text-background"
            >
                <button onClick={_ => SigninWithGoogle()}>
                    <Image src={"/google-logo.png"} alt="google-logo" width={30} height={30} />
                    <span>Google</span>
                </button>

                <button onClick={_ => SigninWithGithub()}>
                    <Image src="/github-logo.png" alt="github-logo" width={30} height={30} />
                    <span>GitHub</span>
                </button>
            </div>
        </div>
    )
}