import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserByEmail } from "@/app/actions/getUserByEmail";
import Navbar from "@/components/layouts/navbar";

export default async function NavbarWrapper() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await getUserByEmail(session.user.email);

    if (user.isBanned) {
        redirect("/logout");
    }

    return <Navbar session={session} role={user.role} />;
}
