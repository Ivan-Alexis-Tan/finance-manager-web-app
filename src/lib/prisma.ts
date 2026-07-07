import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const client = new PrismaClient({ adapter })
const globalForPrisma = globalThis as {
    prisma?: PrismaClient;
}

export const prisma = globalForPrisma.prisma ?? client;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma