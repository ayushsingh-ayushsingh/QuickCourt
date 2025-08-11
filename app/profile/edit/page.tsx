import { Button } from "@/components/ui/button"
import Navbar from "@/components/layouts/navbar"
import Image from "next/image"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { User2 } from "lucide-react"
import Link from "next/link"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import EditProfilePage from "@/app/profile/edit/editProfile"
import { getUserByEmail } from "@/app/actions/getUserByEmail"

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
                            <Link href="/profile/all-bookings">
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
                <Navbar />
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
                        <Card className="w-full h-fit">
                            <CardContent className="p-6 flex flex-col gap-6">
                                <EditProfilePageWrapper searchParams={{ email: session?.user?.email }} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function EditProfilePageWrapper({ searchParams }: { searchParams: { email?: string } }) {
    if (!searchParams.email) {
        throw new Error("Email is required")
    }

    const userData = await getUserByEmail(searchParams.email)

    if (!userData) {
        throw new Error("User not found")
    }

    return (
        <EditProfilePage
            userEmail={userData.email}
            currentRole={userData.role}
            currentName={userData.name}
            currentImage={userData.image || ""}
        />
    )
}

