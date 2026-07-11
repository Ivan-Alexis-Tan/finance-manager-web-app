"use client"

import { useActionState, useEffect, useState } from "react"
import Link from "next/link"

import { createManyTransactions, createTransactions } from "@/src/actions/actions"
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
    const { 
        stage, 
        removeItem, 
        removeAll,
        setStates 
    } = useManyTransactions()

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

                    {/* Staged Transactions */}
                    <StagedTransactions 
                        staged={stage}
                        removeAll={removeAll}
                        removeItem={removeItem}
                    />

                    {/* Form Field */}
                    <CreateManyTransactionForm categories={categories} setStates={setStates} />
                </div>
            }
        </div>
    )
}