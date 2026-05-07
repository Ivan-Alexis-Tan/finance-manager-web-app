"use client"

import { useActionState, useEffect, useState } from "react"
import Link from "next/link"

import { createTransactions } from "@/src/actions/actions"
import { capsEveryWord, dateFormatter } from "@/src/helpers/helperFn"

import TransactionFormFields from "./TransactionFormFields"
import CreateManyTransactionForm, { useManyTransactions } from "./CreateManyTransactionForm"

interface CreateTransactionCategories {
    categories: string[]
}

const activeModeStyle = "text-[hsl(0,0%,0%)] bg-[hsl(0,0%,100%)] font-bold"
const tdStyles = "p-[3px] max-w-[10rem]"

export default function CreateTransactionForm({ categories = [] }: CreateTransactionCategories) {
    const [state, formAction] = useActionState(createTransactions, { message: null })
    const [createMany, setCreateMany] = useState(false)
    
    const { stage, removeAll, setStates } = useManyTransactions()

    useEffect(() => {
        const draft = localStorage.getItem("staged_transactions")
        if (!draft) return
        if (JSON.parse(draft as string).length >= 1) setCreateMany(true)
    }, [])

    return (
        <div className="flex flex-col">

            {/* Creation Mode */}
            <div className="flex justify-center">
                <div className="flex justify-evenly items-center mt-3 mb-7 p-1 rounded-full w-full max-w-xs text-center bg-[hsl(0,0%,13%)]">
                    <p className={`${!createMany && activeModeStyle} p-2 rounded-full`}
                        onClick={_ => setCreateMany(false)}
                    >Create One</p>

                    <p className={`${createMany && activeModeStyle} p-2 rounded-full `}
                        onClick={_ => setCreateMany(true)}
                    >Create Many</p>
                </div>
            </div>
            
            {/* Creation Form and Table */}
            {!createMany 
                ? <form action={formAction}
                    className="flex flex-col items-center"
                >
                    <TransactionFormFields errState={state} categories={categories} />
                    
                    <div className="max-w-[20rem] w-full">
                        <div className="flex justify-between items-center mt-5">
                            <Link href={"/records"} className="hover:font-bold hover:text-[hsl(54,100%,50%)]" title="Back to records page">
                                <strong>&larr;</strong> Records
                            </Link>
                            <button title="Save transaction" className="text-xl">💾</button>
                        </div>
                    </div>

                </form>
                : <div className="flex justify-center flex-wrap gap-6 w-full">

                    {/* Staged UI */}
                    {stage.length >= 1
                        ? <div className="flex flex-col gap-2 max-w-4xl w-full">

                            {/* Upload and Delete Transaction */}
                            <div className="flex gap-10 items-center p-2">
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
                            
                            {/* Transaction Table */}
                            <div className="w-full overflow-x-auto mb-3">
                                <table className="min-w-[700px] w-full bg-gray-700 border-collapse mb-5">
                                    <thead>
                                        <tr className="border-b-[1px] border-b-gray-900 font-bold">
                                            <td></td>
                                            <td className={`${tdStyles}`}>Date</td>
                                            <td className={`${tdStyles} max-w-[200px]`}>Details</td>
                                            <td className={`${tdStyles}`}>Amount</td>
                                            <td className={`${tdStyles}`}>Transaction</td>
                                            <td className={`${tdStyles}`}>Transaction Mode</td>
                                            <td className={`${tdStyles}`}>Category</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stage.map(s => (
                                            <tr key={s.trans_no}>
                                                <td>
                                                    <span title={`Delete ${s.details}`}
                                                    >🗑️</span>
                                                </td>
                                                <td className={`${tdStyles}`}>{dateFormatter(s.date as string)}</td>
                                                <td className={`wrap-break-word ${tdStyles}`}>{s.details}</td>
                                                <td className={`${tdStyles}`}>{s.amount}</td>
                                                <td className={`${tdStyles}`}>{capsEveryWord(s.transaction)}</td>
                                                <td className={`${tdStyles}`}>{capsEveryWord(s.transaction_mode)}</td>
                                                <td className={`${tdStyles}`}>{capsEveryWord(s.category)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        : <div className="text-center">No transaction to be committed.</div>
                    }                        

                    {/* Form Field */}
                    <CreateManyTransactionForm categories={categories} setStates={setStates} />
                    
                </div>
            }

        </div>
    )
}