import { prisma } from "@/src/lib/prisma"
import Link from "next/link"

import TransactionsTable from "./RecordsTable"
import TransactionPagination from "./TransactionPagination"
import FilterSearchTransactions from "./FilterSearchTransaction"
import { getCategories } from "@/src/actions/actions"
import { amountOpKeys, dateOpKeys, transactionParamKeys } from "@/src/helpers/constants"
import { filterAmount, filterDate } from "@/src/actions/filteringHelpers"

type TransactionParamKeys = Partial<Record<typeof transactionParamKeys[number], string>>

interface SearchParamsProps {
    searchParams?: Promise<{ page?: string } & TransactionParamKeys>
}

export default async function Page(props: SearchParamsProps) {
    const searchParams = await props.searchParams;
    const queries = transactionParamKeys.reduce((acc: TransactionParamKeys, field) => {
        const val = searchParams?.[field] || ""

        if (val) acc[field] = val;
        return acc
    }, {})

    const currentPage = searchParams?.page || 1;

    const data = await prisma.transactions.findMany({
        where: Object.keys(queries).length >= 1
            ? {
                AND: [
                    filterDate(
                        queries.date as string, 
                        queries.date_op as typeof dateOpKeys[number],
                        queries.init_date
                    ),
                    { details: { contains: queries.details } },
                    filterAmount(
                        queries.amount as string, 
                        queries.amount_op as typeof amountOpKeys[number],
                        queries.init_amount
                    ),
                    { transaction: { contains: queries.transaction } },
                    { transaction_mode: { contains: queries.transaction_mode } },
                    { category: { contains: queries.category } },
                ]
            } 
            : undefined ,
        orderBy: { date: "desc" },
        take: 20,
        skip: Number(currentPage) * 20 - 20,
    })

    const totalRows = await prisma.transactions.count({
        where: Object.keys(queries).length >= 1
            ? {
                AND: [
                    filterDate(
                        queries.date as string, 
                        queries.date_op as typeof dateOpKeys[number],
                        queries.init_date
                    ),
                    { details: { contains: queries.details } },
                    filterAmount(
                        queries.amount as string, 
                        queries.amount_op as typeof amountOpKeys[number],
                        queries.init_amount
                    ),
                    { transaction: { contains: queries.transaction } },
                    { transaction_mode: { contains: queries.transaction_mode } },
                    { category: { contains: queries.category } },
                ]
            } 
            : undefined
    })
    const categories = await getCategories()

    return (
        <div>
            <h1 className="text-center text-4xl font-bold">Records</h1>
            
            <Link href="/records/create" className="flex justify-center items-center m-5 gap-2">
                <span className="bg-[hsl(173,50%,50%)] rounded-full p-1">
                    ➕
                </span> New Transaction
            </Link>

            <FilterSearchTransactions categories={categories} />
            
            <TransactionsTable transactionData={data} />
            <TransactionPagination totalRows={totalRows} />
        </div>
    )
}