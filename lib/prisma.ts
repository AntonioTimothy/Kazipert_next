// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

let databaseUrl = process.env.DATABASE_URL ?? ""

if (process.env.NODE_ENV === "production") {
    if (typeof window === "undefined") {
        const host = process.env.VERCEL_URL || process.env.BASE_URL_LIVE
        if (host?.includes("kazipert.com")) {
            databaseUrl = process.env.DATABASE_URL_LIVE!
        } else if (host?.includes("app.kazipert.com")) {
            databaseUrl = process.env.DATABASE_URL_TEST!
        }
    }
}

export const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
})
