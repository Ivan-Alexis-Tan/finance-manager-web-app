"use client"

import Link from "next/link";
import { Session } from "next-auth";
import { useState } from "react";

import { logout } from "../actions/auth";
import { PopupWindow, usePopupWindow } from "../components/PopupWindows";

interface NavBar {
    session: Session
}

export default function NavBar({ session }: NavBar) {
    const [logoutWindow, setLogoutWindow] = useState(false)

    const { popupStates } = usePopupWindow({
        header: "Confirm Logout",
        details: `Logout ${session?.user?.name ?? "this account"}?`,
        confirmText: "Logout",
        onConfirm() {
            logout()
            setLogoutWindow(false)
        },
        onCancel() {
            setLogoutWindow(false)
        },
    })

    return (
        <nav className="flex justify-between items-center px-5 py-2 dark:bg-black">
            <Link href={"/"} className="text-2xl font-bold hover:text-(--accent-clr)">Home</Link>
            
            {logoutWindow
                && <PopupWindow popupStates={popupStates} />
            }

            <div>
                {session?.user?.id
                    && <div className="flex justify-between w-50 *:hover:text-(--accent-clr)">
                        <Link href={"user"}>{session.user.name}</Link>
                        
                        <span onClick={_ => setLogoutWindow(true)}
                        >Logout</span>
                    </div>
                }
            </div>
        </nav>
    )
}