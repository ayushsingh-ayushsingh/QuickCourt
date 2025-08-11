import Navbar from "@/components/layouts/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function NavbarWrapper() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return <Navbar session={session} />;
}
