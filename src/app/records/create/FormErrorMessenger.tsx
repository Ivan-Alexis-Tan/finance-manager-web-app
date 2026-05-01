interface FormErrorMsgerType {
    errorState: TransactionsActionState 
    describedBy: string
    styles: string
    colName: keyof NonNullable<TransactionsActionState['errors']>
}

export default function FormErrorMessenger({ describedBy, errorState, colName, styles = ""}: FormErrorMsgerType) {
    const errorMessage = errorState.errors?.[colName]

    // console.log("ERROR:", errorMessage)
    return errorMessage && (
        <div id={describedBy} aria-live="polite" aria-atomic="true" className={styles}>
            <p>{errorMessage}</p>
        </div>
    )
}