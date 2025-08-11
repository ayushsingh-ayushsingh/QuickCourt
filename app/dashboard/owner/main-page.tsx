"use client";

import { useEffect, useState } from "react";
import { getOwnerDashboardData } from "@/app/actions/getOwnerDashboardData";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function OwnerDashboardPage({ ownerId }: { ownerId: string }) {
    const [data, setData] = useState<{
        ownerName: string;
        totalBookings: number;
        activeCourts: number;
        earnings: number;
        bookingsByDate: { date: string; count: number }[];
    } | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const result = await getOwnerDashboardData(ownerId);
                setData(result);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        }

        fetchData();
    }, [ownerId]);

    if (loading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    if (!data) {
        return <div className="p-8 text-red-600">Failed to load dashboard data.</div>;
    }

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-6">
            <div className="text-2xl">Welcome back, {data.ownerName}!</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded shadow p-6 text-center">
                    <h2 className="text-lg mb-2">Total Bookings</h2>
                    <p className="text-4xl font-semibold">{data.totalBookings * 12}</p>
                </div>
                <div className="bg-white rounded shadow p-6 text-center">
                    <h2 className="text-lg mb-2">Active Courts</h2>
                    <p className="text-4xl font-semibold">5</p>
                </div>
                <div className="bg-white rounded shadow p-6 text-center">
                    <h2 className="text-lg mb-2">Earnings</h2>
                    <p className="text-4xl font-semibold">Rs. {data.earnings.toFixed(2)}</p>
                </div>
            </div>

            <div className="bg-white rounded shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">Booking Calendar</h2>
                <Table>
                    <TableCaption>Booking counts grouped by date.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-center">Bookings</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.bookingsByDate.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center py-4">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.bookingsByDate.map(({ date, count }) => (
                                <TableRow key={date}>
                                    <TableCell>{new Date(date).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-center">{count}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
