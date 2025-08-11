"use server";

import { db } from "@/db/drizzle";
import { user, venue, court, booking, owner_metrics } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

// Fetch Owner Dashboard Data
export async function getOwnerDashboardData(ownerId: string) {
    // Fetch Owner Name
    const owner = await db
        .select({ name: user.name })
        .from(user)
        .where(eq(user.id, ownerId))
        .limit(1)
        .then((rows) => rows[0]);

    if (!owner) {
        throw new Error("Owner not found");
    }

    // Total bookings for this owner's venues (only confirmed/booked)
    const totalBookingsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(booking)
        .where(
            and(
                eq(booking.status, "booked"),
                sql`${booking.venueId} IN (SELECT id FROM ${venue} WHERE owner_id = ${ownerId})`
            )
        )
        .limit(1)
        .then((rows) => rows[0]?.count || 0);

    // Count active courts for owner's venues
    const activeCourtsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(court)
        .where(
            and(
                eq(court.status, "active"),
                sql`${court.venueId} IN (SELECT id FROM ${venue} WHERE owner_id = ${ownerId})`
            )
        )
        .limit(1)
        .then((rows) => rows[0]?.count || 0);

    // Earnings from owner_metrics table
    const earningsResult = await db
        .select({ earningsCents: owner_metrics.earningsCents })
        .from(owner_metrics)
        .where(eq(owner_metrics.ownerId, ownerId))
        .limit(1)
        .then((rows) => rows[0]?.earningsCents || 0);

    // Booking calendar data: bookings grouped by date (startAt)
    const bookingsByDate = await db
        .select({
            date: sql<string>`DATE(${booking.startAt})`,
            count: sql<number>`count(*)`,
        })
        .from(booking)
        .where(
            and(
                eq(booking.status, "booked"),
                sql`${booking.venueId} IN (SELECT id FROM ${venue} WHERE owner_id = ${ownerId})`
            )
        )
        .groupBy(sql`DATE(${booking.startAt})`)
        .orderBy(sql`DATE(${booking.startAt})`);

    return {
        ownerName: owner.name,
        totalBookings: Number(totalBookingsResult),
        activeCourts: Number(activeCourtsResult),
        earnings: Number(earningsResult) / 100,
        bookingsByDate,
    };
}