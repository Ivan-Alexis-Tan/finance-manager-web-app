"use server"

import { Session } from "next-auth";
import { Suspense } from "react";

import { getCategories, getDistinctDetails } from "@/src/actions/actions"
import { auth } from "@/auth"

import CreateTransactionForm from "./CreateTransactionForm"
import Loading from "@/src/components/Loading";

export default async function Page() {
    const session = await auth();
    const categories = await getCategories()
    const distinctDetails = await getDistinctDetails()

    return (
        <div className="flex flex-col border-2 rounded-2xl m-6 md:m-10 md:p-8 p-4">
            <h1 className="text-4xl text-center font-bold">Create Transaction</h1>

            <Suspense fallback={<Loading className="my-20" />}>
                <CreateTransactionForm 
                    categories={categories}
                    distinctDetails={distinctDetails}
                    user={session?.user as Session["user"]} 
                />
            </Suspense>
        </div>
    )
}