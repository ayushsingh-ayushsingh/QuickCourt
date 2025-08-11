import NavbarWrapper from "@/components/layouts/navbar-wrapper";
import Footer from "@/components/layouts/footer";
import OwnerNavbar from "../owner-navbar";
import OwnerDashboardCharts from "../chart"

export default async function AdminDashboard() {
    return (
        <div className="max-w-7xl mx-auto">
            <NavbarWrapper />
            <OwnerNavbar />
            <OwnerDashboardCharts />
            <Footer />
        </div>
    );
}