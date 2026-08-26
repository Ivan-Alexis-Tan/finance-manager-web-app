import { prisma } from "@/src/lib/prisma"

import { TransactionsGetPayload } from "@/src/generated/prisma/models"
import { TransactionsType } from "@/src/types/types"

import { serializedTransaction } from "@/src/helpers/helperFn"
import { getCategories } from "@/src/actions/actions"

import EditTransactionForm from "./EditTransactionForm"

export default async function EditTransactionPage({ params }: { params: Promise<{ id: number }>}) {
    const { id } = await params
    
    const transactionData = await prisma.transactions.findUnique({ 
        where: { trans_no: id } 
    });

    const transaction = serializedTransaction(transactionData as TransactionsGetPayload<{}>)
    const categories = await getCategories()

    return (
        <div className="mx-5 mt-5 p-8 border-2 rounded-2xl">
            <h1 className="text-3xl sm:text-4xl text-center font-bold mb-5">
                Edit Transaction
            </h1>

            <EditTransactionForm className="mx-auto"
                defaultVals={transaction as TransactionsType} 
                categories={categories} 
            />
        </div>
    )
}