"use client"

import { capsEveryWord, dateFormatter } from "@/src/helpers/helperFn"
import { TransactionsType } from "@/src/types/types"

interface StagedTransactions {
    staged: Omit<NonNullable<TransactionsType>, "userId">[]
    removeItem: (itemId: number) => void
    removeAll: () => void
}

export default function StagedTransactions({ staged, removeItem, removeAll }: StagedTransactions) {
    return (
        // {/* Staged UI */}
        (staged.length >= 1)
            ? <div className="flex flex-col gap-2 max-w-4xl w-full">

                {/* Upload and Delete Transaction */}
                <div className="flex gap-10 items-center p-2">
                    <button title="Upload items"
                        onClick={_ => {
                            const confirmed = window.confirm("Confirm upload items.")
                            if (!confirmed) return null
                            
                            // createManyTransactions(staged)
                            removeAll()
                        }}
                    >📨 Upload</button>

                    <button title="Delete all items"
                        onClick={_ => {
                            const confirmed = window.confirm("Confirm delete all items.")
                            if (!confirmed) return null;
                            removeAll()
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
                                                const confirmed = window.confirm(`Confirm delete "${s.details}"`)
                                                if (!confirmed) return
                                                removeItem(s.trans_no as number)
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