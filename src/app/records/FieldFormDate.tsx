import { dateOpKeys } from "@/src/helpers/constants";

export default function FieldFormDate() {
    return <div>
        <select name="date_op"
            defaultValue={"<="}
            className="bg-gray-700"
        >
            {dateOpKeys.map(method => (
                <option key={method} value={method}>{method}</option>
            ))}
        </select>

        <input type="date" 
            name="date"
            defaultValue={new Date().toISOString().split("T")[0]}
        />
    </div>
}