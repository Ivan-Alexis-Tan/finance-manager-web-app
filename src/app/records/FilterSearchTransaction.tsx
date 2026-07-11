"use client"

import { 
    transactionMode, 
    transactionParamKeys, 
    transactions 
} from "@/src/helpers/constants"
import { capsEveryWord } from "@/src/helpers/helperFn"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import React, { useState } from "react"
import FieldFormDate from "./FieldFormDate"
import FieldFormAmount from "./FieldFormAmount"

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

            if (val) {
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
        ? <form key={formKey} onSubmit={handleSearch}
            className="flex flex-col flex-wrap gap-5 mb-12 bg-[hsl(199,100%,30%)] pb-5"
        >
            <div className="flex justify-end gap-10 p-2">
                <button type="submit"
                    className="hover:bg-white hover:text-black rounded-2xl p-1 px-2 transition-color"
                >🔍Search</button>

                {searchParams.size !== 0 
                    && <Link href={"/records"} 
                            onClick={_ => setFormKey(k => k + 1)}
                            className="hover:bg-white hover:text-black rounded-2xl py-1 px-2 transition-color"
                        >
                            Clear filters
                    </Link>
                }

                <span onClick={_ => setEnable(false)}
                    title="Close filter search"
                    className="bg-black hover:bg-white rounded-full p-1 transition-colors"  
                >❌</span>
                
            </div>
            
            <div className="flex justify-center items-end flex-wrap gap-5">
                <FieldFormDate />

                <input type="text" 
                    name="details"
                    placeholder="Details"
                    defaultValue={""}
                    className="border-b py-1"
                />

                <FieldFormAmount />

                <select name="transaction"
                    defaultValue={""}
                    className="border-b py-1"
                >
                    <option value="" disabled>Transaction</option>
                    <option value="">All</option>
                    {transactions.map(trans => (
                        <option key={trans} value={trans}>{capsEveryWord(trans)}</option>
                    ))}
                </select>

                <select name="transaction_mode"
                    defaultValue={""}
                    className="border-b border-white py-1"
                >
                    <option value="">Transaction Mode</option>
                    <option value="">All</option>
                    {transactionMode.map(mode => (
                        <option key={mode} value={mode}>{capsEveryWord(mode)}</option>
                    ))}
                </select>

                <select name="category"
                    defaultValue={""}
                    className="border-b py-1"
                >
                    <option value="" disabled>Category</option>
                    <option value="">All</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{capsEveryWord(cat)}</option>
                    ))}
                </select>
            </div>
        </form>
        : <div className="mb-5 flex gap-4 items-center">
            <button onClick={_ => setEnable(true)}
                className="p-3 hover:bg-amber-300 hover:text-black rounded-2xl transition-all"
            >&gt; Filter Search</button>
            
            {searchParams.size !== 0 
                && <Link href={"/records"} 
                    onClick={_ => setFormKey(k => k + 1)}
                    className="p-3 hover:bg-amber-300 hover:text-black rounded-2xl transition-all"
                >
                    Clear filters 
                </Link>
            }
        </div>

}