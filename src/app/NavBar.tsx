"use client"

import Link from "next/link";
import { logout } from "../actions/auth";
import { Session } from "next-auth";

interface NavBar {
    session: Session
}

export default function NavBar({ session }: NavBar) {
    return (
        <nav className="flex justify-between items-center px-5 py-2 dark:bg-black">
            <Link href={"/"} className="text-2xl font-bold hover:text-(--accent-clr)">Home</Link>
            
            <div>
                {session?.user?.id
                    && <span onClick={_ => logout()}
                        className="hover:text-(--accent-clr)"
                    >Logout</span>
                }
            </div>
        </nav>
    )
}