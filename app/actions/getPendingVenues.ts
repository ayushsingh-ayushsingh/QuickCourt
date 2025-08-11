"use server"

import { db } from "@/db/drizzle";
import { venue } from "@/db/schema";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm";

export async function getPendingVenues() {
    return await db
        .select()
        .from(venue)
        .where(eq(venue.isApproved, false))
        .orderBy(desc(venue.createdAt))
}
