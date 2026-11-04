import { prisma } from "@/src/lib/prisma"
import Link from "next/link"
import { Suspense } from "react"

import { Session } from "next-auth"

import { getCategories } from "@/src/actions/actions"
import { amountOpKeys, dateOpKeys, transactionParamKeys } from "@/src/helpers/constants"
import { filterAmount, filterDate } from "@/src/actions/filteringHelpers"
import { auth } from "@/auth"

import TransactionsTable from "./TransactionsTable"
import TransactionPagination from "./TransactionPagination"
import FilterSearchTransactions from "./FilterSearchTransaction"
import RecordsTableSktn from "@/src/components/skeleton/RecordsTableSktn"
import RecordsPaginationSktn from "@/src/components/skeleton/RecordsPaginationSktn"
import { getManyTransactions } from "@/src/actions/transactions"

type TransactionParamKeys = Partial<Record<typeof transactionParamKeys[number], string>>

interface SearchParamsProps {
    searchParams?: Promise<{ page?: string } & TransactionParamKeys>
}

export default async function Page(props: SearchParamsProps) {
    const session = await auth()
    const searchParams = await props.searchParams;
    const queries = transactionParamKeys.reduce((acc: TransactionParamKeys, field) => {
        const val = searchParams?.[field] || ""

        if (val) acc[field] = val;
        return acc
    }, {})

    const currentPage = searchParams?.page || 1;
    const filterConfigs = [
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

    const transactionData = getManyTransactions(session as Session, queries, filterConfigs, currentPage)

    const totalRows = prisma.transactions.count({
        where: (Object.keys(queries).length >= 1) 
            ? { AND: filterConfigs } 
            : undefined
    })
    const categories = getCategories()

    return (
        <div>
            <h1 className="text-center text-4xl font-bold">Records</h1>
            
            <Link href="/records/create" 
                className="flex justify-center items-center m-5 gap-2"
            >
                <span className="bg-white rounded-full p-1">
                    ➕
                </span>
                <span className="hover:text-(--accent-clr)">
                    New Transaction
                </span>
            </Link>

            <FilterSearchTransactions categoriesPromise={categories} />

            <div className="mb-5">
                <Suspense fallback={<RecordsPaginationSktn />}>
                    <TransactionPagination totalRowsPromise={totalRows} />
                </Suspense>
            </div>

            <div className="overflow-auto">
                <Suspense fallback={<RecordsTableSktn className="mx-auto" />}>
                    <TransactionsTable 
                        className="mx-auto max-w-300 w-full [&_table]:rounded"
                        transactionData={transactionData} 
                    />
                </Suspense>
            </div>
        </div>
    )
}