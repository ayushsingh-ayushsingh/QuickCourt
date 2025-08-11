"use client";

import { useState, useEffect } from "react";
import { getUsersByRole } from "@/app/actions/getUsersByRole";
import { Button } from "@/components/ui/button";
import { approveUserAction } from "@/app/actions/approveUserAction";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
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

export default function GlobalStats() {
    const [role, setRole] = useState("all");
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch data when role changes
    useEffect(() => {
        setLoading(true);
        getUsersByRole(role)
            .then((data) => {
                setUsers(data);
                setCurrentPage(1);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [role]);

    const totalPages = Math.ceil(users.length / rowsPerPage);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentUsers = users.slice(startIndex, startIndex + rowsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-4 mt-4">
            {/* Top controls */}
            <div className="flex items-center justify-between">
                {/* Role filter on left */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Filter by role:</span>
                    <Select value={role} onValueChange={(value) => setRole(value)}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="owner">Facility Owner</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Rows per page select on right */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Rows per page:</span>
                    <Select
                        value={rowsPerPage.toString()}
                        onValueChange={(value) => {
                            setRowsPerPage(Number(value));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableCaption>List of registered users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : currentUsers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                No users found
                            </TableCell>
                        </TableRow>
                    ) : (
                        currentUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.emailVerified ? "Yes" : "No"}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {user.pendingRole ?
                                        <Button
                                            size="sm"
                                            onClick={async () => {
                                                await approveUserAction(user.id);
                                                setUsers((prev) =>
                                                    prev.map((u) =>
                                                        u.id === user.id
                                                            ? { ...u, role: user.pendingRole, pendingRole: null }
                                                            : u
                                                    )
                                                );
                                            }}
                                        >
                                            Approve {user.pendingRole}
                                        </Button> :
                                        <Button
                                            size="sm"
                                            disabled
                                        >
                                            Approve {user.pendingRole}
                                        </Button>
                                    }
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6}>
                            Total: {users.length} users
                        </TableCell>
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

                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
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
                            } else if (
                                page === currentPage - 2 ||
                                page === currentPage + 2
                            ) {
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
