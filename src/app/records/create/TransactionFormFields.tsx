"use client"

import { useState } from "react";

import type { AmountFormat, TransactionsActionState } from "@/src/types/types";
import { transactionMode, transactions } from "@/src/helpers/constants";
import { capsEveryWord } from "@/src/helpers/helperFn";

import FormErrorMessenger from "./FormErrorMessenger";

const formFieldStyle = "mb-7"
const formErrMsgStyle = "text-[hsl(0,100%,70%)] mb-1"

interface TransactionFormFields {
    errState: TransactionsActionState
    categories: string[]
}

export default function TransactionFormFields({ errState, categories }: TransactionFormFields) {
    const [amountFrmt, setAmountFrmt] = useState<AmountFormat>("constant")
    return (
        <>
            {/* Date Field */}
            <FormErrorMessenger describedBy="date-error"
                errorState={errState}
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
                errorState={errState}
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
                errorState={errState}
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
                        aria-describedby="amount-error"
                        className={`${formFieldStyle} border-b-1`}
                    />
                    : <input type="text" 
                        name="calc_amount"
                        placeholder="Calculate Amount"
                        className={`${formFieldStyle} border-b-1`}
                    />
                }
            </div>
            
            {/* Transaction Field */}
            <FormErrorMessenger describedBy="transaction-error"
                errorState={errState}
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
                errorState={errState}
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
                errorState={errState}
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
        </>
    )
}