"use server"

import { getCategories } from "@/src/actions/actions"

import CreateTransactionForm from "./CreateTransactionForm"

export default async function Page() {
    const categories = await getCategories()

    return (
        <div className="flex flex-col justify-center items-center border-2 rounded-2xl m-15 p-8">
            <h1 className="text-4xl text-center font-bold">Create Transaction</h1>

            <CreateTransactionForm categories={categories} />
        </div>
    )
}