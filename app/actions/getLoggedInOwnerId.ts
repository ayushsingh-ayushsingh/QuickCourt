"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserByEmail } from "@/app/actions/getUserByEmail";

export async function getLoggedInOwnerId(): Promise<string | null> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.email) return null;

    const user = await getUserByEmail(session.user.email);

    if (!user) return null;

    return user.id;
}
