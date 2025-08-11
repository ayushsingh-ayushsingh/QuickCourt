"use client";

import React, { useEffect, useState } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { BarChart, Bar, Tooltip, ResponsiveContainer } from "recharts";

import { getBookingActivity } from "@/app/actions/getBookingActivity";
import { getUserRegistrationTrends } from "@/app/actions/getUserRegistrationTrends";
import { getFacilityApprovalTrends } from "@/app/actions/getFacilityApprovalTrends";
import { getMostActiveSports } from "@/app/actions/getMostActiveSports";

type EarningsDataPoint = {
    date: string;
    earnings: number;
};

function generateSimulatedEarnings(days = 30): EarningsDataPoint[] {
    const data: EarningsDataPoint[] = [];
    const today = new Date();
    let baseEarnings = 1000; // starting earnings amount

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        // Simple simulation: random daily earnings growth or drop +/- 5%
        const changePercent = (Math.random() - 0.5) * 0.1; // -5% to +5%
        baseEarnings = baseEarnings * (1 + changePercent);

        data.push({
            date: date.toISOString().split("T")[0], // yyyy-mm-dd
            earnings: parseFloat(baseEarnings.toFixed(2)),
        });
    }

    return data;
}

export function EarningsSimulationChart() {
    const [data, setData] = useState<EarningsDataPoint[]>([]);

    useEffect(() => {
        const simulatedData = generateSimulatedEarnings(30);
        setData(simulatedData);
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
                <CardTitle>Earnings Simulation</CardTitle>
                <CardDescription>
                    Simulated earnings over the last 30 days
                </CardDescription>
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
                        />
                        <YAxis
                            allowDecimals={true}
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                        />
                        <Tooltip
                            content={({ active, payload }) =>
                                active && payload && payload.length ? (
                                    <div className="rounded bg-white p-2 shadow-lg border border-gray-200">
                                        <div><strong>{payload[0].payload.label}</strong></div>
                                        <div>Earnings: ${payload[0].payload.earnings.toFixed(2)}</div>
                                    </div>
                                ) : null
                            }
                        />
                        <Area
                            dataKey="earnings"
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

export function MostActiveSportsChart() {
    const [data, setData] = useState<{ sportName: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getMostActiveSports()
            .then((res) => setData(res))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Card className="m-4">
            <CardHeader>
                <CardTitle>Most Active Sports</CardTitle>
                <CardDescription>Top 10 sports by number of bookings</CardDescription>
            </CardHeader>
            <CardContent className="w-full h-[350px]">
                {loading ? (
                    <div className="text-center py-10">Loading chart...</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="sportName"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={80}
                            />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar
                                dataKey="count"
                                fill="var(--chart-1)"
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

export function FacilityApprovalTrendChart() {
    const [data, setData] = useState<{ date: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getFacilityApprovalTrends()
            .then((res) => {
                setData(res);
            })
            .finally(() => setLoading(false));
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
                <CardTitle>Facility Approval Trend</CardTitle>
                <CardDescription>
                    Number of venues approved over time
                </CardDescription>
            </CardHeader>
            <CardContent className="w-full h-[350px]">
                {loading ? (
                    <div className="text-center py-10">Loading chart...</div>
                ) : (
                    <ChartContainer
                        config={{ approvals: { label: "Approvals", color: "var(--chart-1)" } }}
                        className="w-full h-full"
                        style={{ minWidth: 0 }}
                    >
                        <AreaChart
                            data={formattedData}
                            margin={{ left: 12, right: 12, top: 20, bottom: 20 }}
                            height={350}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis allowDecimals={false} />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Area
                                dataKey="count"
                                type="natural"
                                fill="var(--color-approvals)"
                                fillOpacity={0.4}
                                stroke="var(--color-approvals)"
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}

export function UserRegistrationTrendsChart() {
    const [data, setData] = useState<{ date: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getUserRegistrationTrends()
            .then((res) => {
                setData(res);
            })
            .finally(() => setLoading(false));
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
                <CardTitle>User Registration Trends</CardTitle>
                <CardDescription>
                    Number of users registered over time
                </CardDescription>
            </CardHeader>
            <CardContent className="w-full h-[350px]">
                {loading ? (
                    <div className="text-center py-10">Loading chart...</div>
                ) : (
                    <ChartContainer
                        config={{ registrations: { label: "Registrations", color: "var(--chart-1)" } }}
                        className="w-full h-full"
                        style={{ minWidth: 0 }}
                    >
                        <AreaChart
                            data={formattedData}
                            margin={{ left: 12, right: 12, top: 20, bottom: 20 }}
                            height={350}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis allowDecimals={false} />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Area
                                dataKey="count"
                                type="natural"
                                fill="var(--color-registrations)"
                                fillOpacity={0.4}
                                stroke="var(--color-registrations)"
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}

export function BookingActivityChart() {
    const [data, setData] = useState<{ date: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getBookingActivity()
            .then((res) => {
                setData(res);
            })
            .finally(() => setLoading(false));
    }, []);

    // Format dates to nicer labels, e.g. "Aug 11"
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
                <CardTitle>Booking Activity Over Time</CardTitle>
                <CardDescription>Daily bookings for the last period</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                {loading ? (
                    <div className="text-center py-10">Loading chart...</div>
                ) : (
                    <ChartContainer
                        config={{ bookings: { label: "Bookings", color: "var(--chart-1)" } }}
                        className="w-full max-w-4xl h-[350px]"  // max width to avoid too wide
                        style={{ minWidth: 0 }}
                    >
                        <AreaChart
                            data={formattedData}
                            margin={{ left: 12, right: 12, top: 20, bottom: 20 }}
                            width={1000}   // fixed width is okay if container max width limits it
                            height={350}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis allowDecimals={false} />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Area
                                dataKey="count"
                                type="natural"
                                fill="var(--color-bookings)"
                                fillOpacity={0.4}
                                stroke="var(--color-bookings)"
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
