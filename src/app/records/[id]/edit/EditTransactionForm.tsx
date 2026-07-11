"use client"

import Link from "next/link";
import { useActionState, useState } from "react";

import { transactionMode, transactions } from "@/src/helpers/constants";
import { capsEveryWord } from "@/src/helpers/helperFn";
import { editTransaction } from "@/src/actions/actions";
import { TransactionsUncheckedCreateInput } from "@/src/generated/prisma/models";
import { AmountFormat, CalcTransactionTotal } from "@/src/types/types";

import FormErrorMessenger from "../../create/FormErrorMessenger";
import { evaluate } from "mathjs";

interface EditTransactionForm {
    defaultVals: TransactionsUncheckedCreateInput,
    categories: string[]
}

const formErrMsgStyle = "text-[hsl(0,100%,70%)] mb-1"

export default function EditTransactionForm({ defaultVals, categories = [] }: EditTransactionForm) {
    const actionFn = editTransaction.bind(null, defaultVals.trans_no as number)
    const [state, formAction] = useActionState(actionFn, { message: "" })
    const [amountFrmt, setAmountFrmt] = useState<AmountFormat>("constant")
    const [calcTotal, setCalcTotal] = useState<CalcTransactionTotal>({
        quantity: defaultVals.quantity as number,
        amount: defaultVals.amount
    })

    const evaluatedAmount = typeof calcTotal.amount === "string"
        ? (_ => {
            try {
                return evaluate(calcTotal.amount)
            }
            catch {
                return 0;
            }
        })()
        : calcTotal.amount

    const total = (evaluatedAmount ?? 0) * (calcTotal.quantity ?? 0)

    const setTotal = (field: keyof CalcTransactionTotal) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => setCalcTotal(val => ({...val, [field]: e.target.value }) )

    return (
        <div>
            <form action={formAction}
                className="flex flex-col [&_input]:border-b [&_input]:mb-5 
                        [&_select]:bg-gray-700 [&_select]:mb-5"
            >
                {/* Date Field */}
                <FormErrorMessenger describedBy="date-error"
                    errorState={state}
                    colName="date"
                    styles={`${formErrMsgStyle}`}
                />
                <input type="date" 
                    name="date"
                    title="Date"
                    defaultValue={(defaultVals.date as Date).toISOString().split("T")[0]}
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
                    title="Details"
                    placeholder="Details"
                    defaultValue={defaultVals.details as string}
                    aria-describedby="details-error"
                />
                
                {/* Quantity Field */}
                <FormErrorMessenger describedBy="quantity-error"
                    errorState={state}
                    colName="quantity"
                    styles={`${formErrMsgStyle}`}
                />
                <input type="number" 
                    name="quantity"
                    title="Quantity"
                    placeholder="Quantity"
                    value={calcTotal.quantity}
                    onChange={setTotal("quantity")}
                />

                {/* Amount Field */}
                <FormErrorMessenger describedBy={amountFrmt === "constant" ? "amount-error" : "calc-amount-error"}
                    errorState={state}
                    colName={"amount"}
                    styles={`${formErrMsgStyle}`}
                />
                <div onDoubleClick={_ => setAmountFrmt(f => f === "constant" ? "calculate" : "constant")}>
                    <p onClick={_ => setAmountFrmt(f => f === "constant" ? "calculate" : "constant")}>
                        {capsEveryWord(amountFrmt)} amount:
                    </p>
                    {amountFrmt === "constant"
                        ? <input type="number" 
                            name="amount"
                            title="Amount"
                            placeholder="Amount"
                            value={calcTotal.amount}
                            onChange={setTotal("amount")}
                            aria-describedby="amount-error"
                        />
                        : <input type="text" 
                            name="amount"
                            title="Amount"
                            placeholder="Amount"
                            value={calcTotal.amount}
                            onChange={setTotal("amount")}
                            aria-describedby="calc-amount-error"
                        />
                    }
                </div>

                {/* Total Field */}
                <input type="hidden" name="total" value={total} />
                <div className="flex gap-2 mb-5">
                    <span>Total:</span><span className="flex-1 border-b">₱ {total}</span>
                </div>

                {/* Transaction Field */}
                <FormErrorMessenger describedBy="transaction-error"
                    errorState={state}
                    colName="transaction"
                    styles={`${formErrMsgStyle}`}
                />
                <select name="transaction" 
                    title="Transaction"
                    defaultValue={defaultVals.transaction as string}
                    aria-describedby={`transaction-error`}
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
                    <Link href={"/records"} 
                        className="hover:font-bold hover:text-[hsl(54,100%,50%)]" 
                        title="Back to records page"
                    >
                        <strong>&larr;</strong> Records
                    </Link>
                    <button title="Save transaction" className="text-xl">💾</button>
                </div>
            </form>
        </div>
    )
}