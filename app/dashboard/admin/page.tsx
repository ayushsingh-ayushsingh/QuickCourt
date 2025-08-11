import Navbar from "@/components/layouts/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserByEmail } from "@/app/actions/getUserByEmail";
import GlobalStats from "./global-stats"
import AdminNavbar from "./admin-navbar"
import Footer from "@/components/layouts/footer";
import {
    BookingActivityChart,
    FacilityApprovalTrendChart,
    UserRegistrationTrendsChart,
    MostActiveSportsChart,
    EarningsSimulationChart
} from "./charts"

export async function NavbarWrapper() {
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
            <div className="text-2xl mx-4">Trend Charts</div>
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
                <FacilityApprovalTrendChart />
                <UserRegistrationTrendsChart />
                <BookingActivityChart />
                <MostActiveSportsChart />
            </div>
            <EarningsSimulationChart />
            <Footer />
        </div>
    )
}