"use client"

import { useState } from "react";

import { dateOpKeys } from "@/src/helpers/constants";

export default function FieldFormDate() {
    const [operator, setOperator] = useState("<=")
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    return <div className="flex gap-2">
        <select name="date_op"
            value={operator}
            className="bg-gray-700"
            onChange={e => setOperator(e.target.value)}
        >
            {dateOpKeys.map(key => (
                <option key={key} value={key}>{key}</option>
            ))}
        </select>

        {operator !== 'between'
            ? <input type="date" 
                name="date"
                defaultValue={today}
                className="border-b py-1"
            />
            : <div className="flex flex-col justify-end">
                <div>
                    <label>Start: </label>
                    <input type="date" 
                        name="init_date"
                        defaultValue={yesterday.toISOString().split("T")[0]}
                    />
                </div>
                
                <div className="flex justify-end">
                    <label>End: </label>
                    <input type="date" 
                        name="date"
                        defaultValue={today}
                        className="border-b"
                    />
                </div>
            </div>
        }
    </div>
}