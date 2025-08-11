
import Navbar from "@/components/layouts/navbar";
import UserManagement from "./user-management"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserByEmail } from "@/app/actions/getUserByEmail";
import GlobalStats from "../global-stats";
import AdminNavbar from "../admin-navbar";
import Footer from "@/components/layouts/footer";
import { authClient } from '@/lib/auth-client';
import { redirect } from "next/navigation";

export async function NavbarWrapper() {
    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            return {
                success: true,
                message: "Logged out successfully!"
            }
        } catch (error) {
            let errorMessage: string;

            if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "An unknown error occurred while logging out.";
            }

            return {
                success: false,
                message: errorMessage
            };
        }
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    let role = "user";

    if (session?.user?.email) {
        const user = await getUserByEmail(session.user.email);
        role = user?.role || "user";
    }

    return <Navbar session={session} role={role} roleEnabled={false} />;
}

export default function AdminDashboard() {
    return (
        <div className="max-w-7xl mx-auto">
            <NavbarWrapper />
            <AdminNavbar />
            <GlobalStats />
            <UserManagement />
            <Footer />
        </div>
    )
}