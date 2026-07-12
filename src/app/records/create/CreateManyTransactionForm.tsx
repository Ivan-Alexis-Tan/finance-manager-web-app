"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { AmountFormat, TransactionErrorsStates, TransactionsActionState, TransactionsType } from "@/src/types/types"

import { transactionMode, transactions } from "@/src/helpers/constants"
import { capsEveryWord } from "@/src/helpers/helperFn"
import { TransactionsCreateInput } from "@/src/generated/prisma/models"
import { schemaTransactionsFormData } from "@/src/schemas/schemas"

import FormErrorMessenger from "./FormErrorMessenger"

type TransactionRow = TransactionsType[]
interface CreateManyTransaction { 
    categories: string[]
    setStates: {
        setStage: React.Dispatch<React.SetStateAction<TransactionRow>>
        stage: TransactionRow
    }
}

const formErrMsgStyle = "text-[hsl(0,100%,70%)] mb-1"

export function useManyTransactions() {
    const [stage, setStage] = useState<TransactionRow>(() => {
        if (typeof window === "undefined") return []
        const saved = localStorage.getItem("staged_transactions") as string
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem("staged_transactions", JSON.stringify(stage))
    }, [stage])

    function removeItem(trans_no: number) {
        setStage(p => p.filter(item => item.trans_no !== trans_no))
    }

    function removeAll() {
        setStage([])
    }

    return {
        stage,
        removeItem,
        removeAll,
        defaultRow,
        setStates: {stage, setStage},
    }
}

const defaultRow: TransactionsCreateInput = {
    trans_no: 0,
    date: new Date().toISOString().split("T")[0],
    details: "",
    quantity: 1,
    amount: 0,
    total: 0,
    transaction: "",
    transaction_mode: "",
    category: "",
}

const errorDefault: TransactionsActionState = {
    errors: {},
    message: "",
}

export default function CreateManyTransactionForm({ categories = [], setStates }: CreateManyTransaction) {
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
        setStates.setStage(p => ([...p, {...data as TransactionsType, trans_no: id }]))
    }

    useEffect(() => {
        setTransactionRow(p => ({...p, total: (p.quantity as number) * p.amount }))
    }, [transactionRow.quantity, transactionRow.amount])

    return (
        <div className="flex flex-col
                        [&>input]:border-b [&>input,&>select]:mb-5 [&>select]:bg-gray-700"
        >
            {/* Date Field */}
            <FormErrorMessenger describedBy="date-error"
                errorState={errorMessage}
                colName="date"
                styles={`${formErrMsgStyle}`}
            />

            <input type="date" 
                name="date"
                value={`${transactionRow.date}`}
                title="Date"
                // style={{ all: "revert" }}
                aria-describedby="date-error"
                onChange={setRow("date")}
            />
            
            {/* Details Field */}
            <FormErrorMessenger describedBy="details-error"
                errorState={errorMessage}
                colName="details"
                styles={`${formErrMsgStyle}`}
            />

            <input type="text" 
                name="details"
                placeholder="Details"
                title="Details"
                aria-describedby="details-error"
                onChange={setRow("details")}
                value={transactionRow.details}
            />

            {/* Quantity Field */}
            <FormErrorMessenger describedBy="quantity-error" 
                errorState={errorMessage}
                colName="quantity"
                styles={`${formErrMsgStyle}`}
            />

            <input type="number" min={1}
                name="quantity"
                placeholder="Quantity"
                title="Quantity"
                aria-describedby="quantity-error"
                value={transactionRow.quantity}
                onChange={setRow("quantity")}
            />

            {/* Amount Field */}
            <FormErrorMessenger describedBy="amount-error"
                errorState={errorMessage}
                colName="amount"
                styles={`${formErrMsgStyle}`}
            />
            <div onDoubleClick={_ => setAmountFrmt(f => f === "calculate" ? "constant" : "calculate")}
                className="[&>input]:mb-5 [&>input]:border-b"
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

            {/* Total Field */}
            <div className="flex gap-2 mb-5">
                <span>Total: </span><span className="flex-1 border-b">₱ {transactionRow.total as number}</span>
            </div>
            
            {/* Transaction Field */}
            <FormErrorMessenger describedBy="transaction-error"
                errorState={errorMessage}
                colName="transaction"
                styles={`${formErrMsgStyle}`}
            />

            <select name="transaction" 
                title="Transaction"
                aria-describedby="transaction"
                value={transactionRow.transaction}
                onChange={setRow("transaction")}
            >
                <option value="" disabled>Transaction</option>
                {transactions.map(t => (<option key={t} value={t}>
                    {capsEveryWord(t)}
                </option>))}
            </select>
            
            {/* Transaction Mode Field */}
            <FormErrorMessenger describedBy="transaction_mode"
                errorState={errorMessage}
                colName="transaction_mode"
                styles={`${formErrMsgStyle}`}
            />

            <select name="transaction_mode" 
                title="Transaction Mode"
                aria-describedby="transaction_mode-error"
                value={transactionRow.transaction_mode}
                onChange={setRow("transaction_mode")}
            >
                <option value="" disabled>Transaction Mode</option>
                {transactionMode.map(t => (<option key={t} value={t}>
                    {capsEveryWord(t)}
                </option>))}
            </select>
            
            {/* Categories Field */}
            <FormErrorMessenger describedBy="category"
                errorState={errorMessage}
                colName="category"
                styles={`${formErrMsgStyle}`}
            />

            <input type="text" 
                list="categories"
                name="categories"
                value={transactionRow.category}
                onChange={setRow("category")}
                placeholder="Category"
            />

            <datalist id="categories">
                {categories.map(cat => (
                    <option key={cat} value={cat}/>
                ))}
            </datalist>

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