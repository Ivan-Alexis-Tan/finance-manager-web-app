import { FormErrorMsgerType } from "@/src/types/types"

export default function FormErrorMessenger({ describedBy, errorState, colName, styles = ""}: FormErrorMsgerType) {
    const errorMessage = errorState.errors?.[colName]

    return errorMessage && (
        <div id={describedBy} aria-live="polite" aria-atomic="true" className={styles}>
            <p>{errorMessage}</p>
        </div>
    )
}