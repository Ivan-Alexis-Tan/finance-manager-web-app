"use client"
import Link from "next/link";

import { transactionsUncheckedCreateInput } from "@/src/generated/prisma/models";
import { capsEveryWord, dateFormatter } from "@/src/helpers/helperFn";
import { deleteTransaction } from "@/src/actions/actions";

type TransactionData = transactionsUncheckedCreateInput[]

export default function TransactionsTable({ transactionData = [] }: { transactionData: TransactionData }) {
    return (
        transactionData.length >= 1
            ? <>
                <table className="w-full bg-gray-700 border-collapse mb-5">
                    <thead>
                        <tr className="border-b-[1px] border-b-gray-900 font-bold">
                            <td></td>
                            <td>Date</td>
                            <td>Details</td>
                            <td>Amount</td>
                            <td>Transaction</td>
                            <td>Transaction Mode</td>
                            <td>Category</td>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionData.map((data, idx) => (
                            <tr key={data.trans_no}>
                                <td>
                                    <Link href={`/records/${data.trans_no}/edit`}>✏️</Link>
                                    <button onClick={_ => {
                                        const confirmed = window.confirm(`Confirm delete "${data.details}".`)
                                        if (!confirmed) return null;
                                        
                                        deleteTransaction(Number(data.trans_no))
                                    }}>🗑️</button>
                                </td>
                                <td>{dateFormatter(`${data.date}`)}</td>
                                <td>{data.details}</td>
                                <td>₱{(data.amount)?.toLocaleString()}</td>
                                <td>{data.transaction}</td>
                                <td>{data.transaction_mode}</td>
                                <td>{capsEveryWord(data.category)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
            : <div>No transaction to show</div>
    )
}