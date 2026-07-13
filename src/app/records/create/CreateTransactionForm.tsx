"use client"

import { useEffect, useState } from "react"

import { Session } from "next-auth"

import { useManyTransactions } from "./useManyTransactions"

import CreateManyTransactionForm from "./CreateManyTransactionForm"
import StagedTransactions from "./StagedTransactions"
import TransactionFormFields from "./TransactionFormFields"

interface CreateTransactionCategories {
    categories: string[]
    user: Session["user"]
}

const activeModeStyle = "text-[hsl(0,0%,0%)] bg-[hsl(0,0%,100%)] font-bold"

export default function CreateTransactionForm({ categories = [], user }: CreateTransactionCategories) {
    const [createMany, setCreateMany] = useState(false)  
    const { 
        stage, 
        removeItem, 
        removeAll,
        setStates 
    } = useManyTransactions(user)

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
                ? <div className="flex flex-col items-center">
                    <TransactionFormFields categories={categories} />
                </div>
                : <div className="flex justify-evenly flex-wrap gap-6 w-full">

                    {/* Staged Transactions */}
                    <StagedTransactions 
                        staged={stage}
                        removeAll={removeAll}
                        removeItem={removeItem}
                    />

                    {/* Form Field */}
                    <CreateManyTransactionForm categories={categories} setStates={setStates} user={user} />
                </div>
            }
        </div>
    )
}