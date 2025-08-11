import NavbarWrapper from "@/components/layouts/navbar-wrapper"
import Image from "next/image"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { User2, Clock4, Calendar1, CircleCheckBig, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export function ProfileMain() {
    return (
        <Card className="w-full">
            <Tabs defaultValue="all-bookings" className="w-full">
                <TabsList className="bg-accent m-4 w-fit">
                    <TabsTrigger value="all-bookings">All Bookings</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                <TabsContent value="all-bookings">
                    <CardHeader className="sr-only">
                        <CardTitle>All Bookings</CardTitle>
                        <CardDescription>
                            All your Bookings are listed here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 w-full">
                        <div className="grid gap-3 w-full border-t pt-4">
                            <div className="font-semibold text-2xl">Skyline Badminton Court</div>
                            <div className="w-full flex gap-6">
                                <div className="flex gap-2 items-center">
                                    <Calendar1 className="size-4" />
                                    18 June 2022
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Clock4 className="size-4" />
                                    5:00 PM to 6:00 PM
                                </div>
                            </div>
                            <div>Location: 46/201, Rajkot, Gujarat</div>
                            <div className="flex gap-2 items-center">
                                Status: Confirmed
                                <CircleCheckBig className="size-4 text-primary" />
                            </div>
                            <div className="flex w-full gap-4">
                                <Button>Cancel Booking</Button>
                                <Button>Write Review</Button>
                            </div>
                        </div>
                        <div className="grid gap-3 w-full border-t pt-4">
                            <div className="font-semibold text-2xl">Skyline Badminton Court</div>
                            <div className="w-full flex gap-6">
                                <div className="flex gap-2 items-center">
                                    <Calendar1 className="size-4" />
                                    18 June 2022
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Clock4 className="size-4" />
                                    5:00 PM to 6:00 PM
                                </div>
                            </div>
                            <div>Location: 46/201, Rajkot, Gujarat</div>
                            <div className="flex gap-2 items-center">
                                Status: Confirmed
                                <CircleCheckBig className="size-4 text-primary" />
                            </div>
                            <div className="flex w-full gap-4">
                                <Button>Cancel Booking</Button>
                                <Button>Write Review</Button>
                            </div>
                        </div>
                    </CardContent>
                </TabsContent>
                <TabsContent value="cancelled">
                    <CardHeader className="sr-only">
                        <CardTitle>All Bookings</CardTitle>
                        <CardDescription>
                            All your Bookings are listed here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 w-full">
                        <div className="grid gap-3 w-full border-t pt-4">
                            <div className="font-semibold text-2xl">Skyline Badminton Court</div>
                            <div className="w-full flex gap-6">
                                <div className="flex gap-2 items-center">
                                    <Calendar1 className="size-4" />
                                    18 June 2022
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Clock4 className="size-4" />
                                    5:00 PM to 6:00 PM
                                </div>
                            </div>
                            <div>Location: 46/201, Rajkot, Gujarat</div>
                            <div className="flex gap-2 items-center">
                                Status: Cancelled
                                <X className="size-4 text-destructive" />
                            </div>
                            <div className="flex w-full gap-4">
                                <Button>Write Review</Button>
                            </div>
                        </div>
                        <div className="grid gap-3 w-full border-t pt-4">
                            <div className="font-semibold text-2xl">Skyline Badminton Court</div>
                            <div className="w-full flex gap-6">
                                <div className="flex gap-2 items-center">
                                    <Calendar1 className="size-4" />
                                    18 June 2022
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Clock4 className="size-4" />
                                    5:00 PM to 6:00 PM
                                </div>
                            </div>
                            <div>Location: 46/201, Rajkot, Gujarat</div>
                            <div className="flex gap-2 items-center">
                                Status: Cancelled
                                <X className="size-4 text-destructive" />
                            </div>
                            <div className="flex w-full gap-4">
                                <Button>Write Review</Button>
                            </div>
                        </div>
                    </CardContent>
                </TabsContent>
            </Tabs>
        </Card>
    )
}

function ProfileSidebar({
    imageUrl,
    email,
    userType = "Player",
    name,
}: {
    imageUrl: string
    email: string
    userType?: string
    name: string
}) {
    return (
        <Card className="w-full h-fit">
            <CardContent className="p-6 flex flex-col items-center gap-6">
                {/* Avatar */}
                <div className="relative w-48 h-48 rounded-full overflow-hidden shrink-0">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt="Avatar"
                            fill
                            className="object-cover cursor-pointer "
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-primary">
                            <User2 className="text-white w-12 h-12" />
                        </div>
                    )}
                </div>

                <div className="text-center w-full">
                    <div className="text-2xl font-semibold">{name}</div>
                    <div className="text-muted-foreground">{email}</div>
                    <div className="text-sm mt-1">{userType}</div>

                    <ul className="grid gap-3 mt-6">
                        <li>
                            <Link href="/profile/edit">
                                <Button className="w-full" variant="outline">
                                    Edit Profile
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/profile">
                                <Button className="w-full" variant="outline">
                                    All Bookings
                                </Button>
                            </Link>
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    return (
        <div className="w-full min-h-screen bg-background">
            <div className="max-w-7xl mx-auto">
                <NavbarWrapper />
            </div>
            <div className="border-b w-full" />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3">
                        <ProfileSidebar
                            imageUrl={session?.user?.image as string}
                            email={session?.user?.email as string}
                            name={session?.user?.name as string}
                        />
                    </div>
                    <div className="lg:w-2/3">
                        <ProfileMain />
                    </div>
                </div>
            </div>
        </div>
    )
}
