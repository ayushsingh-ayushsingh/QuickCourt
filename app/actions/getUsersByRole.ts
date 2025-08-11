"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUsersByRole(role: string) {
    if (role === "all") {
        return await db.select().from(user);
    }
    return await db.select().from(user).where(eq(user.role, role));
}
