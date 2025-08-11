// app/profile/page.tsx

import NavbarWrapper from "@/components/layouts/navbar-wrapper"
import Image from "next/image"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { User2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// MODIFIED: Import the new function
import { getEveryBooking } from "@/app/actions/booking-actions"
import { BookingList } from "./booking-list"

// ProfileSidebar remains the same...
function ProfileSidebar({ imageUrl, email, userType = "Player", name }: {
    imageUrl: string; email: string; userType?: string; name: string;
}) {
    return (
        <Card className="w-full h-fit sticky top-24">
            <CardContent className="p-6 flex flex-col items-center gap-6">
                <div className="relative w-48 h-48 rounded-full overflow-hidden shrink-0">
                    {imageUrl ? (
                        <Image src={imageUrl} alt="Avatar" fill sizes="12rem" className="object-cover" />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-primary"><User2 className="text-white w-12 h-12" /></div>
                    )}
                </div>
                <div className="text-center w-full">
                    <div className="text-2xl font-semibold">{name}</div>
                    <div className="text-muted-foreground">{email}</div>
                    <div className="text-sm mt-1">{userType}</div>
                    <ul className="grid gap-3 mt-6">
                        <li><Link href="/profile/edit"><Button className="w-full" variant="outline">Edit Profile</Button></Link></li>
                        <li><Link href="/profile"><Button className="w-full" variant="outline">All Bookings</Button></Link></li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}

export default async function ProfilePage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
        return (
            <div className="w-full min-h-screen bg-background flex items-center justify-center">
                <Card className="max-w-md mx-auto">
                    <CardContent className="p-6 text-center">
                        <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
                        <p className="text-muted-foreground mb-4">Please log in to view the booking list.</p>
                        <Link href="/auth/login"><Button>Sign In</Button></Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const userId = session.user.id;

    // MODIFIED: Fetch ALL bookings instead of just the user's bookings.
    const [activeAndCompletedBookings, cancelledBookings] = await Promise.all([
        getEveryBooking("booked"),
        getEveryBooking("cancelled")
    ]);

    return (
        <div className="w-full min-h-screen bg-background">
            <div className="max-w-7xl mx-auto"><NavbarWrapper /></div>
            <div className="border-b w-full" />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3">
                        <ProfileSidebar
                            imageUrl={session.user.image as string}
                            email={session.user.email as string}
                            name={session.user.name as string}
                        />
                    </div>
                    <div className="lg:w-2/3">
                        <BookingList
                            // Pass the current logged-in user's ID for the cancel action
                            userId={userId}
                            activeBookings={activeAndCompletedBookings}
                            cancelledBookings={cancelledBookings}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}