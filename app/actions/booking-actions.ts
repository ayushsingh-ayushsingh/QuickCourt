"use server";

import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { eq, and, desc, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * The shape of a booking object, now including the user's name.
 */
export type BookingWithDetails = {
    id: string;
    userId: string;
    venueId: string;
    courtId: string;
    startAt: Date;
    endAt: Date;
    amount: string | null;
    status: string;
    venueName: string | null;
    courtName: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    // Added user's name and email to display on the card
    userName: string | null;
    userEmail: string | null;
};

// This function is no longer used in the profile page but kept for other potential uses.
export async function getUserBookings(
    userId: string,
    status?: "booked" | "cancelled" | "completed"
): Promise<BookingWithDetails[]> {
    // ... (implementation remains the same as before)
    // For this request, we are not using this function on the profile page.
    // The implementation can stay as it was.
    try {
        const conditions = [eq(schema.booking.userId, userId)];
        if (status) {
            conditions.push(eq(schema.booking.status, status));
        }
        const bookings = await db
            .select({
                id: schema.booking.id, userId: schema.booking.userId, venueId: schema.booking.venueId, courtId: schema.booking.courtId, startAt: schema.booking.startAt, endAt: schema.booking.endAt, amount: schema.booking.amount, status: schema.booking.status, venueName: schema.venue.name, venueDescription: schema.venue.description, courtName: schema.court.name, city: schema.address.city, state: schema.address.state, pincode: schema.address.pincode,
                // We need user details here too if this function were to be used
                userName: schema.user.name, userEmail: schema.user.email,
            })
            .from(schema.booking)
            .leftJoin(schema.venue, eq(schema.booking.venueId, schema.venue.id))
            .leftJoin(schema.court, eq(schema.booking.courtId, schema.court.id))
            .leftJoin(schema.address, eq(schema.venue.id, schema.address.venueId))
            .leftJoin(schema.user, eq(schema.booking.userId, schema.user.id)) // Join user table
            .where(and(...conditions))
            .orderBy(desc(schema.booking.startAt));
        return bookings;
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return [];
    }
}


/**
 * MODIFIED: Fetches ALL bookings from the database, with optional status filter.
 * This is for the "admin-style" view on the profile page.
 *
 * @param status - Optional filter for the booking status.
 * @returns A promise that resolves to an array of all bookings with details.
 */
export async function getEveryBooking(
    status?: "booked" | "cancelled"
): Promise<BookingWithDetails[]> {
    try {
        const conditions = [];
        if (status) {
            conditions.push(eq(schema.booking.status, status));
        }

        const bookings = await db
            .select({
                id: schema.booking.id, userId: schema.booking.userId, venueId: schema.booking.venueId, courtId: schema.booking.courtId, startAt: schema.booking.startAt, endAt: schema.booking.endAt, amount: schema.booking.amount, status: schema.booking.status, venueName: schema.venue.name, venueDescription: schema.venue.description, courtName: schema.court.name, city: schema.address.city, state: schema.address.state, pincode: schema.address.pincode,
                // Join with user table to get the name and email
                userName: schema.user.name,
                userEmail: schema.user.email,
            })
            .from(schema.booking)
            .leftJoin(schema.venue, eq(schema.booking.venueId, schema.venue.id))
            .leftJoin(schema.court, eq(schema.booking.courtId, schema.court.id))
            .leftJoin(schema.address, eq(schema.venue.id, schema.address.venueId))
            .leftJoin(schema.user, eq(schema.booking.userId, schema.user.id)) // <-- JOIN with user table
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(schema.booking.startAt));

        return bookings;
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        return [];
    }
}

/**
 * MODIFIED: Cancels a booking.
 * The check for booking ownership (`userId`) has been REMOVED.
 * Any logged-in user can cancel any booking.
 *
 * @param bookingId - The ID of the booking to cancel.
 * @param userId - The ID of the user initiating the cancellation (logged for potential audit but not for permission).
 * @returns An object indicating success or failure.
 */
export async function cancelBooking(bookingId: string, userId: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
}> {
    try {
        // Find the booking to ensure it exists and isn't already cancelled.
        // The check for `userId` is removed here.
        const [bookingToCancel] = await db
            .select({ status: schema.booking.status, endAt: schema.booking.endAt })
            .from(schema.booking)
            .where(eq(schema.booking.id, bookingId)) // <-- REMOVED: eq(schema.booking.userId, userId)
            .limit(1);

        if (!bookingToCancel) {
            return { success: false, error: "Booking not found." };
        }
        if (bookingToCancel.status === "cancelled") {
            return { success: false, error: "This booking is already cancelled." };
        }
        if (new Date(bookingToCancel.endAt) < new Date()) {
            return { success: false, error: "Cannot cancel a booking that has already passed." };
        }

        await db
            .update(schema.booking)
            .set({ status: "cancelled" })
            .where(eq(schema.booking.id, bookingId));

        revalidatePath("/profile");

        return { success: true, message: "Booking cancelled successfully." };
    } catch (error) {
        console.error("Error cancelling booking:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}