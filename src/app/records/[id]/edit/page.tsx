import EditTransactionForm from "./EditTransactionForm"
import { prisma } from "@/src/lib/prisma"
import { transactionsUncheckedCreateInput } from "@/src/generated/prisma/models"

export default async function Page({ params }: { params: Promise<{ id: number }>}) {
    const { id } = await params
    const transactionData = await prisma.transactions.findUnique({
        where: { trans_no: Number(id) }
    })

    return (
        <div className="flex flex-col justify-center items-center border-2 rounded-2xl m-15 p-8">
            <h1 className="text-4xl text-center font-bold mb-15">
                Edit Transaction
            </h1>

            <EditTransactionForm defaultVals={transactionData as transactionsUncheckedCreateInput} />
        </div>
    )
}