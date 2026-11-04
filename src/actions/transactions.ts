"use server"

import { Session } from "next-auth"
import { prisma } from "../lib/prisma"
import { serializedTransactions } from "../helpers/helperFn"
import { TransactionsType } from "../types/types"

export async function getManyTransactions(
    session: Session, 
    queries: {}, 
    filterConfigs: any[], 
    currentPage: string | 1
): Promise<TransactionsType[]> {
    const transactions = await prisma.transactions.findMany({
        where: { 
            userId: Number(session?.user.id as Session["user"]["id"]),
            AND: (Object.keys(queries).length >= 1) ? filterConfigs : undefined,
        },
        orderBy: { date: "desc" },
        take: 20,
        skip: Number(currentPage) * 20 - 20,
    })

    return serializedTransactions(transactions)
}