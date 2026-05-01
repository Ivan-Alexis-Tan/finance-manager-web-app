import { z } from "zod"
import { transactionMode, transactions } from "../helpers/constants"

export const schemaFormAction = z.object({
    error: z.string().nullable(),
    message: z.string().nullable(),
})

export const schemaTransactions = z.object({
    id: z.coerce.number(),
    date: z.date(
        { error: "Date is required."},
    ),
    details: z.string().min(1,
        { error: "Must have description of the transaction." }
    ),
    amount: z.coerce.number(
        { error: "Must have transaction amount" }
    )
        .min(0, { error: "Amount must be equal or greater than 0." }),
    transaction: z.enum(transactions,
        { error: "Please select a transaction." }
    ),
    transaction_mode: z.enum(transactionMode,
        { error: "Please select a mode of transaction." }
    ),
    category: z.string({
        error: "Category cannot be null."
    }).min(1, {
        error: "Please select a category."
    })
})

export const schemaTransactionsFormData = schemaTransactions.omit({ id: true })