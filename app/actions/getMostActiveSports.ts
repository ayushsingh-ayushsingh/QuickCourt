"use server";

import { db } from "@/db/drizzle";
import { booking, court, sport } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function getMostActiveSports() {
    // Join booking → court → sport and count bookings per sport
    const result = await db
        .select({
            sportName: sport.name,
            count: sql`count(${booking.id})`,
        })
        .from(booking)
        .innerJoin(court, sql`${booking.courtId} = ${court.id}`)
        .innerJoin(sport, sql`${court.sportId} = ${sport.id}`)
        .groupBy(sport.name)
        .orderBy(sql`count(${booking.id})`, "desc")
        .limit(10); // top 10 sports

    return result.map((row: any) => ({
        sportName: row.sportName,
        count: Number(row.count),
    }));
}
