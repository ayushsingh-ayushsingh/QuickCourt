"use server"

import { db } from "@/db/drizzle"
import { user } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function approveUserAction(userId: string) {
    // Maybe add admin authentication here
    const [u] = await db.select().from(user).where(eq(user.id, userId))
    if (!u?.pendingRole) throw new Error("No pending role to approve")

    await db.update(user)
        .set({
            role: u.pendingRole,
            pendingRole: null,
            updatedAt: new Date()
        })
        .where(eq(user.id, userId))

    return { success: true }
}
