"use server";

import { db } from "@/db/drizzle";
import { venue, venue_photo } from "@/db/schema";
import { desc } from "drizzle-orm";
import { or, eq } from "drizzle-orm";

type FacilityWithPhotos = {
    id: string;
    ownerId: string;
    name: string;
    description: string | null;
    isApproved: boolean;
    createdAt: Date;
    photos: string[];
};

export async function getSubmittedFacilities(): Promise<FacilityWithPhotos[]> {
    const venues = await db
        .select({
            id: venue.id,
            ownerId: venue.ownerId,
            name: venue.name,
            description: venue.description,
            isApproved: venue.isApproved,
            createdAt: venue.createdAt,
        })
        .from(venue)
        .orderBy(desc(venue.createdAt));

    // For each venue, get its photos
    const venueIds = venues.map((v) => v.id);

    const conditions = venueIds.map(id => eq(venue_photo.venueId, id));
    const photos = await db
        .select({
            venueId: venue_photo.venueId,
            url: venue_photo.url,
        })
        .from(venue_photo)
        .where(or(...conditions));

    const photosByVenue: Record<string, string[]> = {};
    photos.forEach(({ venueId, url }) => {
        if (!photosByVenue[venueId]) {
            photosByVenue[venueId] = [];
        }
        photosByVenue[venueId].push(url);
    });

    const facilities: FacilityWithPhotos[] = venues.map((v) => ({
        ...v,
        photos: photosByVenue[v.id] || [],
    }));

    return facilities;
}
