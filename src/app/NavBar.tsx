"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

import { Session } from "next-auth";

import { logout } from "../actions/auth";
import { PopupWindow, usePopupWindow } from "../components/PopupWindows";

import Spinner from "../components/Spinner";

interface NavBar {
    session: Session
}

export default function NavBar({ session }: NavBar) {
    const [logoutWindow, setLogoutWindow] = useState(false)
    const [loadLogout, setLoadLogout] = useState(false)

    useEffect(() => {
        if (!session?.user?.id) setLoadLogout(false)
    }, [session?.user?.id])

    const { popupStates } = usePopupWindow({
        header: "Confirm Logout",
        details: `Logout ${session?.user?.name ?? "this account"}?`,
        confirmText: "Logout",
        onConfirm() {
            setLogoutWindow(false)
            setLoadLogout(true)
            logout()
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

            {loadLogout
                && <div className="w-full h-full fixed top-0 left-0 flex justify-center items-center bg-transparent">
                    <div className="w-50 h-50 sm:w-100 sm:h-100 gap-5 flex flex-col justify-center items-center rounded-2xl bg-foreground border border-white">
                        <Spinner className="" />
                        <h3 className="text-xl font-bold text-background">Logging out...</h3>
                    </div>
                </div>
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