import { getVenues } from "@/app/actions/getVenues";
import NavbarWrapper from "@/components/layouts/navbar-wrapper";
import Footer from "@/components/layouts/footer";
import VenuesTable from "./table";
import UserManagement from "./user-management"

export default async function VenuesPage() {
    const venues = await getVenues();

    return (
        <div>
            <section className="max-w-7xl mx-auto px-4">
                <NavbarWrapper />
                <h1 className="text-2xl font-bold my-6 px-4">All Venues</h1>
                <VenuesTable venues={venues} />
                <UserManagement />
                <Footer />
            </section>
        </div>
    );
}
