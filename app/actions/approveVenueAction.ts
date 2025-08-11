"use server"

import { db } from "@/db/drizzle";
import { venue } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function approveVenueAction(venueId: string) {
    await db
        .update(venue)
        .set({ isApproved: true })
        .where(eq(venue.id, venueId));
}
