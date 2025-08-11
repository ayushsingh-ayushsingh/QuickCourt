"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function FacilityManagement() {
    const [facilities, setFacilities] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: "",
        location: "",
        description: "",
        sports: "",
        userName: "",
        court: "",
        time: "",
        status: "booked",
        amenities: "",
        photos: [],
        courtName: "",
        sportType: "",
        pricePerHour: "",
        operatingHours: "",
    });

    useEffect(() => {
        const stored = localStorage.getItem("facilities");
        if (stored) {
            setFacilities(JSON.parse(stored));
        }
    }, []);

    const handleChange = (e: any) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData((prev: any) => ({
                ...prev,
                photos: Array.from(files).map((file: any) => URL.createObjectURL(file)),
            }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        const updated = [...facilities, { id: Date.now(), ...formData }];
        setFacilities(updated);
        localStorage.setItem("facilities", JSON.stringify(updated));
        setFormData({
            name: "",
            location: "",
            description: "",
            sports: "",
            userName: "",
            court: "",
            time: "",
            status: "booked",
            amenities: "",
            photos: [],
            courtName: "",
            sportType: "",
            pricePerHour: "",
            operatingHours: "",
        });
        setOpen(false);
    };

    return (
        <div className="space-y-4 my-8 p-4 rounded-xl bg-card shadow-sm mx-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Facility Management</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>Add Facility</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add Facility</DialogTitle>
                        </DialogHeader>

                        {/* Basic Info */}
                        <div className="grid gap-4">
                            <div>
                                <Label>Name</Label>
                                <Input name="name" value={formData.name} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Location</Label>
                                <Input name="location" value={formData.location} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea name="description" value={formData.description} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Sports Supported</Label>
                                <Input name="sports" value={formData.sports} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>User Name</Label>
                                <Input name="userName" value={formData.userName} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label>Court</Label>
                                    <Input name="court" value={formData.court} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Time</Label>
                                    <Input type="time" name="time" value={formData.time} onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(val) => handleSelectChange("status", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="booked">Booked</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Amenities Offered</Label>
                                <Input name="amenities" value={formData.amenities} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Upload Photos</Label>
                                <Input type="file" multiple onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label>Court Name</Label>
                                    <Input name="courtName" value={formData.courtName} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label>Sport Type</Label>
                                    <Input name="sportType" value={formData.sportType} onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <Label>Pricing Per Hour</Label>
                                <Input name="pricePerHour" type="number" value={formData.pricePerHour} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Operating Hours</Label>
                                <Input name="operatingHours" value={formData.operatingHours} onChange={handleChange} />
                            </div>
                        </div>

                        <Button className="mt-4 w-full" onClick={handleSave}>
                            Save Facility
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Table */}
            <Table>
                <TableCaption>List of facilities.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Sports</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price/hr</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {facilities.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                No facilities found
                            </TableCell>
                        </TableRow>
                    ) : (
                        facilities.map((f) => (
                            <TableRow key={f.id}>
                                <TableCell>{f.name}</TableCell>
                                <TableCell>{f.location}</TableCell>
                                <TableCell>{f.sports}</TableCell>
                                <TableCell className="capitalize">{f.status}</TableCell>
                                <TableCell>{f.pricePerHour}</TableCell>
                                <TableCell>
                                    <Button size="sm" variant="outline">
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
