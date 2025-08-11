"use server"

import { db } from "@/db/drizzle"
import { user } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function updateProfileAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const image = formData.get("image") as string;
    const requestedRole = formData.get("role") as string;

    const [currentUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1);

    if (!currentUser) {
        throw new Error("User not found");
    }

    let finalRole = currentUser.role;
    let pendingRole: string | null = currentUser.pendingRole;
    let approvalMessage: string | undefined;

    if (currentUser.role !== "admin") {
        if (requestedRole !== currentUser.role) {
            pendingRole = requestedRole; // store the request
            approvalMessage = "Waiting for admin approval";
        }
        finalRole = currentUser.role; // keep current until approved
    } else {
        // Admin can change immediately
        finalRole = requestedRole;
        pendingRole = null; // clear any pending request
    }

    await db
        .update(user)
        .set({
            name,
            image,
            role: finalRole,
            pendingRole,
            updatedAt: new Date(),
        })
        .where(eq(user.id, session.user.id));

    return { success: true, message: approvalMessage };
}
