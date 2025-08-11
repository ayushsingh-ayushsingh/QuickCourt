// app/profile/booking-list.tsx

"use client";

import { Clock4, Calendar1, CircleCheckBig, X, MapPin, IndianRupee, User2 } from "lucide-react"; // Added User2
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
// Ensure paths are correct based on your project structure
import { cancelBooking } from "@/app/actions/booking-actions";
import type { BookingWithDetails } from "@/app/actions/booking-actions";

type Booking = BookingWithDetails;

// CancelBookingButton component remains the same
function CancelBookingButton({ bookingId, userId, isDisabled }: {
    bookingId: string; userId: string; isDisabled: boolean;
}) {
    async function handleCancel() {
        const result = await cancelBooking(bookingId, userId);
        if (result.success) {
            toast.success(result.message || "Booking cancelled successfully.");
        } else {
            toast.error(result.error || "Failed to cancel booking.");
        }
    }
    return <Button variant="destructive" onClick={handleCancel} disabled={isDisabled}>Cancel Booking</Button>;
}

// MODIFIED: BookingCard now displays the user's name.
function BookingCard({ booking, userId, showCancelButton = true }: {
    booking: Booking; userId: string; showCancelButton?: boolean;
}) {
    const formatDate = (date: Date | string) => new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const formatTime = (startDate: Date | string, endDate: Date | string) => {
        const start = new Date(startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        const end = new Date(endDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${start} to ${end}`;
    };

    const isPastBooking = new Date(booking.endAt) < new Date();
    let effectiveStatus = booking.status;
    if (isPastBooking && booking.status === 'booked') {
        effectiveStatus = 'completed';
    }

    const getStatusBadge = (status: string) => { /* ... (same as before) ... */
        switch (status) {
            case 'booked': return <Badge variant="default" className="bg-green-100 text-green-700 border-green-300"><CircleCheckBig className="size-3 mr-1" />Confirmed</Badge>;
            case 'cancelled': return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300"><X className="size-3 mr-1" />Cancelled</Badge>;
            case 'completed': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300"><CircleCheckBig className="size-3 mr-1" />Completed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };
    const canCancel = booking.status === 'booked' && !isPastBooking;

    return (
        <div className="grid gap-4 w-full border-t pt-6 first:border-t-0 first:pt-4">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h3 className="font-semibold text-xl">{booking.venueName || 'Unknown Venue'}</h3>
                    {booking.courtName && <p className="text-sm text-muted-foreground">Court: {booking.courtName}</p>}
                </div>
                {getStatusBadge(effectiveStatus)}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex gap-2 items-center text-sm"><Calendar1 className="size-4 text-muted-foreground" /><span>{formatDate(booking.startAt)}</span></div>
                <div className="flex gap-2 items-center text-sm"><Clock4 className="size-4 text-muted-foreground" /><span>{formatTime(booking.startAt, booking.endAt)}</span></div>
            </div>

            {/* MODIFIED: Added a row to display the booker's name */}
            {booking.userName && (
                <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <User2 className="size-4" />
                    <span>Booked by: <span className="font-medium text-foreground">{booking.userName}</span></span>
                </div>
            )}

            {(booking.city || booking.state) && (
                <div className="flex gap-2 items-center text-sm"><MapPin className="size-4 text-muted-foreground" /><span>{[booking.city, booking.state, booking.pincode].filter(Boolean).join(', ')}</span></div>
            )}
            {booking.amount && (
                <div className="flex gap-2 items-center text-sm font-semibold"><IndianRupee className="size-4 text-muted-foreground" /><span>₹{Number(booking.amount).toLocaleString()}</span></div>
            )}
            <div className="flex flex-wrap items-center gap-3">
                {showCancelButton && canCancel && (
                    <CancelBookingButton bookingId={booking.id} userId={userId} isDisabled={!canCancel} />
                )}
                {effectiveStatus === 'completed' && <Button variant="outline">Write Review</Button>}
            </div>
        </div>
    );
}

// BookingList component remains the same
export function BookingList({ userId, activeBookings, cancelledBookings }: {
    userId: string; activeBookings: Booking[]; cancelledBookings: Booking[];
}) {
    return (
        <Card className="w-full">
            <Tabs defaultValue="all-bookings" className="w-full">
                <TabsList className="bg-accent m-4 w-fit">
                    <TabsTrigger value="all-bookings">Bookings ({activeBookings.length})</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="all-bookings">
                    <CardHeader><CardTitle>All Venue Bookings</CardTitle><CardDescription>Showing all active and completed bookings from all users.</CardDescription></CardHeader>
                    <CardContent>{activeBookings.length > 0 ? (<div className="space-y-6">{activeBookings.map((booking) => (<BookingCard key={booking.id} booking={booking} userId={userId} showCancelButton={true} />))}</div>) : (<div className="text-center py-12"><div className="text-muted-foreground mb-4"><Calendar1 className="size-12 mx-auto mb-2 opacity-50" />No active bookings found</div></div>)}</CardContent>
                </TabsContent>
                <TabsContent value="cancelled">
                    <CardHeader><CardTitle>All Cancelled Bookings</CardTitle><CardDescription>Showing all cancelled bookings from all users.</CardDescription></CardHeader>
                    <CardContent>{cancelledBookings.length > 0 ? (<div className="space-y-6">{cancelledBookings.map((booking) => (<BookingCard key={booking.id} booking={booking} userId={userId} showCancelButton={false} />))}</div>) : (<div className="text-center py-12"><div className="text-muted-foreground mb-4"><X className="size-12 mx-auto mb-2 opacity-50" />No cancelled bookings found</div></div>)}</CardContent>
                </TabsContent>
            </Tabs>
        </Card>
    );
}