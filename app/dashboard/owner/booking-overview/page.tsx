import NavbarWrapper from "@/components/layouts/navbar-wrapper";
import Footer from "@/components/layouts/footer";
import OwnerNavbar from "../owner-navbar";
import OwnerDashboardPage from "../main-page";
import { getLoggedInOwnerId } from "@/app/actions/getLoggedInOwnerId";
import { BookingTrendsChart } from "../chart";

export default async function AdminDashboard() {
    const ownerId = await getLoggedInOwnerId();

    return (
        <div className="max-w-7xl mx-auto">
            <NavbarWrapper />
            <OwnerNavbar />
            <BookingTrendsChart />
            {ownerId ? (
                <OwnerDashboardPage ownerId={ownerId} />
            ) : (
                <p className="p-8 text-center text-red-600">Failed to identify owner</p>
            )}
            <Footer />
        </div>
    );
}