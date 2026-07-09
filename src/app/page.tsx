import { auth } from "@/auth";
import Signin from "./Sign-in";

export default async function Home() {
  const session = await auth();
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-5">Finance Manager</h1>

      <p className="mb-5">Your personal finance tracker and recorder.</p>
      
      {!session?.user && <p className="text-red-500 text-center mb-5">No user has logged in yet.</p>}
      <div className="flex justify-center mb-5">
        <div className="w-[80%]">
          <Signin />
        </div>
      </div>
    </div>
  );
}
