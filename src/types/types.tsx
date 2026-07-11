import { Transactions } from "../generated/prisma/client";
import type { TransactionsCreateInput } from "../generated/prisma/models";
import { amountFormat, transactionMode, transactions } from "../helpers/constants";

export interface TransactionsActionState { 
    errors?: Partial<Record<keyof TransactionsType, string[] | undefined>>;
    message?: string | null; 
}
export type TransactionErrorsStates = TransactionsActionState['errors']

export type TransactionColumnNames = keyof TransactionsCreateInput
export type TransactionColumn = typeof transactions[number]
export type TransactionMode = typeof transactionMode[number]

export type AmountFormat = typeof amountFormat[number] 

export interface FormErrorMsgerType {
    errorState: TransactionsActionState 
    describedBy: string
    styles: string
    colName: keyof NonNullable<TransactionsActionState['errors']>
}

export type TransactionsType = Omit<Transactions, "total" | "trans_no" | "transaction_mode" | "transaction"> & { 
    trans_no?: number
    total: number 
    transaction: TransactionColumn
    transaction_mode: TransactionMode
}

export interface Transaction {
    date: Date;
    details: string;
    amount: number;
    transaction: TransactionColumn;
    transaction_mode: TransactionMode;
    category: string;
}