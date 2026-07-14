import { auth } from "@/auth"
import Image from "next/image"

export default async function UserPage() {
    const session = await auth()
    
    return (
        <div>
            <Image className="rounded-full mb-5"
                src={session?.user.image as string} 
                alt="user-image" 
                height={50} width={50} 
            />
        
            <h2 className="text-2xl font-bold">{session?.user.name as string}</h2>
            <p><i>{session?.user.email}</i></p>
        </div>
    )
}