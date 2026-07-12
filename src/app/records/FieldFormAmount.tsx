"use client"

import { useState } from "react";

import { amountOpKeys } from "@/src/helpers/constants";

type AmountOpKeys = typeof amountOpKeys[number]

const fieldStyle = "border-b-1 py-1 w-30"

export default function FieldFormAmount() {
    const [operator, setOperator] = useState<AmountOpKeys>("=")

    return <div className="flex gap-2 justify-between">
        <select name="amount_op"
            value={operator}
            className="bg-gray-700"
            onChange={e => setOperator(e.target.value as AmountOpKeys)}
        >
            {amountOpKeys.map(key => (
                <option key={key} value={key}>{key}</option>
            ))}
        </select>

        {operator === "between"
            ? <div className="flex flex-col items-end gap-1">
                <div>
                    <label>Start: </label>
                    <input type="text" 
                        name="init_amount"
                        placeholder="Amount"
                        defaultValue={""}
                        className={`${fieldStyle}`}
                    />
                </div>

                <div>
                    <label>End: </label>
                    <input type="text" 
                        name="amount"
                        placeholder="Amount"
                        defaultValue={""}
                        className={`${fieldStyle}`}
                    />
                </div>
            </div>
            : <input type="text" 
                name="amount"
                placeholder="Amount"
                defaultValue={""}
                className={`${fieldStyle}`}
            />
        }
    </div>
}