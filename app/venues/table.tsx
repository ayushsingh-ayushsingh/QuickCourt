"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Star, Calendar, DollarSign, Users, CheckCircle, XCircle, Clock, User, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// In-memory storage for bookings (simulating localStorage)
let bookingsStorage: any[] = [];

// Mock courts data for booking
const mockCourts = [
    { id: "1", name: "Court A", pricePerHour: 500 },
    { id: "2", name: "Court B", pricePerHour: 600 },
    { id: "3", name: "Court C", pricePerHour: 450 },
];

// Mock server action for fetching images
async function fetchVenueImages(venueId: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock image data
    return [
        { id: "1", url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop" },
        { id: "2", url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop" },
        { id: "3", url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop" },
        { id: "4", url: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=300&h=200&fit=crop" },
    ];
}

// Mock server action for fetching amenities
async function fetchVenueAmenities(venueId: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock amenities data
    return [
        { id: "1", name: "Free Parking" },
        { id: "2", name: "Changing Rooms" },
        { id: "3", name: "Equipment Rental" },
        { id: "4", name: "Refreshment Area" },
        { id: "5", name: "Air Conditioning" },
        { id: "6", name: "First Aid Kit" },
        { id: "7", name: "WiFi" },
        { id: "8", name: "Security Cameras" },
    ];
}

// Mock server action for fetching sports
async function fetchVenueSports(venueId: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Mock sports data
    return [
        { id: "1", name: "Badminton" },
        { id: "2", name: "Tennis" },
        { id: "3", name: "Basketball" },
    ];
}

// Mock server action for fetching address
async function fetchVenueAddress(venueId: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock address data
    return {
        id: "1",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        latitude: "19.0760",
        longitude: "72.8777"
    };
}

function BookNowDialog({ venue }: { venue: any }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [duration, setDuration] = useState("1");
    const [selectedCourt, setSelectedCourt] = useState("");
    const [playerCount, setPlayerCount] = useState("2");
    const [specialRequests, setSpecialRequests] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    const selectedCourtData = mockCourts.find(court => court.id === selectedCourt);
    const totalAmount = selectedCourtData ? selectedCourtData.pricePerHour * parseInt(duration) : 0;

    // Generate time slots
    const timeSlots = [
        "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
        "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
        "18:00", "19:00", "20:00", "21:00", "22:00"
    ];

    // Get today's date for min date input
    const today = new Date().toISOString().split('T')[0];

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !selectedCourt || !customerName || !customerPhone) {
            alert("Please fill in all required fields");
            return;
        }

        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const bookingData = {
            id: `booking_${Date.now()}`,
            venueId: venue.id,
            venueName: venue.name,
            courtId: selectedCourt,
            courtName: selectedCourtData?.name,
            date: selectedDate,
            time: selectedTime,
            duration: parseInt(duration),
            playerCount: parseInt(playerCount),
            totalAmount,
            customerName,
            customerPhone,
            specialRequests,
            status: "confirmed",
            bookedAt: new Date().toISOString()
        };

        // Save to in-memory storage (simulating localStorage)
        bookingsStorage.push(bookingData);
        console.log("Booking saved:", bookingData);
        console.log("All bookings:", bookingsStorage);

        setLoading(false);
        setOpen(false);

        // Reset form
        setSelectedDate("");
        setSelectedTime("");
        setDuration("1");
        setSelectedCourt("");
        setPlayerCount("2");
        setSpecialRequests("");
        setCustomerName("");
        setCustomerPhone("");

        alert("Booking confirmed! Check console for saved data.");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r bg-primary font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <CreditCard className="h-6 w-6 text-primary" />
                        Book {venue.name}
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details to book your slot at this venue
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Venue Summary */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-primary">Venue Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Venue</span>
                                <span className="font-semibold text-primary">{venue.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Starting Price</span>
                                <span className="font-semibold text-primary">
                                    ₹{venue.startingPricePerHour ? Number(venue.startingPricePerHour).toLocaleString() : '500'}/hour
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Rating</span>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="text-sm">
                                        {venue.ratingCount > 0 ? `${Number(venue.ratingAvg).toFixed(1)}` : '4.5'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Booking Details */}
                    <Card className="border-orange-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-primary flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Booking Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="date" className="text-sm font-medium">Select Date *</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={selectedDate}
                                        min={today}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Select Time *</Label>
                                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Choose time slot" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlots.map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Duration (hours) *</Label>
                                    <Select value={duration} onValueChange={setDuration}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 hour</SelectItem>
                                            <SelectItem value="2">2 hours</SelectItem>
                                            <SelectItem value="3">3 hours</SelectItem>
                                            <SelectItem value="4">4 hours</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Select Court *</Label>
                                    <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Choose court" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockCourts.map((court) => (
                                                <SelectItem key={court.id} value={court.id}>
                                                    {court.name} - ₹{court.pricePerHour}/hour
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Number of Players</Label>
                                    <Select value={playerCount} onValueChange={setPlayerCount}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select players" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 player</SelectItem>
                                            <SelectItem value="2">2 players</SelectItem>
                                            <SelectItem value="4">4 players</SelectItem>
                                            <SelectItem value="6">6 players</SelectItem>
                                            <SelectItem value="8">8+ players</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="specialRequests" className="text-sm font-medium">Special Requests</Label>
                                <Textarea
                                    id="specialRequests"
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                    placeholder="Any special requirements or requests..."
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Booking Summary */}
                    {selectedCourt && (
                        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Booking Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Court</span>
                                    <span className="font-medium">{selectedCourtData?.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Duration</span>
                                    <span className="font-medium">{duration} hour(s)</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Rate per hour</span>
                                    <span className="font-medium">₹{selectedCourtData?.pricePerHour.toLocaleString()}</span>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold">Total Amount</span>
                                        <span className="text-xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter className="flex gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleBooking}
                        disabled={loading}
                        className="bg-primary font-semibold px-6"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Confirm Booking
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function VenueDetailsDialog({ venue }: { venue: any }) {
    const [images, setImages] = useState<any[]>([]);
    const [amenities, setAmenities] = useState<any[]>([]);
    const [sports, setSports] = useState<any[]>([]);
    const [address, setAddress] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpenDialog = async () => {
        setOpen(true);
        setLoading(true);

        try {
            // Fetch all data in parallel
            const [imagesData, amenitiesData, sportsData, addressData] = await Promise.all([
                fetchVenueImages(venue.id),
                fetchVenueAmenities(venue.id),
                fetchVenueSports(venue.id),
                fetchVenueAddress(venue.id)
            ]);

            setImages(imagesData);
            setAmenities(amenitiesData);
            setSports(sportsData);
            setAddress(addressData);
        } catch (error) {
            console.error('Error fetching venue details:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenDialog}
                >
                    View Details
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {venue.name}
                    </DialogTitle>
                    <DialogDescription>
                        Complete venue information and gallery
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Venue Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Venue Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                    <p className="text-sm">{venue.description || "No description available"}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Starting Price</Label>
                                    <p className="text-sm font-semibold">
                                        {venue.startingPricePerHour
                                            ? `₹${Number(venue.startingPricePerHour).toLocaleString()}/hour`
                                            : "Price not set"
                                        }
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Approval Status</Label>
                                    <div className="flex items-center gap-2">
                                        {venue.isApproved ? (
                                            <>
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <Badge variant="secondary" className="text-green-700 bg-green-100">
                                                    Approved
                                                </Badge>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-4 w-4 text-orange-600" />
                                                <Badge variant="secondary" className="text-orange-700 bg-orange-100">
                                                    Pending
                                                </Badge>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Rating</Label>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <p className="text-sm">
                                            {venue.ratingCount > 0
                                                ? `${Number(venue.ratingAvg).toFixed(1)} (${venue.ratingCount} reviews)`
                                                : "No ratings yet"
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Created Date</Label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <p className="text-sm">{new Date(venue.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {address && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                                        <p className="text-sm">{address.city}, {address.state} - {address.pincode}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sports Available */}
                    {loading ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Sports Available</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="animate-pulse">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-8 bg-gray-200 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Sports Available</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {sports.map((sport) => (
                                        <Badge key={sport.id} variant="outline" className="justify-center py-2">
                                            {sport.name}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Amenities */}
                    {loading ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Amenities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="animate-pulse">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                            <div key={i} className="h-8 bg-gray-200 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Amenities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                    {amenities.map((amenity) => (
                                        <Badge key={amenity.id} variant="secondary" className="justify-center py-2">
                                            {amenity.name}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Images Gallery */}
                    {loading ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Gallery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="animate-pulse">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="aspect-video bg-gray-200 rounded-lg"></div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Gallery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {images.map((image) => (
                                        <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden">
                                            <img
                                                src={image.url}
                                                alt={`Venue image ${image.id}`}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Additional Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Additional Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Venue Details */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Venue Details</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between py-1 border-b border-gray-100">
                                            <span className="text-sm text-muted-foreground">ID</span>
                                            <span className="text-sm font-mono">{venue.id}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-gray-100">
                                            <span className="text-sm text-muted-foreground">Owner ID</span>
                                            <span className="text-sm font-mono">{venue.ownerId}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-gray-100">
                                            <span className="text-sm text-muted-foreground">Rating Count</span>
                                            <span className="text-sm">{venue.ratingCount} reviews</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-sm text-muted-foreground">Status</span>
                                            <Badge variant={venue.isApproved ? "default" : "secondary"}>
                                                {venue.isApproved ? "Active" : "Pending Approval"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Details */}
                                {address && !loading && (
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Location Details</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between py-1 border-b border-gray-100">
                                                <span className="text-sm text-muted-foreground">City</span>
                                                <span className="text-sm">{address.city}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-gray-100">
                                                <span className="text-sm text-muted-foreground">State</span>
                                                <span className="text-sm">{address.state}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-gray-100">
                                                <span className="text-sm text-muted-foreground">Pincode</span>
                                                <span className="text-sm">{address.pincode}</span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="text-sm text-muted-foreground">Coordinates</span>
                                                <span className="text-sm font-mono">{address.latitude}, {address.longitude}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Statistics Summary */}
                            <div className="pt-4 border-t">
                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Statistics</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{sports.length}</div>
                                        <div className="text-xs text-muted-foreground">Sports Available</div>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{amenities.length}</div>
                                        <div className="text-xs text-muted-foreground">Amenities</div>
                                    </div>
                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">{images.length}</div>
                                        <div className="text-xs text-muted-foreground">Photos</div>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">{venue.ratingCount}</div>
                                        <div className="text-xs text-muted-foreground">Reviews</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function VenuesTable({ venues }: { venues: any[] }) {
    const [search, setSearch] = useState("");

    const filteredVenues = venues.filter((venue) => {
        const term = search.toLowerCase();
        return (
            venue.name.toLowerCase().includes(term) ||
            (venue.description || "").toLowerCase().includes(term)
        );
    });

    return (
        <div className="bg-card p-4 m-4 rounded-xl shadow-sm">
            {/* Search Input */}
            <div className="mb-4">
                <Input
                    type="text"
                    placeholder="Search venues..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Price/Hour</TableHead>
                            <TableHead>Approval Status</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Book Now</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredVenues.length > 0 ? (
                            filteredVenues.map((venue) => (
                                <TableRow key={venue.id}>
                                    <TableCell className="font-medium">{venue.name}</TableCell>
                                    <TableCell>{venue.description || "—"}</TableCell>
                                    <TableCell>
                                        {venue.startingPricePerHour
                                            ? `₹${Number(venue.startingPricePerHour).toLocaleString()}`
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {venue.isApproved ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    <span className="text-green-700">Approved</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-4 w-4 text-orange-600" />
                                                    <span className="text-orange-700">Pending</span>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <VenueDetailsDialog venue={venue} />
                                    </TableCell>
                                    <TableCell>
                                        <BookNowDialog venue={venue} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    No venues found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}