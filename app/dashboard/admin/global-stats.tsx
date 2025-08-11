"use client";

import { useState, useEffect } from "react";
import { getGlobalStats } from "@/app/actions/getGlobalStats";

export default function GlobalStats() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalFacilities: 0,
        totalBookings: 0,
        activeCourts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const data = await getGlobalStats();
                setStats(data);
            } catch {
                // Handle error if needed
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="space-y-4 m-4 my-8">
            <div className="text-2xl">Global Statistics</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-accent rounded p-4 text-center shadow">
                    <p className="text-xl font-bold">{loading ? "..." : stats.totalUsers}</p>
                    <p className="text-gray-600">Total Users</p>
                </div>
                <div className="bg-accent rounded p-4 text-center shadow">
                    <p className="text-xl font-bold">{loading ? "..." : stats.totalFacilities}</p>
                    <p className="text-gray-600">Total Facilities</p>
                </div>
                <div className="bg-accent rounded p-4 text-center shadow">
                    <p className="text-xl font-bold">{loading ? "..." : stats.totalBookings}</p>
                    <p className="text-gray-600">Total Bookings</p>
                </div>
                <div className="bg-accent rounded p-4 text-center shadow">
                    <p className="text-xl font-bold">{loading ? "..." : stats.activeCourts}</p>
                    <p className="text-gray-600">Active Courts</p>
                </div>
            </div>
        </div>
    );
}
