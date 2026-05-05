"use client"

import { useActionState, useState } from "react"
import Link from "next/link"

import { createTransactions } from "@/src/actions/actions"
import { capsEveryWord, dateFormatter } from "@/src/helpers/helperFn"

import TransactionFormFields from "./TransactionFormFields"
import CreateManyTransactionForm, { useManyTransactions } from "./CreateManyTransactionForm"

interface CreateTransactionCategories {
    categories: string[]
}

const activeModeStyle = "text-[hsl(0,0%,0%)] bg-[hsl(0,0%,100%)] font-bold"

export default function CreateTransactionForm({ categories = [] }: CreateTransactionCategories) {
    const [state, formAction] = useActionState(createTransactions, { message: null })
    const [createMany, setCreateMany] = useState(() => {
        const draftLength = JSON.parse(localStorage.getItem("staged_transactions") as string).length
        return (draftLength >= 1) ? true : false
    })
    
    const { stage, removeAll, setStates } = useManyTransactions()

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-evenly items-center mt-3 mb-7 p-1 rounded-full w-70 text-center bg-[hsl(0,0%,13%)]">
                <p className={`${!createMany && activeModeStyle} p-2 rounded-full`}
                    onClick={_ => setCreateMany(false)}
                >Create One</p>

                <p className={`${createMany && activeModeStyle} p-2 rounded-full `}
                    onClick={_ => setCreateMany(true)}
                >Create Many</p>
            </div>
            
            {!createMany 
                ? <form action={formAction}
                    className="flex flex-col"
                >
                    <TransactionFormFields errState={state} categories={categories} />
                    
                    <div className="flex justify-between items-center pt-5">
                        <Link href={"/records"} className="hover:font-bold hover:text-[hsl(54,100%,50%)]" title="Back to records page">
                            <strong>&larr;</strong> Records
                        </Link>
                        <button title="Save transaction" className="text-xl">💾</button>
                    </div>

                </form>
                : <div className="flex justify-between gap-15 w-6xl">
                    {stage.length >= 1
                        ? <div className="flex flex-col items-start gap-2 w-full border-1 border-white">
                            <div className="flex gap-5">
                                <button title="Upload items"
                                >📨</button>

                                <button title="Delete all items"
                                    onClick={_ => {
                                        const confirmed = window.confirm("Confirm delete all items.")
                                        if (!confirmed) return null;
                                        removeAll()
                                    }}
                                >🗑️</button>
                            </div>

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
                                    {stage.map(s => (
                                        <tr key={s.trans_no}>
                                            <td>
                                                <span title={`Edit ${s.details}`}
                                                >✏️</span>
                                                <span title={`Delete ${s.details}`}
                                                >🗑️</span>
                                            </td>
                                            <td>{dateFormatter(s.date as string)}</td>
                                            <td>{s.details}</td>
                                            <td>{s.amount}</td>
                                            <td>{capsEveryWord(s.transaction)}</td>
                                            <td>{capsEveryWord(s.transaction_mode)}</td>
                                            <td>{capsEveryWord(s.category)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        : <div>No transaction to be committed.</div>
                    }

                    {/* Form Field */}
                    <CreateManyTransactionForm categories={categories} setStates={setStates} />
                </div>
            }
        </div>
    )
}