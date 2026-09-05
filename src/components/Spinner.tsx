export default function Spinner({ className }: { className?: string }) {
    return (
        <div className={`
                ${className ?? ""} 
                size-6 
                animate-spin 
                border-4 
                rounded-full 
                border-t-(--accent-clr)
                border-l-(--accent-clr)
                border-r-transparent
                border-b-transparent
            `} 
        />
    )
}