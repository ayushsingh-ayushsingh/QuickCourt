"use server";

import { db } from "@/db/drizzle"; // your drizzle db instance
import { schema } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getVenues() {
    try {
        const venues = await db
            .select({
                id: schema.venue.id,
                name: schema.venue.name,
                description: schema.venue.description,
                startingPricePerHour: schema.venue.startingPricePerHour,
                ratingAvg: schema.venue.ratingAvg,
                ratingCount: schema.venue.ratingCount,
                isApproved: schema.venue.isApproved,
                createdAt: schema.venue.createdAt,
            })
            .from(schema.venue)
            .where(eq(schema.venue.isApproved, true)) // only approved venues
            .orderBy(desc(schema.venue.createdAt)) // newest first
            .limit(5);

        return venues;
    } catch (error) {
        console.error("Error fetching venues:", error);
        return [];
    }
}
