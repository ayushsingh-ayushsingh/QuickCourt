"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHeader,
    TableRow,
    TableHead as TableHeadCell,
} from "@/components/ui/table";
import { getSubmittedFacilities } from "@/app/actions/getSubmittedFacilities";
import { approveVenueAction } from "@/app/actions/approveVenueAction";

export default function AdminFacilityPage() {
    const [facilities, setFacilities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getSubmittedFacilities()
            .then((data) => setFacilities(data))
            .finally(() => setLoading(false));
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await approveVenueAction(id);
            setFacilities((prev) => prev.filter((f) => f.id !== id));
        } catch (error) {
            console.error("Failed to approve venue", error);
        }
    };

    return (
        <div className="p-4 space-y-6 bg-card rounded-xl shadow-sm mx-4 my-8">
            <div className="text-2xl">Submitted Facilities</div>
            {loading ? (
                <div>Loading...</div>
            ) : facilities.length === 0 ? (
                <div>No submitted facilities found.</div>
            ) : (
                <Table>
                    <TableCaption>List of all submitted facilities with photos.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHeadCell>Name</TableHeadCell>
                            <TableHeadCell>Description</TableHeadCell>
                            <TableHeadCell>Owner ID</TableHeadCell>
                            <TableHeadCell>Photos</TableHeadCell>
                            <TableHeadCell>Created At</TableHeadCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {facilities.map((facility) => (
                            <TableRow key={facility.id}>
                                <TableCell className="font-medium">{facility.name}</TableCell>
                                <TableCell>{facility.description || "N/A"}</TableCell>
                                <TableCell>{facility.ownerId}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2 overflow-x-auto max-w-[200px]">
                                        {(facility.photos || []).map((url: string, i: number) => (
                                            <img
                                                key={i}
                                                src={url}
                                                alt={`Facility photo ${i + 1}`}
                                                className="h-16 w-16 object-cover rounded-md border border-gray-300"
                                            />
                                        ))}
                                        {(!facility.photos || facility.photos.length === 0) && (
                                            <span>No photos</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(facility.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6}>
                                Total: {facilities.length} facilities
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            )}
        </div>
    );
}
