export default function RecordsTableSktn({ className }: { className?: string }) {
    return (
        <div className={`${className ?? ""} overflow-x-auto px-5 pb-2 bg-gray-700 rounded border-collapse`}>
                <table className="w-full min-w-md [&_td]:p-1">
                    <thead>
                        <tr className="border-b border-b-gray-900 font-bold">
                            <td></td>
                            <td>Date</td>
                            <td>Details</td>
                            <td>Quantity</td>
                            <td>Amount</td>
                            <td>Total</td>
                            <td>Transaction</td>
                            <td>Transaction Mode</td>
                            <td>Category</td>
                        </tr>
                    </thead>
                    <tbody className="[&_p]:bg-gray-400 [&_p]:text-gray-400 [&_p]:rounded-2xl [&_p]:text-center">
                        {Array.from({ length: 20 }, (_, index) => (
                            <tr key={index}>
                                <td className="flex">
                                    <span>✏️</span>
                                    <span>🗑️</span>
                                </td>
                                <td className="min-w-25.5"><p>Date</p></td>
                                <td className="min-w-24.75"><p>Details</p></td>
                                <td className="min-w-19"><p>Quantity</p></td>
                                <td className="min-w-17.25"><p>Amount</p></td>
                                <td className="min-w-12.5"><p>_</p></td>
                                <td className="min-w-[100.5px]"><p>Transaction</p></td>
                                <td className="min-w-[100.5px]"><p>Mode</p></td>
                                <td className="min-w-28"><p>Category</p></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    )
}