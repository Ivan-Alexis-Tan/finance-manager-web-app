export default function RecordsPaginationSktn({ className }: { className?: string }) {
    return (
        <div className={`${className ?? ""} gap-y-3 flex flex-col justify-center items-center`}>
            <div className="mb-2 flex flex-col justify-center items-center">
                <p className="text-2xl font-bold my-0">Page</p>
                <span className="my-0">Loading pages...</span>
            </div>

            <div className="gap-3 flex justify-center items-center">
                <p className="text-xl hover:text-2xl" 
                    title="Jump 5 pages backward"
                >⬅️</p>
                    <p className="m-2 text-3xl bg-gray-400 text-black px-2 rounded-md hover:bg-[hsl(173,50%,75%)] transition-colors">
                    1
                    </p>
                <p className="text-xl hover:text-2xl" 
                    title="Jump 5 pages forward"
                >➡️</p>
            </div>
        </div>
    )
}