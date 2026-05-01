"use client"

import Link from "next/link"
import { useActionState } from "react"

import { createTransactions } from "@/src/actions/actions"
import { transactionMode, transactions } from "@/src/helpers/constants"
import { capsEveryWord } from "@/src/helpers/helperFn"

import FormErrorMessenger from "./FormErrorMessenger"

const formFieldStyle = "mb-7"
const formErrMsgStyle = "text-[hsl(0,100%,70%)] mb-1"

interface CreateTransactionCategories {
    categories: string[]
}

export default function CreateTransactionForm({ categories = [] }: CreateTransactionCategories) {
    const [state, formAction] = useActionState(createTransactions, { message: null })

    return (
        <form action={formAction}
            className="flex flex-col"
        >
            {/* Date Field */}
            <FormErrorMessenger describedBy="date-error"
                errorState={state}
                colName="date"
                styles={`${formErrMsgStyle}`}
            />

            <input type="date" 
                name="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className={`${formFieldStyle} border-b-1`}
                title="Date"
                // style={{ all: "revert" }}
                aria-describedby="date-error"
            />
            
            {/* Details Field */}
            <FormErrorMessenger describedBy="details-error"
                errorState={state}
                colName="details"
                styles={`${formErrMsgStyle}`}
            />

            <input type="text" 
                name="details"
                placeholder="Details"
                title="Details"
                aria-describedby="details-error"
                className={`${formFieldStyle} border-b-1`}
            />

            {/* Amount Field */}
            <FormErrorMessenger describedBy="amount-error"
                errorState={state}
                colName="amount"
                styles={`${formErrMsgStyle}`}
            />

            <input type="number" 
                name="amount"
                placeholder="Amount"
                min={0}
                title="Amount"
                aria-describedby="amount-error"
                className={`${formFieldStyle} border-b-1`}
            />
            
            {/* Transaction Field */}
            <FormErrorMessenger describedBy="transaction-error"
                errorState={state}
                colName="transaction"
                styles={`${formErrMsgStyle}`}
            />

            <select name="transaction" 
                className={`${formFieldStyle} bg-gray-700`}
                title="Transaction"
                aria-describedby="transaction"
                defaultValue=""
            >
                <option value="" disabled>Transaction</option>
                {transactions.map(t => (<option key={t} value={t}>
                    {capsEveryWord(t)}
                </option>))}
            </select>
            
            {/* Transaction Mode Field */}
            <FormErrorMessenger describedBy="transaction_mode"
                errorState={state}
                colName="transaction_mode"
                styles={`${formErrMsgStyle}`}
            />

            <select name="transaction_mode" 
                className={`${formFieldStyle} bg-gray-700`}
                title="Transaction Mode"
                aria-describedby="transaction_mode-error"
                defaultValue=""
            >
                <option value="" disabled>Transaction Mode</option>
                {transactionMode.map(t => (<option key={t} value={t}>
                    {capsEveryWord(t)}
                </option>))}
            </select>
            
            {/* Categories Field */}
            <FormErrorMessenger describedBy="category"
                errorState={state}
                colName="category"
                styles={`${formErrMsgStyle}`}
            />
            
            <select name="category"
                title="Category"
                defaultValue=""
                className={`${formFieldStyle} bg-gray-700`}
                aria-describedby="category-error"
            >
                <option value="" disabled>Category</option>
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>

            <div className="flex justify-between items-center pt-5">
                <Link href={"/records"} className="hover:font-bold hover:text-[hsl(54,100%,50%)]" title="Back to records page">
                    <strong>&larr;</strong> Records
                </Link>
                <button title="Save transaction" className="text-xl">💾</button>
            </div>
        </form>
    )
}