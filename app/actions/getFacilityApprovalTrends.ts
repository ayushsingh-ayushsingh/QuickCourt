"use server";

import { db } from "@/db/drizzle";
import { venue } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getFacilityApprovalTrends() {
    const result = await db
        .select({
            date: sql`CAST("created_at" AS date)`,
            count: sql`count(*)`,
        })
        .from(venue)
        .where(eq(venue.isApproved, true))
        .groupBy(sql`CAST("created_at" AS date)`)
        .orderBy(sql`CAST("created_at" AS date)`);

    return result.map((row: any) => ({
        date: new Date(row.date).toISOString().split("T")[0],
        count: Number(row.count),
    }));
}
