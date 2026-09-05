import Spinner from "./Spinner";

export default function Loading({ className }: { className?: string }) {
    return (
        <div className={`${className ?? ""} gap-3 flex flex-wrap justify-center items-center`}>
            <Spinner />
            <h2 className="text-center text-2xl font-bold">Loading...</h2>
        </div>
    )
}