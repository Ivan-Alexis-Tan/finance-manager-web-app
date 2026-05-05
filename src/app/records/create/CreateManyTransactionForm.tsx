"use client"

import { useEffect, useState } from "react"
import type { SetStateAction } from "react"

import { AmountFormat, Transaction } from "@/src/types/types"
import { transactionMode, transactions } from "@/src/helpers/constants"
import { capsEveryWord } from "@/src/helpers/helperFn"
import { transactionsCreateInput } from "@/src/generated/prisma/models"
import { schemaTransactionsFormData } from "@/src/schemas/schemas"

import FormErrorMessenger from "./FormErrorMessenger"
import Link from "next/link"
import { redirect } from "next/navigation"

type InputRow = NonNullable<transactionsCreateInput>
interface CreateManyTransaction { 
    categories: string[]
    setStates: {
        setStage: React.Dispatch<React.SetStateAction<InputRow[]>>
        stage: InputRow[]
    }
}

const formFieldStyle = "mb-7"
const formErrMsgStyle = "text-[hsl(0,100%,70%)] mb-1"

export function useManyTransactions() {
    const [stage, setStage] = useState<InputRow[]>(() => {
        if (typeof window === "undefined") return []
        const saved = localStorage.getItem("staged_transactions")
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
        setStates: {stage, setStage},
    }
}

function emptyRows(): InputRow {
    return {
        trans_no: 0,
        date: new Date().toISOString().split("T")[0],
        details: "",
        amount: 0,
        transaction: "",
        transaction_mode: "",
        category: "",
    }
}

export default function CreateManyTransactionForm({ categories = [], setStates }: CreateManyTransaction) {
    const [amountFrmt, setAmountFrmt] = useState<AmountFormat>("constant")
    const [transactionRow, setTransactionRow] = useState<InputRow>(emptyRows())

    const setRow = (field: keyof NonNullable<transactionsCreateInput>) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => setTransactionRow(d => ({...d, [field]: e.target.value }))

    function addToStaged() {
        const data = validate(transactionRow)
        const id = setStates.stage.reduce((acc: number, s) => Math.max(Number(s.trans_no), acc) + 1, 1)
        
        console.log(`data =`, data)
        console.log(`id =`, id)
        
        setStates.setStage(p => ([...p, {trans_no: id, ...data as Transaction}]))
    }

    return (
        <div>
            <div className="flex flex-col">
                {/* Date Field */}
                {/* <FormErrorMessenger describedBy="date-error"
                    errorState={errState}
                    colName="date"
                    styles={`${formErrMsgStyle}`}
                /> */}
    
                <input type="date" 
                    name="date"
                    value={`${transactionRow.date}`}
                    className={`${formFieldStyle} border-b-1`}
                    title="Date"
                    // style={{ all: "revert" }}
                    aria-describedby="date-error"
                    onChange={setRow("date")}
                />
                
                {/* Details Field */}
                {/* <FormErrorMessenger describedBy="details-error"
                    errorState={errState}
                    colName="details"
                    styles={`${formErrMsgStyle}`}
                /> */}
    
                <input type="text" 
                    name="details"
                    placeholder="Details"
                    title="Details"
                    aria-describedby="details-error"
                    className={`${formFieldStyle} border-b-1`}
                    onChange={setRow("details")}
                    value={transactionRow.details}
                />
    
                {/* Amount Field */}
                {/* <FormErrorMessenger describedBy="amount-error"
                    errorState={errState}
                    colName="amount"
                    styles={`${formErrMsgStyle}`}
                /> */}
    
                <div onDoubleClick={_ => setAmountFrmt(f => f === "calculate" ? "constant" : "calculate")}>
                    {amountFrmt === "constant"
                        ? <input type="number" 
                            name="amount"
                            placeholder="Amount"
                            min={0}
                            title="Amount"
                            aria-describedby="amount-error"
                            className={`${formFieldStyle} border-b-1`}
                            value={transactionRow.amount}
                            onChange={setRow("amount")}
                        />
                        : <input type="text" 
                            name="calc_amount"
                            placeholder="Calculate Amount"
                            className={`${formFieldStyle} border-b-1`}
                            value={transactionRow.amount}
                            onChange={setRow("amount")}
                        />
                    }
                </div>
                
                {/* Transaction Field */}
                {/* <FormErrorMessenger describedBy="transaction-error"
                    errorState={errState}
                    colName="transaction"
                    styles={`${formErrMsgStyle}`}
                /> */}
    
                <select name="transaction" 
                    className={`${formFieldStyle} bg-gray-700`}
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
                {/* <FormErrorMessenger describedBy="transaction_mode"
                    errorState={errState}
                    colName="transaction_mode"
                    styles={`${formErrMsgStyle}`}
                /> */}
    
                <select name="transaction_mode" 
                    className={`${formFieldStyle} bg-gray-700`}
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
                {/* <FormErrorMessenger describedBy="category"
                    errorState={errState}
                    colName="category"
                    styles={`${formErrMsgStyle}`}
                /> */}
                
                <select name="category"
                    title="Category"
                    className={`${formFieldStyle} bg-gray-700`}
                    aria-describedby="category-error"
                    value={transactionRow.category}
                    onChange={setRow("category")}
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
                    <button title="Save transaction" 
                        className="text-xl"
                        onClick={addToStaged}
                    >💾</button>
                </div>
            </div>
        </div>
    )
}

function validate(data: InputRow) {
    const validated = schemaTransactionsFormData.safeParse({
        date: new Date(data.date as string),
        details: data.details,
        amount: data.amount,
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