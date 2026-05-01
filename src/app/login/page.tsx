import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex justify-center flex-col">
            <Link href={"/"}>Home</Link>
            <h1 className="text-4xl font-bold text-center">Login Page</h1>
        </div>
    )
}