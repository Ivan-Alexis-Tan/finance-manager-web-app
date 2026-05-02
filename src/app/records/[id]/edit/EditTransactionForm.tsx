"use client"

import Link from "next/link";
import { useActionState, useState } from "react";

import { transactionMode, transactions } from "@/src/helpers/constants";
import { capsEveryWord } from "@/src/helpers/helperFn";
import { editTransaction } from "@/src/actions/actions";
import { transactionsUncheckedCreateInput } from "@/src/generated/prisma/models";
import { AmountFormat } from "@/src/types/types";

import FormErrorMessenger from "../../create/FormErrorMessenger";

interface EditTransactionForm {
    defaultVals: transactionsUncheckedCreateInput,
    categories: string[]
}

const formFieldStyle = "mb-7"
const formErrMsgStyle = "text-[hsl(0,100%,70%)] mb-1"

export default function EditTransactionForm({ defaultVals, categories = [] }: EditTransactionForm) {
    const actionFn = editTransaction.bind(null, defaultVals.trans_no as number)
    const [state, formAction] = useActionState(actionFn, { message: "" })
    const [amountFrmt, setAmountFrmt] = useState<AmountFormat>("constant")

    return (
        <div>
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
                    defaultValue={(defaultVals.date as Date).toISOString().split("T")[0]}
                    aria-describedby="date-error"
                    className={`${formFieldStyle} border-b-1`}
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
                    defaultValue={defaultVals.details as string}
                    aria-describedby="details-error"
                    className={`${formFieldStyle} border-b-1`}
                />

                {/* Amount Field */}
                <FormErrorMessenger describedBy={amountFrmt === "constant" ? "amount-error" : "calc-amount-error"}
                    errorState={state}
                    colName={amountFrmt === "constant" ? "amount" : "calc_amount"}
                    styles={`${formErrMsgStyle}`}
                />
                <div onDoubleClick={_ => setAmountFrmt(f => f === "constant" ? "calculate" : "constant")}>
                    <p onClick={_ => setAmountFrmt(f => f === "constant" ? "calculate" : "constant")}>
                        {capsEveryWord(amountFrmt)} amount:
                    </p>
                    {amountFrmt === "constant"
                        ? <input type="number" 
                            name="amount"
                            placeholder="Amount"
                            defaultValue={`${defaultVals.amount as Number}`}
                            aria-describedby="amount-error"
                            className={`${formFieldStyle} border-b-1`}
                        />
                        : <input type="text" 
                            name="calc_amount"
                            placeholder="Amount"
                            defaultValue={`${defaultVals.amount as Number}`}
                            aria-describedby="calc-amount-error"
                            className={`${formFieldStyle} border-b-1`}
                        />
                    }
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
                    defaultValue={defaultVals.transaction as string}
                    aria-describedby={`${formFieldStyle} transaction-error`}
                >
                    <option value="" disabled>Transaction</option>
                    {transactions.map(t => (<option key={t} value={t}>
                        {capsEveryWord(t)}
                    </option>))}
                </select>
                
                {/* Transaction Mode Field */}
                <FormErrorMessenger describedBy="transaction_mode-error"
                    errorState={state}
                    colName="transaction_mode"
                    styles={`${formErrMsgStyle}`}
                />
                <select name="transaction_mode" 
                    className={`${formFieldStyle} bg-gray-700`}
                    title="Transaction Mode"
                    defaultValue={defaultVals.transaction_mode as string}
                    aria-describedby="transaction_mode-error"
                >
                    <option value="" disabled>Transaction Mode</option>
                    {transactionMode.map(t => (<option key={t} value={t}>
                        {capsEveryWord(t)}
                    </option>))}
                </select>
                
                {/* Category Field */}
                <FormErrorMessenger describedBy="category-error"
                    errorState={state}
                    colName={"category"}
                    styles={`${formErrMsgStyle}`}
                />
                <select name="category"
                    defaultValue={defaultVals.category}
                    title="Category"
                    aria-describedby="category-eror"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{capsEveryWord(cat)}</option>
                    ))}
                </select>
                
                {/* Buttons and Backrefs */}
                <div className="flex justify-between items-center pt-5">
                    <Link href={"/records"} className="hover:font-bold hover:text-[hsl(54,100%,50%)]" title="Back to records page">
                        <strong>&larr;</strong> Records
                    </Link>
                    <button title="Save transaction" className="text-xl">💾</button>
                </div>
            </form>
        </div>
    )
}