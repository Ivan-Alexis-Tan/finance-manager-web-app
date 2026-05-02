"use client"

import { amountOpKeys } from "@/src/helpers/constants";
import { useState } from "react";

type AmountOpKeys = typeof amountOpKeys[number]

export default function FieldFormAmount() {
    const [operator, setOperator] = useState<AmountOpKeys>("=")

    return <div>
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
            ? <div>
                <input type="text" 
                    name="init_amount"
                    placeholder="Amount"
                    defaultValue={""}
                    className="bg-gray-700"
                />

                <input type="text" 
                    name="amount"
                    placeholder="Amount"
                    defaultValue={""}
                    className="bg-gray-700"
                />
            </div>
            : <input type="text" 
                name="amount"
                placeholder="Amount"
                defaultValue={""}
                className="bg-gray-700"
            />
        }
    </div>
}