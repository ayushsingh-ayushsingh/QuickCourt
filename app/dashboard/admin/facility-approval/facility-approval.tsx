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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { getPendingVenues } from "@/app/actions/getPendingVenues";
import { approveVenueAction } from "@/app/actions/approveVenueAction";

export default function FacilityApproval() {
    const [venues, setVenues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch venues on mount
    useEffect(() => {
        setLoading(true);
        getPendingVenues()
            .then((data) => {
                setVenues(data);
                setCurrentPage(1);
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredVenues = venues.filter((venue) => {
        const matchesSearch =
            venue.name.toLowerCase().includes(search.toLowerCase()) ||
            (venue.description?.toLowerCase().includes(search.toLowerCase()) ?? false);

        return matchesSearch;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredVenues.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentVenues = filteredVenues.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await approveVenueAction(id);
            setVenues((prev) => prev.filter((venue) => venue.id !== id));
        } catch (error) {
            console.error("Failed to approve venue", error);
        }
    };

    return (
        <div className="space-y-4 my-8 p-4 rounded-xl bg-card shadow-sm mx-4">
            <h2 className="text-2xl mb-4">Pending Facility Approvals</h2>

            {/* Filters and search */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
                {/* Search */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <Input
                        placeholder="Search name or description..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full"
                    />
                </div>

                {/* Rows per page */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Rows:</span>
                    <Select
                        value={rowsPerPage.toString()}
                        onValueChange={(value) => {
                            setRowsPerPage(Number(value));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                    {num}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableCaption>List of venues pending approval</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Description</TableHeadCell>
                        <TableHeadCell>Owner ID</TableHeadCell>
                        <TableHeadCell>Created At</TableHeadCell>
                        <TableHeadCell>Actions</TableHeadCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : currentVenues.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No pending venues found
                            </TableCell>
                        </TableRow>
                    ) : (
                        currentVenues.map((venue) => (
                            <TableRow key={venue.id}>
                                <TableCell className="font-medium">{venue.name}</TableCell>
                                <TableCell>{venue.description || "N/A"}</TableCell>
                                <TableCell>{venue.ownerId}</TableCell>
                                <TableCell>
                                    {new Date(venue.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button size="sm" onClick={() => handleApprove(venue.id)}>
                                        Approve
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Total: {filteredVenues.length} venues</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(currentPage - 1);
                                }}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === currentPage}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(page);
                                            }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }
                            return null;
                        })}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(currentPage + 1);
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
