"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { and, eq, ilike, or } from "drizzle-orm";

export async function getUsersByRole(role: string, status: string, search: string) {
    let conditions: any[] = [];

    if (role !== "all") {
        conditions.push(eq(user.role, role));
    }

    if (status === "verified") {
        conditions.push(eq(user.emailVerified, true));
    } else if (status === "not_verified") {
        conditions.push(eq(user.emailVerified, false));
    }

    if (search && search.trim() !== "") {
        const pattern = `%${search}%`;
        conditions.push(
            or(
                ilike(user.name, pattern),
                ilike(user.email, pattern)
            )
        );
    }

    return await db.select().from(user).where(conditions.length ? and(...conditions) : undefined);
}
