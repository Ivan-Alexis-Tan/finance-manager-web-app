"use client"
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";

import { capsEveryWord, dateFormatter } from "@/src/helpers/helperFn";
import { deleteTransaction } from "@/src/actions/actions";
import { TransactionsType } from "@/src/types/types";
import { PopupWindow, usePopupWindow } from "@/src/components/PopupWindows";

type TransactionTable = { transactionData: TransactionsType[] }

export default function TransactionsTable({ transactionData = [] }: TransactionTable ) {
    const [showPopup, setShowPopup] = useState<Boolean>(false)

    const { popupStates, setPopupWindow } = usePopupWindow({
        header: "Confirm Delete",
        details: "",
        confirmText: "Delete",
        onConfirm() {},
        onCancel() { setShowPopup(false) },
    });

    return (
        transactionData.length >= 1
            ? <div className="flex justify-center mb-5">

                {showPopup
                    && <PopupWindow popupStates={popupStates} />
                }

                <div className="max-w-300 overflow-x-auto px-5 pb-2 bg-gray-700 rounded border-collapse">
                    <table className="w-full min-w-md [&_td]:p-1">
                        <thead>
                            <tr className="border-b border-b-gray-900 font-bold">
                                <td></td>
                                <td>Date</td>
                                <td>Details</td>
                                <td>Quantity</td>
                                <td>Amount</td>
                                <td>Total</td>
                                <td>Transaction</td>
                                <td>Transaction Mode</td>
                                <td>Category</td>
                            </tr>
                        </thead>
                        <tbody>
                            {transactionData.map(data => (
                                <tr key={data.trans_no}>
                                    <td>
                                        <div className="flex gap-1">
                                            <Link title="Edit"
                                                href={`/records/${data.trans_no}/edit`}
                                            >
                                                ✏️
                                            </Link>
                                            <button title="Delete"
                                                onClick={_ => {
                                                    setShowPopup(true)
                                                    setPopupWindow(p => ({
                                                        ...p,
                                                        details: <>You trying to delete "<i>{data.details}</i>"</>,
                                                        onConfirm() {
                                                            deleteTransaction(data.trans_no as number)
                                                            setShowPopup(false)
                                                        }
                                                    }))
                                                }}
                                            >🗑️</button>
                                        </div>
                                    </td>
                                    <td>{dateFormatter(`${data.date}`)}</td>
                                    <td>{data.details}</td>
                                    <td className="text-center">{data.quantity}</td>
                                    <td>₱{(data.amount)?.toLocaleString()}</td>
                                    <td>₱{Number(data.total)}</td>
                                    <td>{capsEveryWord(data.transaction)}</td>
                                    <td>{capsEveryWord(data.transaction_mode)}</td>
                                    <td>{capsEveryWord(data.category)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            : <div>No transaction to show</div>
    )
}