"use client"

import Link from "next/link";
import { useActionState, useState } from "react";
import { evaluate } from "mathjs";

import { AmountFormat, CalcTransactionTotal, TransactionsType } from "@/src/types/types";

import { transactionMode, transactions } from "@/src/helpers/constants";
import { capsEveryWord } from "@/src/helpers/helperFn";
import { editTransaction } from "@/src/actions/actions";

import FormErrorMessenger from "../../create/FormErrorMessenger";

interface EditTransactionForm {
    defaultVals: TransactionsType,
    categories: string[]
    className?: string
}

export default function EditTransactionForm({ defaultVals, categories = [], className = "" }: EditTransactionForm) {
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
                className={`${className ?? ""} max-w-150 w-full [&_div.form-err-msg]:text-(--red-clr) [&_input]:border-b 
                        [&_select]:bg-(--gray-clr) [&_label]:font-bold`}
            >
                <div className="*:mb-5 sm:[&_div.form-field]:gap-5 
                                [&_div.form-field]:grid [&_div.form-field]:grid-cols-1 
                                sm:[&_div.form-field]:grid-cols-[minmax(6rem,1fr)_minmax(6rem,2fr)]"
                >
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
                                title="Date"
                                defaultValue={(defaultVals.date as Date).toISOString().split("T")[0]}
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
                                title="Details"
                                placeholder="Details"
                                defaultValue={defaultVals.details as string}
                                aria-describedby="details-error"
                            />
                        </div>
                    </div>
                    
                    {/* Quantity Field */}
                    <div>
                        <FormErrorMessenger describedBy="quantity-error"
                            errorState={state}
                            colName="quantity"
                        />
                        
                        <div className="form-field">
                            <label>Quantity</label>
                            <input type="number" 
                                name="quantity"
                                title="Quantity"
                                placeholder="Quantity"
                                value={calcTotal.quantity}
                                onChange={setTotal("quantity")}
                            />
                        </div>
                    </div>

                    {/* Amount Field */}
                    <div>
                        <FormErrorMessenger describedBy={amountFrmt === "constant" ? "amount-error" : "calc-amount-error"}
                            errorState={state}
                            colName={"amount"}
                        />
                        
                        <div className="form-field [&_input]:w-full">
                            <label onClick={_ => setAmountFrmt(f => f === "constant" ? "calculate" : "constant")}>
                                {capsEveryWord(amountFrmt)} Amount
                            </label>
                            <div onDoubleClick={_ => setAmountFrmt(f => f === "constant" ? "calculate" : "constant")}>
                                
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
                        </div>
                    </div>

                    {/* Total Field */}
                    <div>
                        <input type="hidden" name="total" value={total} />
                        <div className="form-field">
                            <label>Total</label>
                            <p className="flex-1 border-b">₱ {total}</p>
                        </div>
                    </div>

                    {/* Transaction Field */}
                    <div>
                        <FormErrorMessenger describedBy="transaction-error"
                            errorState={state}
                            colName="transaction"
                        />
                        
                        <div className="form-field">
                            <label>Transaction</label>
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
                        </div>
                    </div>
                    
                    {/* Transaction Mode Field */}
                    <div>
                        <FormErrorMessenger describedBy="transaction_mode-error"
                            errorState={state}
                            colName="transaction_mode"
                        />
                        
                        <div className="form-field">
                            <label>Transaction Mode</label>
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
                        </div>
                    </div>
                    
                    {/* Category Field */}
                    <div>
                        <FormErrorMessenger describedBy="category-error"
                            errorState={state}
                            colName={"category"}
                        />
                        
                        <div className="form-field">
                            <label>Category</label>
                            
                            <input type="text"
                                defaultValue={defaultVals.category}
                                list="categories"
                                name="category"
                                title="Category"
                                placeholder="Category"
                                className="border-b"
                                aria-describedby="category-error"
                            />

                            <datalist id="categories">
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </datalist>
                        </div>
                    </div>

                </div>
                
                {/* Buttons and Backrefs */}
                <div className="pt-5 mx-5 flex justify-between items-center">
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