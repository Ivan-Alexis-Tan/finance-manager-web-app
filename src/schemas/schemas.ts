import { z } from "zod"
import { transactionMode, transactions } from "../helpers/constants"

export const schemaFormAction = z.object({
    error: z.string().nullable(),
    message: z.string().nullable(),
})

export const schemaTransactions = z.object({
    trans_no: z.coerce.number().nullable(),

    date: z.date(
        { error: "Date is required."},
    ),

    details: z.string().min(1,
        { error: "Must have description of the transaction." }
    ),

    quantity: z.coerce.number().min(1,
        { error: "Must be equal or greater than 1." }
    ),

    amount: z.coerce.number(
        { error: "Must have transaction amount" }
    ).min( 0, 
        { error: "Amount must be equal or greater than 0." }
    ),

    total: z.coerce.number().min(0, 
        { error: "Must be greater or equal to 1" }
    ),

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
    }),

    userId: z.coerce.number().min(0).nullable(),
})

export const schemaTransactionsFormData = schemaTransactions.omit({ trans_no: true, userId: true })