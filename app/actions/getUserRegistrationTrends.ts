"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function getUserRegistrationTrends() {
    const result = await db
        .select({
            date: sql`date("created_at")`,
            count: sql`count(*)`,
        })
        .from(user)
        .groupBy(sql`date("created_at")`)
        .orderBy(sql`date("created_at")`);

    return result.map((row: any) => ({
        date: new Date(row.date).toISOString().split("T")[0],
        count: Number(row.count),
    }));
}
