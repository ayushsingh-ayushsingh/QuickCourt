"use server";

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";

export async function toggleUserBan(userId: string, banStatus: boolean) {
    await db
        .update(user)
        .set({ isBanned: banStatus })
        .where(eq(user.id, userId))
}
