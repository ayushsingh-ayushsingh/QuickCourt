"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        async function logout() {
            await authClient.signOut();
            toast.success("Logged Out - Banned user");
            router.push("/login");
        }
        logout();
    }, [router]);

    return <div>Logging out...</div>;
}
