"use server";

import { db } from "@/db/drizzle";
import { booking } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function getBookingActivity(): Promise<{ date: string; count: number }[]> {
    const results = await db
        .select({
            date: sql`DATE(${booking.startAt})`.as("date"),
            count: sql`COUNT(*)`.as("count"),
        })
        .from(booking)
        .groupBy(sql`DATE(${booking.startAt})`)
        .orderBy(sql`DATE(${booking.startAt})`);

    // convert unknown -> typed values safely
    return results.map((row) => {
        const raw: any = row;
        const rawDate = raw.date;
        const rawCount = raw.count;

        // rawDate can be a Date or a string (depends on pg driver); normalize to YYYY-MM-DD
        let dateStr: string;
        if (rawDate instanceof Date) {
            dateStr = rawDate.toISOString().split("T")[0];
        } else if (typeof rawDate === "string") {
            dateStr = rawDate; // e.g. "2025-08-11"
        } else {
            dateStr = String(rawDate);
        }

        return {
            date: dateStr,
            count: Number(rawCount ?? 0),
        };
    });
}
