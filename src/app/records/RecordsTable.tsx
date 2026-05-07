"use client"
import Link from "next/link";

import { transactionsUncheckedCreateInput } from "@/src/generated/prisma/models";
import { capsEveryWord, dateFormatter } from "@/src/helpers/helperFn";
import { deleteTransaction } from "@/src/actions/actions";

type TransactionData = transactionsUncheckedCreateInput[]
const tdStyles = "p-[3px] max-w-[10rem]"

export default function TransactionsTable({ transactionData = [] }: { transactionData: TransactionData }) {
    return (
        transactionData.length >= 1
            ? <>
                <table className="w-full bg-gray-700 border-collapse mb-5">
                    <thead>
                        <tr className="border-b-[1px] border-b-gray-900 font-bold">
                            <td></td>
                            <td className={`${tdStyles}`}>Date</td>
                            <td className={`${tdStyles}`}>Details</td>
                            <td className={`${tdStyles}`}>Amount</td>
                            <td className={`${tdStyles}`}>Transaction</td>
                            <td className={`${tdStyles}`}>Transaction Mode</td>
                            <td className={`${tdStyles}`}>Category</td>
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
                                <td className={`${tdStyles}`}>{dateFormatter(`${data.date}`)}</td>
                                <td className={`${tdStyles}`}>{data.details}</td>
                                <td className={`${tdStyles}`}>₱{(data.amount)?.toLocaleString()}</td>
                                <td className={`${tdStyles}`}>{capsEveryWord(data.transaction)}</td>
                                <td className={`${tdStyles}`}>{capsEveryWord(data.transaction_mode)}</td>
                                <td className={`${tdStyles}`}>{capsEveryWord(data.category)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
            : <div>No transaction to show</div>
    )
}