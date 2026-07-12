"use client"

import Link from "next/link";
import { logout } from "../actions/auth";
import { Session } from "next-auth";
import { Dispatch, SetStateAction, useState } from "react";

interface NavBar {
    session: Session
}

export default function NavBar({ session }: NavBar) {
    const [logoutWindow, setLogoutWindow] = useState(false)

    return (
        <nav className="flex justify-between items-center px-5 py-2 dark:bg-black">
            <Link href={"/"} className="text-2xl font-bold hover:text-(--accent-clr)">Home</Link>
            
            {logoutWindow
                && <LogoutWindow setShowWindowFn={setLogoutWindow} />
            }

            <div>
                {session?.user?.id
                    && <span onClick={_ => setLogoutWindow(true)}
                        className="hover:text-(--accent-clr)"
                    >Logout</span>
                }
            </div>
        </nav>
    )
}

interface LogoutWindow {
    setShowWindowFn: Dispatch<SetStateAction<boolean>>
}

const LogoutWindow = ({ setShowWindowFn }: LogoutWindow) => {
    return (
        <div className="popup-window">
            <div className="flex flex-col justify-evenly items-center
                            w-90 h-80 rounded-2xl bg-black"
            >
                <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-5">Confirm Logout?</h2>
                    <p>You trying to logout.</p>
                </div>

                <div className="flex justify-between w-50 
                                [&>span]:border [&>span]:rounded-2xl [&>span]:p-2"
                >
                    <span className="hover:bg-red-500"
                        onClick={_ => {
                            logout()
                            setShowWindowFn(false)
                        }}
                    >
                        Logout
                    </span>
                    
                    <span className="hover:bg-white hover:text-black"
                        onClick={_ => setShowWindowFn(false)}
                    >
                        Cancel
                    </span>
                </div>
            </div>
        </div>
    )
}