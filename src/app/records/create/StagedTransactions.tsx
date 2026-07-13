"use client"

import { useState } from "react"

import { TransactionsType } from "@/src/types/types"

import { capsEveryWord, dateFormatter } from "@/src/helpers/helperFn"
import { createManyTransactions } from "@/src/actions/actions"

import { PopupStatesType, PopupWindow, usePopupWindow } from "../../components/PopupWindows"

interface StagedTransactions {
    staged: Omit<NonNullable<TransactionsType>, "userId">[]
    removeItem: (itemId: number) => void
    removeAll: () => void
}

const popupStateDefault: PopupStatesType = {
    header: "",
    details: "",
    onConfirm: () => {return},
    onCancel: () => {return},
}

export default function StagedTransactions({ staged, removeItem, removeAll }: StagedTransactions) {
    const [showPopUp, setShowPopup] = useState(false)
    const { popupStates, setPopupWindow } = usePopupWindow(popupStateDefault)

    return (
        // Staged UI
        (staged.length >= 1)
            ? <div className="flex flex-col gap-2 max-w-4xl w-full">
                { showPopUp && <PopupWindow popupStates={popupStates} /> }

                {/* Upload and Delete Transaction */}
                <div className="flex gap-10 items-center p-2 [&>button]:hover:text-(--accent-clr)">
                    <button title="Upload items"
                        onClick={_ => {
                            setShowPopup(true)
                            setPopupWindow({
                                header: "Upload All Entries?",
                                details: "You about to upload all staged entries.",
                                confirmHover: "confirm",
                                onConfirm() {
                                    createManyTransactions(staged)
                                    removeAll()
                                    setShowPopup(false)
                                },
                                onCancel() {
                                    setShowPopup(false)
                                },
                            })
                        }}
                    >📨 Upload</button>

                    <button title="Delete all items"
                        onClick={_ => {
                            setShowPopup(true)
                            setPopupWindow({
                                header: "Delete All Entries?",
                                details: "You about to delete all staged entries.",
                                confirmText: "Delete",
                                confirmHover: "warning",
                                onConfirm() {
                                    removeAll()
                                    setShowPopup(false)
                                },
                                onCancel() {
                                    setShowPopup(false)
                                },
                            })
                        }}
                    >🗑️ Delete all</button>
                </div>
                
                {/* Transaction Table */}
                <div className="w-full overflow-x-auto mb-3 [&_td]:p-0.75 [&_td]:max-w-40">
                    <table className="min-w-175 w-full bg-gray-700 border-collapse mb-5">
                        <thead>
                            <tr className="border-b border-b-gray-900 font-bold">
                                <td></td>
                                <td>Date</td>
                                <td className={`max-w-50`}>Details</td>
                                <td>Quantity</td>
                                <td>Amount</td>
                                <td>Total</td>
                                <td>Transaction</td>
                                <td>Transaction Mode</td>
                                <td>Category</td>
                            </tr>
                        </thead>
                        <tbody>
                            {staged.map(s => (
                                <tr key={s.trans_no}>
                                    <td>
                                        <span title={`Delete ${s.details}`}
                                            onClick={_ => {
                                                setShowPopup(true)
                                                setPopupWindow({
                                                    header: "Confirm Delete",
                                                    details: <>You about to delete "<i>{s.details}</i>"</>,
                                                    confirmText: "Delete",
                                                    onConfirm() {
                                                        removeItem(s.trans_no as number)
                                                        setShowPopup(false)
                                                    },
                                                    onCancel() {
                                                        setShowPopup(false)
                                                    },
                                                })
                                            }}
                                        >🗑️</span>
                                    </td>
                                    <td>{dateFormatter(s.date.toString())}</td>
                                    <td className={`wrap-break-word`}>{s.details}</td>
                                    <td>{s.quantity}</td>
                                    <td>{s.amount}</td>
                                    <td>{s.total}</td>
                                    <td>{capsEveryWord(s.transaction)}</td>
                                    <td>{capsEveryWord(s.transaction_mode)}</td>
                                    <td>{capsEveryWord(s.category)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
            : <div className="text-center">No transaction to be committed.</div>
    )
}