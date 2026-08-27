"use client"

import React, { useActionState, useState } from "react";
import { evaluate } from "mathjs";
import Link from "next/link";

import type { AmountFormat, CalcTransactionTotal } from "@/src/types/types";

import { transactionMode, transactions } from "@/src/helpers/constants";
import { capsEveryWord } from "@/src/helpers/helperFn";
import { createTransactions } from "@/src/actions/actions";

import FormErrorMessenger from "./FormErrorMessenger";

interface TransactionFormFields {
    categories: string[]
    distinctDetails: string[]
    className?: string
}

const quantitativeVals: CalcTransactionTotal = {
    quantity: 1,
    amount: 0,
}

export default function TransactionFormFields({ categories, distinctDetails, className = "" }: TransactionFormFields) {
    const [state, formAction] = useActionState(createTransactions, { message: null })
    const [quantiVals, setQuantiVals] = useState<CalcTransactionTotal>(quantitativeVals)
    const [amountFrmt, setAmountFrmt] = useState<AmountFormat>("constant")

    const setTotal = (field: keyof CalcTransactionTotal) => (
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
        <form className={`${className ?? ""} w-full max-w-130 
                        [&_div.form-err-msg]:text-(--red-clr) [&_div.form-err-msg]:mb-1 
                        sm:[&_div.form-err-msg]:text-end`}
            action={formAction}
        >
            <div className="*:mb-5 p-3 
                            sm:[&_div.form-field]:gap-5 [&_div.form-field]:grid [&_div.form-field]:grid-cols-1 
                            sm:[&_div.form-field]:grid-cols-[minmax(5rem,1fr)_minmax(7rem,2fr)] 
                            [&_input]:border-b [&>input]:mb-5 rounded-2xl overflow-auto">
                {/* Date Field */}
                <div>
                    <FormErrorMessenger describedBy="date-error"
                        errorState={state}
                        colName="date"
                    />

                    <div className="form-field">
                        <label>Date</label>
                        <input type="date" 
                            name="date"
                            defaultValue={new Date().toISOString().split("T")[0]}
                            
                            title="Date"
                            className="max-w-35 min-w-30"
                            aria-describedby="date-error"
                        />
                    </div>
                </div>
                
                {/* Details Field */}
                <div>
                    <FormErrorMessenger describedBy="details-error"
                        errorState={state}
                        colName="details"
                    />

                    <div className="form-field">
                        <label>Details</label>
                        <input type="text" 
                            name="details"
                            list="details"
                            placeholder="Details"
                            title="Details"
                            aria-describedby="details-error"
                        />
                    </div>

                    <datalist id="details">
                        {distinctDetails.map(detail => (
                            <option key={detail} value={detail}>{detail}</option>
                        ))}
                    </datalist>
                </div>

                {/* Quantity Field */}
                <div className="form-field">
                    <label>Quantity</label>
                    <input type="number" 
                        name="quantity"
                        title="Quantity"
                        placeholder="Quantity"
                        defaultValue={quantiVals.quantity}
                        onChange={setTotal("quantity")}
                    />
                </div>

                {/* Amount Field */}
                <div>
                    <FormErrorMessenger describedBy="amount-error"
                        errorState={state}
                        colName="amount"
                    />

                    <div className="form-field">
                        <label
                            title={`To ${amountFrmt === "constant" ? "Calculate Amount" : "Amount"}`}
                            onDoubleClick={_ => setAmountFrmt(f => f === "calculate" ? "constant" : "calculate")}
                        >
                            {amountFrmt === "constant" ? "Amount" : "Calculate Amount"}
                        </label>
                        <div>
                            {amountFrmt === "constant"
                                ? <input type="number" 
                                    name="amount"
                                    placeholder="Amount"
                                    min={0}
                                    title="Amount"
                                    onChange={setTotal("amount")}
                                    aria-describedby="amount-error"
                                    className="w-full"
                                />
                                : <input type="text" 
                                    name="amount"
                                    placeholder="Calculate Amount"
                                    onChange={(setTotal("amount"))}
                                    className={`border-b w-full`}
                                />
                            }
                        </div>
                    </div>
                </div>
                
                {/* Total Amount */}
                <div className="form-field">
                    <input type="hidden" name="total" value={total} />

                    <label>Total</label>
                    <p className="border-b"
                        title="Automatically calculated"
                    >₱ {total}</p>
                </div>
                
                {/* Transaction Field */}
                <div>
                    <FormErrorMessenger describedBy="transaction-error"
                        errorState={state}
                        colName="transaction"
                    />

                    <div className="form-field">
                        <label>Transaction</label>
                        <div>
                            <select name="transaction" 
                                className={`bg-(--gray-clr)`}
                                title="Transaction"
                                aria-describedby="transaction"
                                defaultValue=""
                            >
                                {/* <option value="" disabled>Transaction</option> */}
                                {transactions.map(t => (<option key={t} value={t}>
                                    {capsEveryWord(t)}
                                </option>))}
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Transaction Mode Field */}
                <div>
                    <FormErrorMessenger describedBy="transaction_mode"
                        errorState={state}
                        colName="transaction_mode"
                    />

                    <div className="form-field">
                        <label>Transaction Mode</label>
                        <div>
                            <select name="transaction_mode" 
                                className={`bg-(--gray-clr)`}
                                title="Transaction Mode"
                                aria-describedby="transaction_mode-error"
                                defaultValue=""
                            >
                                {/* <option value="" disabled>Transaction Mode</option> */}
                                {transactionMode.map(t => (<option key={t} value={t}>
                                    {capsEveryWord(t)}
                                </option>))}
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Categories Field */}
                <div>
                    <FormErrorMessenger describedBy="category"
                        errorState={state}
                        colName="category"
                    />

                    <div className="form-field">
                        <label>Category</label>
                        <input type="text" 
                            list="categories"
                            name="category"
                            title="Category"
                            placeholder="Category"
                            className="border-b"
                        />

                        <datalist id="categories">
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </datalist>
                    </div>
                </div>
            </div>

            <div className="w-full px-3">
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