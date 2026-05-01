"use client"

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation"

interface PageArrowComp {
    direction: "left" | "right"
    href: string
}

export default function TransactionPagination({ totalRows }: { totalRows: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const totalPages = Math.floor(totalRows / 20)
    const params = new URLSearchParams(searchParams)

    function pageNumbers(pageNum: number) {
        const pages = {
            l: pageNum-2, 
            lm: pageNum-1, 
            m: pageNum, 
            rm: pageNum+1, 
            r: pageNum+2,
        }
        
        if (pages.r > totalPages) return [totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages]
        if (pages.l <= 0) return [1, 2, 3, 4, 5]
        return [pages.l, pages.lm, pages.m, pages.rm, pages.r]
    }

    function createURL(pageNum: number | string) {
        const params = new URLSearchParams(searchParams)
        params.set("page", pageNum.toString());
        
        return `${pathname}?${params.toString()}`
    }

    return (
        <div className="flex flex-col justify-center items-center gap-y-3">
            <div className="flex flex-col justify-center items-center">
                <p className="text-2xl font-bold my-0">Page</p>
                <span className="my-0">{currentPage} / {totalPages}</span>
            </div>

            <div className="flex justify-center items-center gap-3 mt-2">
                <PageArrow direction="left" href={createURL(Math.max(currentPage - 5, 1))} />

                <div className="flex justify-center items-center gap-y-10">
                    {pageNumbers(currentPage).map(n => (
                        <Link key={n} 
                            className="text-3xl m-2 bg-[hsl(173,50%,50%)] text-black px-2 rounded-md hover:bg-[hsl(173,50%,75%)] transition-colors"
                            href={createURL(Number(n))}
                        >{n}</Link>
                    ))}
                </div>

                <PageArrow direction="right" href={createURL(Math.min(currentPage + 5, totalPages))} />
            </div>
        </div>
    )
}

const PageArrow = ({ direction, href }: PageArrowComp) => {
    if (direction === "left") return <Link href={href} className="text-xl hover:text-2xl" title="Jump 5 pages backward">⬅️</Link>
    return <Link href={href} className="text-xl hover:text-2xl" title="Jump 5 pages forward">➡️</Link>
}
