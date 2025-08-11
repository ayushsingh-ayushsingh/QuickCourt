"use server";

import { db } from "@/db/drizzle";
import { user, venue, booking, court } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function getGlobalStats() {
    const [totalUsers] = await db
        .select({ count: sql`count(*)` })
        .from(user);

    const [totalFacilities] = await db
        .select({ count: sql`count(*)` })
        .from(venue);

    const [totalBookings] = await db
        .select({ count: sql`count(*)` })
        .from(booking);

    const [activeCourts] = await db
        .select({ count: sql`count(*)` })
        .from(court)
        .where(sql`${court.status} = 'active'`);

    return {
        totalUsers: Number(totalUsers.count),
        totalFacilities: Number(totalFacilities.count),
        totalBookings: Number(totalBookings.count),
        activeCourts: Number(activeCourts.count),
    };
}
