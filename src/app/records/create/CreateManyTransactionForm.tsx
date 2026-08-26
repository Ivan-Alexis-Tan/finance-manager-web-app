"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { AmountFormat, TransactionErrorsStates, TransactionsActionState, TransactionsType } from "@/src/types/types"
import { Session } from "next-auth"

import { transactionMode, transactions } from "@/src/helpers/constants"
import { capsEveryWord } from "@/src/helpers/helperFn"
import { TransactionsCreateInput } from "@/src/generated/prisma/models"
import { schemaTransactionsFormData } from "@/src/schemas/schemas"

import FormErrorMessenger from "./FormErrorMessenger"
import { defaultRow } from "./useManyTransactions"

type Transactions = TransactionsType[]

interface CreateManyTransaction { 
    categories: string[]
    user: Session["user"]
    setStates: {
        setStage: React.Dispatch<React.SetStateAction<Transactions>>
        stage: Transactions
    }
}

const errorDefault: TransactionsActionState = {
    errors: {},
    message: "",
}

export default function CreateManyTransactionForm({ categories = [], setStates, user }: CreateManyTransaction) {
    const [amountFrmt, setAmountFrmt] = useState<AmountFormat>("constant")
    const [transactionRow, setTransactionRow] = useState<TransactionsCreateInput>(defaultRow)
    const [errorMessage, setErrorMessage] = useState<TransactionsActionState>(errorDefault)

    const setRow = (field: keyof NonNullable<TransactionsCreateInput>) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => setTransactionRow(d => ({...d, [field]: e.target.value }))

    function addToStaged() {
        const data = validate(transactionRow)
        const errors = (data as TransactionsActionState)?.errors as NonNullable<TransactionErrorsStates> ?? []
        
        if (Object.keys(errors).length >= 1) {
            setErrorMessage({errors: errors} as TransactionsActionState)
            return
        }
        setErrorMessage(errorDefault)

        const id = setStates.stage.reduce((acc: number, s) => Math.max(Number(s.trans_no), acc) + 1, 1)
        setStates.setStage(p => ([...p, {...data as TransactionsType, trans_no: id, userId: Number(user.id as string) }]))
    }

    useEffect(() => {
        setTransactionRow(p => ({...p, total: (p.quantity as number) * p.amount }))
    }, [transactionRow.quantity, transactionRow.amount])

    return (
        <div className="[&_div.form-err-msg]:text-(--red-clr)
                        [&_input]:border-b [&>select]:bg-gray-700 overflow-auto"
        >
            <div className="*:mb-5 sm:[&_div.form-field]:gap-3 
                            [&_div.form-field]:grid [&_div.form-field]:grid-cols-1 
                            sm:[&_div.form-field]:grid-cols-[minmax(6rem,1fr)_minmax(7.5rem,2fr)]">
                {/* Date Field */}
                <div>
                    <FormErrorMessenger describedBy="date-error"
                        errorState={errorMessage}
                        colName="date"
                    />

                    <div className="form-field">
                        <label>Date</label>
                        <input type="date" 
                            name="date"
                            value={`${transactionRow.date}`}
                            title="Date"
                            aria-describedby="date-error"
                            onChange={setRow("date")}
                        />
                    </div>
                </div>
                
                {/* Details Field */}
                <div>
                    <FormErrorMessenger describedBy="details-error"
                        errorState={errorMessage}
                        colName="details"
                    />

                    <div className="form-field">
                        <label>Details</label>
                        <input type="text" 
                            name="details"
                            placeholder="Details"
                            title="Details"
                            aria-describedby="details-error"
                            onChange={setRow("details")}
                            value={transactionRow.details}
                        />
                    </div>
                </div>

                {/* Quantity Field */}
                <div>
                    <FormErrorMessenger describedBy="quantity-error" 
                        errorState={errorMessage}
                        colName="quantity"
                    />

                    <div className="form-field">
                        <label>Quantity</label>
                        <input type="number" min={1}
                            name="quantity"
                            placeholder="Quantity"
                            title="Quantity"
                            aria-describedby="quantity-error"
                            value={transactionRow.quantity}
                            onChange={setRow("quantity")}
                        />
                    </div>
                </div>

                {/* Amount Field */}
                <div>
                    <FormErrorMessenger describedBy="amount-error"
                        errorState={errorMessage}
                        colName="amount"
                    />
                    
                    <div className="form-field [&_input]:w-full">
                        <label>{amountFrmt === "constant" ? "Amount" : "Calculate Amount"}</label>
                        <div onDoubleClick={_ => setAmountFrmt(f => f === "calculate" ? "constant" : "calculate")}
                        >
                            {amountFrmt === "constant"
                                ? <input type="number" 
                                    name="amount"
                                    placeholder="Amount"
                                    min={0}
                                    title="Amount"
                                    aria-describedby="amount-error"
                                    value={transactionRow.amount}
                                    onChange={setRow("amount")}
                                />
                                : <input type="text" 
                                    name="calc_amount"
                                    placeholder="Calculate Amount"
                                    value={transactionRow.amount}
                                    onChange={setRow("amount")}
                                />
                            }
                        </div>
                    </div>
                </div>

                {/* Total Field */}
                <div className="form-field">
                    <label>Total</label>
                    <p className="flex-1 border-b">₱ {transactionRow.total as number}</p>
                </div>
                
                {/* Transaction Field */}
                <div>
                    <FormErrorMessenger describedBy="transaction-error"
                        errorState={errorMessage}
                        colName="transaction"
                    />

                    <div className="form-field">
                        <label>Transaction</label>
                        <div>
                            <select name="transaction" 
                                title="Transaction"
                                aria-describedby="transaction"
                                value={transactionRow.transaction}
                                onChange={setRow("transaction")}
                                className="bg-(--gray-clr)"
                            >
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
                        errorState={errorMessage}
                        colName="transaction_mode"
                    />

                    <div className="form-field">
                        <label>Transaction Mode</label>
                        <div>
                            <select name="transaction_mode" 
                                title="Transaction Mode"
                                aria-describedby="transaction_mode-error"
                                value={transactionRow.transaction_mode}
                                onChange={setRow("transaction_mode")}
                                className="bg-(--gray-clr)"
                            >
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
                        errorState={errorMessage}
                        colName="category"
                    />

                    <div className="form-field">
                        <label>Category</label>
                        <input type="text" 
                            list="categories"
                            name="categories"
                            value={transactionRow.category}
                            onChange={setRow("category")}
                            placeholder="Category"
                        />
                    </div>

                    <datalist id="categories">
                        {categories.map(cat => (
                            <option key={cat} value={cat}/>
                        ))}
                    </datalist>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-5">
                <Link href={"/records"} className="hover:font-bold hover:text-[hsl(54,100%,50%)]" title="Back to records page">
                    <strong>&larr;</strong> Records
                </Link>
                <button title="Save transaction" 
                    className="text-xl"
                    onClick={addToStaged}
                >💾</button>
            </div>

        </div>
    )
}

function validate(data: TransactionsCreateInput): TransactionsActionState | TransactionsCreateInput {
    const validated = schemaTransactionsFormData.safeParse({
        date: new Date(data.date as string),
        details: data.details,
        quantity: data.quantity,
        amount: data.amount,
        total: data.total,
        transaction: data.transaction,
        transaction_mode: data.transaction_mode,
        category: data.category,
    })

    if (!validated.success) return {
        errors: validated.error.flatten().fieldErrors,
        message: "Invalid field",
    }


    return validated.data
}