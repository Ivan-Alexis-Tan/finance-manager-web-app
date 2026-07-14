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
        <div className="flex flex-col justify-center items-center border-2 rounded-2xl m-15 p-8">
            <h1 className="text-4xl text-center font-bold mb-15">
                Edit Transaction
            </h1>

            <EditTransactionForm 
                defaultVals={transaction as TransactionsType} 
                categories={categories} 
            />
        </div>
    )
}