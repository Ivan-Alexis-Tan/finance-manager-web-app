"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { evaluate } from "mathjs"

import { prisma } from "../lib/prisma"
import { schemaTransactionsFormData } from "../schemas/schemas"
import { TransactionsActionState } from "../types/types"
import { transactionsCreateInput } from "../generated/prisma/models"

export async function createTransactions(
    prevState: TransactionsActionState, 
    formData: FormData
): Promise<TransactionsActionState> {
    const validatedFields = schemaTransactionsFormData.safeParse({
        date: new Date(formData.get("date") as string),
        details: formData.get("details"),
        amount: formData.get("amount") || evaluate(formData.get("calc_amount") as string),
        transaction: formData.get("transaction"),
        transaction_mode: formData.get("transaction_mode"),
        category: formData.get("category"),
    })

    if (!validatedFields.success) return { 
        errors: validatedFields.error.flatten().fieldErrors, 
        message: "Invalid field values." 
    }

    const { date, details, amount, transaction, transaction_mode, category } = validatedFields.data
    try {
        await prisma.transactions.create({
            data: {
                date: new Date(date),
                details: details,
                amount: amount,
                transaction: transaction,
                transaction_mode: transaction_mode,
                category: category,
            },
        })

    }
    catch(err) {
        console.error(`ERROR: ${err}`)
        return { message: "Database Error: Faild to create transaction."}
    }

    revalidatePath("/records")
    redirect('/records')
}

export async function deleteTransaction(id: number) {
    try {
        await prisma.transactions.delete({ where: { trans_no: id }})
    }
    catch(err) {
        console.error(err)
    }

    revalidatePath("/records")
}

export async function editTransaction(
    id: number, 
    prevState: TransactionsActionState, 
    formData: FormData
): Promise<TransactionsActionState> {
    const validatedFields = schemaTransactionsFormData.safeParse({
        date: new Date(formData.get("date") as string),
        details: formData.get("details"),
        amount: formData.get("amount") || evaluate(formData.get("calc_amount") as string),
        transaction: formData.get("transaction"),
        transaction_mode: formData.get("transaction_mode"),
        category: formData.get("category"),
    })

    if (!validatedFields.success) return { 
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid field values."
    }
    
    const { date, details, amount, transaction, transaction_mode, category} = validatedFields.data
    try {
        await prisma.transactions.upsert({
            where: { trans_no: id },
            update: {
                date: new Date(date),
                details: details,
                amount: amount,
                transaction: transaction,
                transaction_mode: transaction_mode,
                category: category,
            },
            create: {
                date: new Date(date),
                details: details,
                amount: amount,
                transaction: transaction,
                transaction_mode: transaction_mode,
                category: category,
            },
        })
    }
    catch(err) {
        console.log("ERROR:", err)
        return { message: "Error: Failed to edit transaction."}
    }

    revalidatePath('/records')
    redirect("/records")
}

export async function getCategories() {
    return (
        await prisma.transactions.findMany({
            distinct: ['category'],
            select: {
                category: true
            }
        })
    ).reduce((acc: string[], row) => {
        if (row.category !== "--" && row.category !== "???") acc.push(row.category);
        return acc
    }, []).sort()
}

export async function createManyTransactions(transactionRows: transactionsCreateInput[]) {
    const refinedRows = transactionRows.map(({trans_no, ...rest}) => rest)
    
    try {
        await prisma.transactions.createMany({
            data: refinedRows
        })
    }
    catch(err) {
        console.log("ERROR:", err)
        return { message: "ERROR: Failed to create transactions."}
    }
    redirect("/records")
}