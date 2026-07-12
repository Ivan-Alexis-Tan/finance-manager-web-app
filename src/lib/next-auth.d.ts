import "next-auth"
import { DefaultSession } from "next-auth"
import { Role } from "../generated/prisma/enums"

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            role: Role
        }
    }

    interface User {
        role: Role
    }
}