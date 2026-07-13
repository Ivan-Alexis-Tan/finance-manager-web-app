"use server"

import { Session } from "next-auth";

import { getCategories } from "@/src/actions/actions"
import { auth } from "@/auth"

import CreateTransactionForm from "./CreateTransactionForm"

export default async function Page() {
    const session = await auth();
    const categories = await getCategories()

    return (
        <div className="flex flex-col border-2 rounded-2xl m-6 md:m-10 md:p-8 p-4">
            <h1 className="text-4xl text-center font-bold">Create Transaction</h1>

            <CreateTransactionForm categories={categories} user={session?.user as Session["user"]} />
        </div>
    )
}