"use client"
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";

import { capsEveryWord, dateFormatter } from "@/src/helpers/helperFn";
import { deleteTransaction } from "@/src/actions/actions";
import { TransactionsType } from "@/src/types/types";

type TransactionTable = { transactionData: TransactionsType[] }

type DelWindowState = {
    show: boolean
    itemId: number
    itemName: string
}
const DelWindowDefault: DelWindowState = {
    show: false,
    itemId: 0,
    itemName: ""
}

export default function TransactionsTable({ transactionData = [] }: TransactionTable ) {
    const [delWindow, setDelWindow] = useState<DelWindowState>(DelWindowDefault)

    return (
        transactionData.length >= 1
            ? <div className="flex justify-center mb-5">
                <div className="max-w-300 overflow-x-auto px-5 pb-2 bg-gray-700 rounded border-collapse">
                    
                    {delWindow.show
                        && <ConfmDelWindow 
                            itemName={delWindow.itemName} 
                            itemId={delWindow.itemId}
                            setDelWindow={setDelWindow}
                        />
                    }
                    
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
                            {transactionData.map((data, idx) => (
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
                                                    setDelWindow({
                                                        show: true,
                                                        itemId: data.trans_no as number,
                                                        itemName: data.details
                                                    })}
                                                }
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

type ConfmDelWindow = {
    itemId: number
    itemName: string
    setDelWindow: Dispatch<SetStateAction<DelWindowState>>
}

const ConfmDelWindow = ({ itemName, itemId, setDelWindow }: ConfmDelWindow) => {
    return (
        <div className="popup-window">
            <div className="flex flex-col justify-evenly items-center 
                            w-90 h-80 rounded-2xl bg-black">
                <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-5">Confirm Delete?</h2>
                    <p>You try to delete "<i>{itemName}</i>"</p>
                </div>

                <div className="flex justify-between w-50
                                [&>span]:p-2 [&>span]:rounded-2xl [&>span]:border"
                >
                    <span className="hover:bg-red-500"
                        onClick={_ => {
                            deleteTransaction(itemId)
                            setDelWindow(DelWindowDefault)
                        }}
                    >
                        Delete
                    </span>
                    <span className="hover:bg-white hover:text-black"
                        onClick={_ => setDelWindow(DelWindowDefault)}
                    >
                        Cancel
                    </span>
                </div>
            </div>
        </div>
    )
}