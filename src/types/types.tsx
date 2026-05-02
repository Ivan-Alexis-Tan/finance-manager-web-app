import type { transactionsCreateInput } from "../generated/prisma/models";
import { amountFormat } from "../helpers/constants";

export interface TransactionsActionState { 
    errors?: {
        date?: string[]
        details?: string[]
        amount?: string[]
        transaction?: string[]
        transaction_mode?: string[]
        category?: string[]
    };
    message?: string | null; 
}

export type TransactionColumnNames = keyof transactionsCreateInput

export type AmountFormat = typeof amountFormat[number] 