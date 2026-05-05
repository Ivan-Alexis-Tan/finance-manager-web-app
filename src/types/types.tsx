import type { transactionsCreateInput } from "../generated/prisma/models";
import { amountFormat, transactionMode, transactions } from "../helpers/constants";

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
export type TransactionErrorsStates = TransactionsActionState['errors']

export type TransactionColumnNames = keyof transactionsCreateInput
export type TransactionColumn = typeof transactions[number]
export type TransactionMode = typeof transactionMode[number]

export type AmountFormat = typeof amountFormat[number] 

export interface FormErrorMsgerType {
    errorState: TransactionsActionState 
    describedBy: string
    styles: string
    colName: keyof NonNullable<TransactionsActionState['errors']>
}

export interface Transaction {
    date: Date;
    details: string;
    amount: number;
    transaction: TransactionColumn;
    transaction_mode: TransactionMode;
    category: string;
}