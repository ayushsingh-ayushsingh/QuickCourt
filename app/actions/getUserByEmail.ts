"use server"

import { db } from "@/db/drizzle"
import { user } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getUserByEmail(email: string) {
    const result = await db
        .select()
        .from(user)
        .where(eq(user.email, email))
        .limit(1)

    return result[0] || null
}
