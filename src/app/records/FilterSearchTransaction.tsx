"use client"

import { 
    transactionMode, 
    transactionParamKeys, 
    transactions 
} from "@/src/helpers/constants"
import { capsEveryWord } from "@/src/helpers/helperFn"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import React, { useState } from "react"
import FieldFormDate from "./FieldFormDate"
import FieldFormAmount from "./FieldFormAmount"
import Link from "next/link"

export default function FilterSearchTransactions({ categories = [] }: { categories: string[]}) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    
    const [enable, setEnable] = useState(false)
    const [formKey, setFormKey] = useState(0)

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const params = new URLSearchParams(searchParams)

        params.set("page", "1")

        for (let field of transactionParamKeys) {
            const val = formData.get(field) as string

            console.log(`${field} val (${typeof val}) =`, val)
            if (val) {
                console.log(`==> ${val}`)
                switch(field) {
                    case "amount_op":
                        if (params.get("amount")) params.set(field, val);
                        else params.delete(field)
                        break
                    default:
                        params.set(field, val)
                }
            }
            else {
                params.delete(field)
            }
        }

        replace(`${pathname}?${params.toString()}`)
    }

    return enable 
        ? <>
            <div className="flex mb-4 gap-5">
                <button onClick={_ => setEnable(false)}
                    title="Close filter search"    
                >❌</button>
                
                <form key={formKey} onSubmit={handleSearch}
                    className="flex gap-5"
                >
                    <FieldFormDate />

                    <input type="text" 
                        name="details"
                        placeholder="Details"
                        defaultValue={""}
                        className="bg-gray-700"
                    />

                    <FieldFormAmount />

                    <select name="transaction"
                        defaultValue={""}
                        className="bg-gray-700"
                    >
                        <option value="" disabled>Transaction</option>
                        <option value="">All</option>
                        {transactions.map(trans => (
                            <option key={trans} value={trans}>{capsEveryWord(trans)}</option>
                        ))}
                    </select>

                    <select name="transaction_mode"
                        defaultValue={""}
                        className="bg-gray-700"
                    >
                        <option value="">Transaction Mode</option>
                        <option value="">All</option>
                        {transactionMode.map(mode => (
                            <option key={mode} value={mode}>{capsEveryWord(mode)}</option>
                        ))}
                    </select>

                    <select name="category"
                        defaultValue={""}
                        className="bg-gray-700"
                    >
                        <option value="" disabled>Category</option>
                        <option value="">All</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{capsEveryWord(cat)}</option>
                        ))}
                    </select>

                    <button type="submit">🔍Search</button>
                </form>
            </div>
            {searchParams.size !== 0 
                && <Link href={"/records"} onClick={_ => setFormKey(k => k + 1)}>
                    Clear filters
                </Link>
            }
            <hr />
            <br />
        </>
        : <div className="flex gap-4">
            <button onClick={_ => setEnable(true)}>Filter Search</button>
            {searchParams.size !== 0 
                && <Link href={"/records"} onClick={_ => setFormKey(k => k + 1)}>
                    Clear filters
                </Link>
            }
        </div>

}