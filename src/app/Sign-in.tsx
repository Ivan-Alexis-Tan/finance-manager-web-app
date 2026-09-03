"use client"

import Image from "next/image"
import { SigninWithGithub, SigninWithGoogle } from "../actions/auth"
import { useState } from "react"
import { capsEveryWord } from "../helpers/helperFn"

export default function Signin() {
    const [loading, setLoading] = useState(false)
    const [method, setMethod] = useState("")

    const signInMethods = {
        google: SigninWithGoogle,
        github: SigninWithGithub,
    }

    async function SignIn(method: keyof (typeof signInMethods)) {
        setLoading(true)
        setMethod(method)
        
        await signInMethods[method]()
    }

    function cancelSignin() {
        setLoading(false)
        setMethod("")
    }

    return (
        <div className="p-5 bg-(--fg-tint-clr) rounded-2xl
                        [&_button]:gap-3 [&_button]:p-2 [&_button]:flex [&_button]:flex-wrap
                        [&_button]:justify-center [&_button]:items-center [&_button]:hover:bg-(--accent-clr)
                        [&_button]:rounded-xl [&_button]:bg-foreground [&_button]:text-background"
        >
            {loading
                ? <div className="flex justify-evenly items-center">
                    <h2 className="text-2xl font-bold">Signing in using {capsEveryWord(method)}...</h2>
                    <button onClick={cancelSignin}>Cancel</button>
                </div>
                : <div className="flex flex-wrap justify-center items-center gap-5">
                    <h2 className="text-2xl font-bold">Continue with:</h2>

                    <div className="flex flex-wrap justify-center gap-5"
                    >
                        <button onClick={_ => SignIn("google")} disabled={loading}>
                            <Image src={"/google-logo.png"} alt="google-logo" width={30} height={30} />
                            <span>Google</span>
                        </button>

                        <button onClick={_ => SignIn("github")} disabled={loading}>
                            <Image src="/github-logo.png" alt="github-logo" width={30} height={30} />
                            <span>GitHub</span>
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}