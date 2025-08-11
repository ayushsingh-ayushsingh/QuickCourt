"use client";

import React, { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

// --------- Dummy Data Generators -----------

type BookingTrendPoint = {
    date: string; // e.g. "2025-08-12"
    count: number;
};

function generateBookingTrends(days = 30): BookingTrendPoint[] {
    const data: BookingTrendPoint[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        // Random bookings count between 10 and 50
        data.push({
            date: d.toISOString().split("T")[0],
            count: Math.floor(10 + Math.random() * 40),
        });
    }

    return data;
}

type EarningsPoint = {
    category: string;
    earnings: number;
};

function generateEarningsSummary(): EarningsPoint[] {
    return [
        { category: "Court A", earnings: 1200 },
        { category: "Court B", earnings: 900 },
        { category: "Court C", earnings: 700 },
        { category: "Court D", earnings: 1500 },
        { category: "Court E", earnings: 400 },
    ];
}

type HourlyBooking = {
    hour: string; // "0", "1", ..., "23"
    count: number;
};

function generatePeakBookingHours(): HourlyBooking[] {
    // Simulate peak booking around evening hours
    const data: HourlyBooking[] = [];
    for (let h = 0; h < 24; h++) {
        let base = 5;
        if (h >= 17 && h <= 21) base = 30; // peak hours 5PM-9PM
        const count = base + Math.floor(Math.random() * 10);
        data.push({ hour: h.toString(), count });
    }
    return data;
}

// ---------- Charts Components ----------

export function BookingTrendsChart() {
    const [data, setData] = useState<BookingTrendPoint[]>([]);

    useEffect(() => {
        const dummyData = generateBookingTrends(30);
        setData(dummyData);
    }, []);

    const formattedData = data.map((d) => ({
        ...d,
        label: new Date(d.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        }),
    }));

    return (
        <Card className="m-4">
            <CardHeader>
                <CardTitle>Booking Trends (Last 30 Days)</CardTitle>
                <CardDescription>Daily booking counts</CardDescription>
            </CardHeader>
            <CardContent className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={formattedData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={4}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip
                            content={({ active, payload }) =>
                                active && payload && payload.length ? (
                                    <div className="rounded bg-white p-2 shadow-lg border border-gray-200">
                                        <div>
                                            <strong>{payload[0].payload.label}</strong>
                                        </div>
                                        <div>Bookings: {payload[0].payload.count}</div>
                                    </div>
                                ) : null
                            }
                        />
                        <Area
                            dataKey="count"
                            type="monotone"
                            fill="var(--chart-1)"
                            fillOpacity={0.4}
                            stroke="var(--chart-1)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function EarningsSummaryChart() {
    const [data, setData] = useState<EarningsPoint[]>([]);

    useEffect(() => {
        const dummyData = generateEarningsSummary();
        setData(dummyData);
    }, []);

    return (
        <Card className="m-4">
            <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
                <CardDescription>Earnings by Court / Category</CardDescription>
            </CardHeader>
            <CardContent className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="category"
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={80}
                        />
                        <YAxis
                            allowDecimals={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            formatter={(value: number) => `$${value.toFixed(2)}`}
                            cursor={{ fill: "rgba(0,0,0,0.1)" }}
                        />
                        <Bar
                            dataKey="earnings"
                            fill="var(--chart-2)"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function PeakBookingHoursChart() {
    const [data, setData] = useState<HourlyBooking[]>([]);

    useEffect(() => {
        const dummyData = generatePeakBookingHours();
        setData(dummyData);
    }, []);

    // Format hour label like "12 AM", "1 PM" etc
    const formattedData = data.map((d) => {
        const hourNum = Number(d.hour);
        const ampm = hourNum >= 12 ? "PM" : "AM";
        const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;
        return { ...d, label: `${hour12} ${ampm}` };
    });

    return (
        <Card className="m-4">
            <CardHeader>
                <CardTitle>Peak Booking Hours</CardTitle>
                <CardDescription>Bookings by hour of day</CardDescription>
            </CardHeader>
            <CardContent className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={formattedData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={2}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip
                            content={({ active, payload }) =>
                                active && payload && payload.length ? (
                                    <div className="rounded bg-white p-2 shadow-lg border border-gray-200">
                                        <div>
                                            <strong>{payload[0].payload.label}</strong>
                                        </div>
                                        <div>Bookings: {payload[0].payload.count}</div>
                                    </div>
                                ) : null
                            }
                        />
                        <Area
                            dataKey="count"
                            type="monotone"
                            fill="var(--chart-3)"
                            fillOpacity={0.4}
                            stroke="var(--chart-3)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default function OwnerDashboardCharts() {
    return (
        <>
            <BookingTrendsChart />
            <EarningsSummaryChart />
            <PeakBookingHoursChart />
        </>
    );
}
