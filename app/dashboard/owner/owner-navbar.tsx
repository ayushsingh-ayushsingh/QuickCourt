import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminNavbar() {
    return (
        <div className="p-4 border-b">
            <span className="text-lg mb-4 block">Visit Admin Dashboard Pages:</span>
            <ul
                className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-3
          text-primary
        "
            >
                {[
                    { href: "/dashboard/owner", label: "Summary" },
                    { href: "/dashboard/owner/trend-charts", label: "Trend Charts" },
                    { href: "/dashboard/owner/facility-management", label: "Facility management" },
                    { href: "/dashboard/owner/booking-overview", label: "Overview" },
                ].map(({ href, label }) => (
                    <li key={href} className="flex">
                        <Button className="w-full whitespace-normal break-words text-center px-3 py-2 text-sm sm:text-base">
                            <Link href={href} className="w-full">
                                {label}
                            </Link>
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
