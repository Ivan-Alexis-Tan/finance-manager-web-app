"use client"
import Link from "next/link";

import { capsEveryWord, dateFormatter } from "@/src/helpers/helperFn";
import { deleteTransaction } from "@/src/actions/actions";
import { TransactionsType } from "@/src/types/types";

type TransactionTable = { transactionData: TransactionsType[] }

export default function TransactionsTable({ transactionData = [] }: TransactionTable ) {
    return (
        transactionData.length >= 1
            ? <div className="flex justify-center mb-5">
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
                            {transactionData.map((data, idx) => (
                                <tr key={data.trans_no}>
                                    <td>
                                        <div className="flex gap-1">
                                            <Link href={`/records/${data.trans_no}/edit`}>✏️</Link>
                                            <button onClick={_ => {
                                                const confirmed = window.confirm(`Confirm delete "${data.details}".`)
                                                if (!confirmed) return null;
                                                
                                                deleteTransaction(Number(data.trans_no))
                                            }}>🗑️</button>
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