import { amountOpKeys } from "@/src/helpers/constants";

export default function FieldFormAmount() {
    return <div>
        <select name="amount_op"
            defaultValue={"="}
            className="bg-gray-700"
        >
            {amountOpKeys.map(key => (
                <option key={key} value={key}>{key}</option>
            ))}
        </select>

        <input type="text" 
            name="amount"
            placeholder="Amount"
            defaultValue={""}
            className="bg-gray-700"
        />
    </div>
}