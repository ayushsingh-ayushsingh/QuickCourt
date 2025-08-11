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
import { Input } from "@/components/ui/input";
import { toggleUserBan } from "@/app/actions/toggleBanAction";

export default function UserManagement() {
    const [role, setRole] = useState("all");
    const [status, setStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        setLoading(true);
        getUsersByRole(role, status, search)
            .then((data) => {
                setUsers(data);
                setCurrentPage(1);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [role, status, search]);

    const totalPages = Math.ceil(users.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentUsers = users.slice(startIndex, startIndex + rowsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleToggleBan = async (userId: string, currentStatus: boolean) => {
        try {
            await toggleUserBan(userId, !currentStatus);
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, isBanned: !currentStatus } : u))
            );
        } catch (error) {
            console.error("Failed to toggle ban status", error);
        }
    };

    return (
        <div className="space-y-4 my-8 p-4 rounded-xl bg-card shadow-sm mx-4">
            <div className="text-2xl">User Management</div>
            {/* Top controls */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* Search bar */}
                <div className="flex items-center gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
                    <Input
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full"
                    />
                </div>

                {/* Role filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Role:</span>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="w-full">
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

                {/* Status filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="not_verified">Not Verified</SelectItem>
                        </SelectContent>
                    </Select>
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
                        <TableHead>Ban</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : currentUsers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                No users found
                            </TableCell>
                        </TableRow>
                    ) : (
                        currentUsers.map((u) => (
                            <TableRow key={u.id}>
                                <TableCell className="font-medium">{u.name}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>{u.emailVerified ? "Yes" : "No"}</TableCell>
                                <TableCell>{u.role}</TableCell>
                                <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {u.pendingRole ? (
                                        <Button
                                            size="sm"
                                            onClick={async () => {
                                                await approveUserAction(u.id);
                                                setUsers((prev) =>
                                                    prev.map((user) =>
                                                        user.id === u.id
                                                            ? { ...user, role: u.pendingRole, pendingRole: null }
                                                            : user
                                                    )
                                                );
                                            }}
                                        >
                                            Approve {u.pendingRole}
                                        </Button>
                                    ) : (
                                        <Button size="sm" disabled>
                                            Action Disabled
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        variant={u.isBanned ? "default" : "destructive"}
                                        onClick={() => handleToggleBan(u.id, u.isBanned)}
                                    >
                                        {u.isBanned ? "Unban" : "Ban"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7}>Total: {users.length} users</TableCell>
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
