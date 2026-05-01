import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl text-center font-bold">Finance Manager</h1>

        <Link href={"/login"} className="hover:text-amber-300">Login</Link>
        <Link href={"/records"}>My Records</Link>
      </main>
    </div>
  );
}
