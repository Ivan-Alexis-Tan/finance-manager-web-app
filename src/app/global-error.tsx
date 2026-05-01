"use client"

import { useEffect } from "react"

interface ErrorHandler {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset,}: ErrorHandler) {
    useEffect(() => {
        // log the error to an error reporting service
        console.error(error)
    },[error])

    return (
        <div>
            <h2>Something went wrong!</h2>
            <button onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
            }>Try again</button>
        </div>
    )
}