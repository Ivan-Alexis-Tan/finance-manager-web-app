import type { transactionsCreateInput } from "../generated/prisma/models";

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

type TransactionColumnNames = keyof transactionsCreateInput