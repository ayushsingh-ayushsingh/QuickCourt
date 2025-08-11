import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminNavbar() {
    return (
        <div className="p-4 flex items-center gap-4 border-b">
            <span className="text-lg">
                Visit Admin Dashboard Pages:
            </span>
            <ul className="flex items-center text-primary gap-4 h-12">
                <li>
                    <Button>
                        <Link href={"/dashboard/admin/user-management"}>
                            User Management
                        </Link>
                    </Button>
                </li>
                <li>
                    <Button>
                        <Link href={"/dashboard/admin"}>
                            Trend Charts
                        </Link>
                    </Button>
                </li>
                <li>
                    <Button>
                        <Link href={"/dashboard/admin/facility-approval"}>
                            Facility Approval
                        </Link>
                    </Button>
                </li>
                <li>
                    <Button>
                        <Link href={"/dashboard/admin/facility-details"}>
                            Facility Details
                        </Link>
                    </Button>
                </li>
            </ul>
        </div>
    )
}