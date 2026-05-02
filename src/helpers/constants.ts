export const transactions = ["expenses", "income", "withdraw", "deposit"] as const
export const transactionMode = ["Stash", "Bank", "G-cash"] as const

export const transactionFields = ["date", "details", "amount", "transaction", "transaction_mode", "category"] as const
export const transactionParamKeys = ["date", "date_op", "init_date", "details", "amount", "amount_op", "init_amount", "transaction", "transaction_mode", "category"] as const

export const dateOpKeys = ["=", ">=", "<=", ">", "<", "between"] as const

export const amountOpKeys = ["=", ">=", "<=", ">", "<", "between"] as const
export const amountFormat = ["constant", "calculate"] as const