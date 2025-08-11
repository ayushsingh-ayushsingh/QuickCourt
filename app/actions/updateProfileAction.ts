"use server"

import { db } from "@/db/drizzle"
import { user } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers";

export async function updateProfileAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const name = formData.get("name") as string
    const image = formData.get("image") as string
    const role = formData.get("role") as string

    await db.update(user)
        .set({
            name,
            image,
            role,
            updatedAt: new Date()
        })
        .where(eq(user.id, session.user.id))

    return { success: true }
}
