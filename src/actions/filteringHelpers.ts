import { amountOpKeys, dateOpKeys } from "../helpers/constants"

export function filterAmount(amount: number | string, operator: typeof amountOpKeys[number], initAmount?: string | number) {
    if (!amount) return {}
    const val = Number(amount)
    
    switch(operator) {
        case "<":
            return { amount: { lt: val } }
        case "<=":
            return { amount: { lte: val } }
        case ">":
            return { amount: { gt: val } }
        case ">=":
            return { amount: { gte: val } }
        case "between":
            return { amount: {
                gte: Number(initAmount),
                lte: val,
            }}
        default:
            return { amount: { equals: val } }
    }
}

export function filterDate(date: string, operator: typeof dateOpKeys[number], initDate?: string) {
    if(!date) return {}
    const toDate = new Date(date)

    switch(operator) {
        case "=":
            return { date: { equal: toDate } }
        case ">":
            return { date: { gt: toDate } }
        case ">=":
            return { date: { gte: toDate } }
        case "<":
            return { date: { lt: toDate } }
        case "between":
            return { date: {
                gte: new Date(initDate as string),
                lte: toDate,
            }}
        default:
            return { date: { lte: toDate } }
    }
}