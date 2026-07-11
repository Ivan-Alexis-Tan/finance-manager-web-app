"use client"

import React, { useActionState, useEffect, useState } from "react";

import type { AmountFormat, TransactionsActionState } from "@/src/types/types";
import { transactionMode, transactions } from "@/src/helpers/constants";
import { capsEveryWord } from "@/src/helpers/helperFn";

import FormErrorMessenger from "./FormErrorMessenger";
import Link from "next/link";
import { createTransactions } from "@/src/actions/actions";
import { evaluate } from "mathjs";

const formFieldStyle = "mb-7"
const formErrMsgStyle = "text-[hsl(0,100%,70%)] mb-1"

interface TransactionFormFields {
    categories: string[]
}

interface QuantitativeVals {
    quantity: number
    amount: number | string
}

const quantitativeVals: QuantitativeVals = {
    quantity: 1,
    amount: 0,
}

export default function TransactionFormFields({ categories }: TransactionFormFields) {
    const [state, formAction] = useActionState(createTransactions, { message: null })
    const [quantiVals, setQuantiVals] = useState<QuantitativeVals>(quantitativeVals)
    const [amountFrmt, setAmountFrmt] = useState<AmountFormat>("constant")

    const setTotal = (field: keyof QuantitativeVals) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => setQuantiVals(val => ({...val, [field]: e.target.value }))

    const evaluatedAmount = typeof quantiVals.amount === "string"
        ? (_ => {
            try {
                return evaluate(quantiVals.amount)
            }
            catch {
                return 0;
            }
        })()
        : quantiVals.amount

    const total = (evaluatedAmount ?? 0) * (quantiVals.quantity ?? 0)

    return (
        <form className="flex flex-col max-w-[20rem] w-full [&>input]:border-b [&>input]:mb-5"
            action={formAction}
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
            />

            {/* Quantity Field */}
            <input type="number" 
                name="quantity"
                title="Quantity"
                placeholder="Quantity"
                defaultValue={quantiVals.quantity}
                onChange={setTotal("quantity")}
            />

            {/* Amount Field */}
            <FormErrorMessenger describedBy="amount-error"
                errorState={state}
                colName="amount"
                styles={`${formErrMsgStyle}`}
            />

            <div onDoubleClick={_ => setAmountFrmt(f => f === "calculate" ? "constant" : "calculate")}>
                {amountFrmt === "constant"
                    ? <input type="number" 
                        name="amount"
                        placeholder="Amount"
                        min={0}
                        title="Amount"
                        onChange={setTotal("amount")}
                        aria-describedby="amount-error"
                        className={`${formFieldStyle} border-b w-full`}
                    />
                    : <input type="text" 
                        name="amount"
                        placeholder="Calculate Amount"
                        onChange={(setTotal("amount"))}
                        className={`${formFieldStyle} border-b w-full`}
                    />
                }
            </div>

            <div className="flex gap-2 mb-5">
                <input type="hidden" name="total" value={total} />
                <span>Total:</span> <span className="flex-1 border-b">₱ {total}</span>
            </div>
            
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

            <input type="text" 
                list="categories"
                name="category"
                title="Category"
                placeholder="Category"
            />

            <datalist id="categories">
                {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </datalist>

            <div className="max-w-[20rem] w-full">
                <div className="flex justify-between items-center mt-5">
                    <Link href={"/records"} className="hover:font-bold hover:text-[hsl(54,100%,50%)]" title="Back to records page">
                        <strong>&larr;</strong> Records
                    </Link>
                    <button title="Save transaction" className="text-xl">💾</button>
                </div>
            </div>
        </form>
    )
}