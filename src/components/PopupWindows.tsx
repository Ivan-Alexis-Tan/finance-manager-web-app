"use client"

import React, { useState } from "react"

export type PopupStatesType = {
    header: string
    details: React.ReactNode
    onConfirm: () => void
    onCancel: () => void
    confirmText?: string,
    confirmHover?: "confirm" | "warning"
    cancelText?: string,
}

export function usePopupWindow({ 
    header, 
    details, 
    onConfirm, 
    onCancel, 
    confirmText, 
    confirmHover, 
    cancelText,
}: PopupStatesType
) {
    const [state, setState] = useState<PopupStatesType>(
        { header, details, onConfirm, onCancel, confirmText, confirmHover, cancelText }
    )

    return {
        popupStates: state,
        setPopupWindow: setState,
    }
}

type PopupWindowProps = { popupStates: PopupStatesType}

export const PopupWindow = ({ popupStates }: PopupWindowProps) => {
    const { header, details, onConfirm, onCancel, confirmText, confirmHover, cancelText} = popupStates;

    return (
        <div className="popup-window">
            <div className="popup-container">
                <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-5">{header}</h2>
                    <p>{details}</p>
                </div>

                <div className="flex justify-between w-50
                                [&>span]:p-2 [&>span]:rounded-2xl [&>span]:border"
                >
                    <span className={
                            confirmHover === "confirm" 
                                ? "hover:bg-(--accent-clr) hover:text-black" 
                                : "hover:bg-red-500"
                        }
                        onClick={onConfirm}
                    >
                        {confirmText ?? "Confirm"}
                    </span>

                    <span className="hover:bg-white hover:text-black"
                        onClick={onCancel}
                    >
                        {cancelText ?? "Cancel"}
                    </span>
                </div>
            </div>
        </div>
    )
}