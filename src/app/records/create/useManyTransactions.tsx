"use client"

import { TransactionsType } from "@/src/types/types"
import { Session } from "next-auth"
import { useEffect, useState } from "react"

export const defaultRow: TransactionsType = {
    trans_no: 0,
    date: new Date(),
    details: "",
    quantity: 1,
    amount: 0,
    total: 0,
    transaction: "expenses",
    transaction_mode: "Stash",
    category: "",
    userId: 0,
}

export function useManyTransactions(user: Session["user"]) {
    const [delAll, setDelAll] = useState<boolean>(false)
    const [stage, setStage] = useState<TransactionsType[]>([])

    useEffect(() => {
        const stored = localStorage.getItem("staged_transactions")
        if (!stored) return

        const parsed = JSON.parse(stored) as TransactionsType[]
        setStage(
            parsed.reduce((acc: TransactionsType[], row) => {
                if (row.userId === Number(user.id as string)) acc.push(row);
                return acc
            }, [])
        )
    }, [])

    useEffect(() => {
        if (stage.length === 0 && !delAll) return
        
        const stored = localStorage.getItem("staged_transactions")
        
        if (!stored) {
            localStorage.setItem("staged_transactions", JSON.stringify(stage))
            return
        }

        const parsed = JSON.parse(stored) as TransactionsType[]
        const notOwnedRows = parsed.reduce((acc: TransactionsType[], row) => {
            if (row.userId !== Number(user.id as string)) acc.push(row);
            return acc
        }, [])

        localStorage.setItem("staged_transactions", JSON.stringify([...notOwnedRows, ...stage]))
    }, [stage])

    function removeItem(trans_no: number) {
        setStage(p => p.filter(item => item.trans_no !== trans_no))
    }

    function removeAll() {
        setDelAll(true)
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