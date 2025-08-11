import { faker } from "@faker-js/faker";
import { db } from "../drizzle";
import {
    user,
    session,
    account,
    verification,
    address,
    sport,
    amenity,
    venue,
    venue_sport,
    venue_amenity,
    venue_photo,
    court,
    booking,
    review,
    owner_metrics,
} from "@/db/schema";

async function seed() {
    console.log("🌱 Starting DB seeding...");

    // Clear old data
    await db.delete(review);
    await db.delete(booking);
    await db.delete(court);
    await db.delete(venue_photo);
    await db.delete(venue_amenity);
    await db.delete(venue_sport);
    await db.delete(venue);
    await db.delete(amenity);
    await db.delete(sport);
    await db.delete(address);
    await db.delete(owner_metrics);
    await db.delete(account);
    await db.delete(session);
    await db.delete(verification);
    await db.delete(user);

    // Create some users
    const roles = ["user", "owner", "admin"];
    const usersData = Array.from({ length: 15 }).map(() => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        emailVerified: faker.datatype.boolean(),
        image: faker.image.avatar(),
        role: faker.helpers.arrayElement(roles),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    }));
    await db.insert(user).values(usersData);
    console.log(`✅ Inserted ${usersData.length} users`);

    // Get owners for venues
    const owners = usersData.filter((u) => u.role === "owner");

    // Create sports
    const sportsList = ["Cricket", "Football", "Tennis", "Badminton"];
    const sportsData = sportsList.map((name) => ({
        id: faker.string.uuid(),
        name,
    }));
    await db.insert(sport).values(sportsData);
    console.log(`✅ Inserted ${sportsData.length} sports`);

    // Create amenities
    const amenitiesList = ["Parking", "Cafeteria", "Locker Room", "Restrooms"];
    const amenitiesData = amenitiesList.map((name) => ({
        id: faker.string.uuid(),
        name,
    }));
    await db.insert(amenity).values(amenitiesData);
    console.log(`✅ Inserted ${amenitiesData.length} amenities`);

    // Create venues
    const venuesData = Array.from({ length: 6 }).map(() => ({
        id: faker.string.uuid(),
        ownerId: faker.helpers.arrayElement(owners).id,
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        isApproved: faker.datatype.boolean(),
        startingPricePerHour: faker.finance.amount({ min: 500, max: 3000, dec: 2 }),
        pricePerHour: faker.finance.amount({ min: 200, max: 2000, dec: 2 }),
        amount: faker.finance.amount({ min: 200, max: 2000, dec: 2 }),
    }));
    await db.insert(venue).values(venuesData);
    console.log(`✅ Inserted ${venuesData.length} venues`);

    // Create addresses for venues
    const cities = ["Gandhinagar", "Mumbai", "Chennai", "Kolkata"];
    const addressData = venuesData.map((v) => ({
        id: faker.string.uuid(),
        venueId: v.id,
        city: faker.helpers.arrayElement(cities),
        state: faker.location.state(),
        pincode: faker.location.zipCode("######"),
        latitude: faker.location.latitude().toString(),
        longitude: faker.location.longitude().toString(),
    }));
    await db.insert(address).values(addressData);
    console.log(`✅ Inserted ${addressData.length} addresses`);

    // Venue sports mapping
    const venueSportsData = venuesData.map((v) => ({
        id: faker.string.uuid(),
        venueId: v.id,
        sportId: faker.helpers.arrayElement(sportsData).id,
    }));
    await db.insert(venue_sport).values(venueSportsData);
    console.log(`✅ Inserted ${venueSportsData.length} venue-sport links`);

    // Venue amenities mapping
    const venueAmenitiesData = venuesData.map((v) => ({
        id: faker.string.uuid(),
        venueId: v.id,
        amenityId: faker.helpers.arrayElement(amenitiesData).id,
    }));
    await db.insert(venue_amenity).values(venueAmenitiesData);
    console.log(`✅ Inserted ${venueAmenitiesData.length} venue-amenity links`);

    // Venue photos
    const photosData = venuesData.map((v) => ({
        id: faker.string.uuid(),
        venueId: v.id,
        url: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
    }));
    await db.insert(venue_photo).values(photosData);
    console.log(`✅ Inserted ${photosData.length} photos`);

    // Courts
    const courtsData = Array.from({ length: 12 }).map(() => ({
        id: faker.string.uuid(),
        venueId: faker.helpers.arrayElement(venuesData).id,
        name: faker.word.noun() + " Court",
        sportId: faker.helpers.arrayElement(sportsData).id,
        pricePerHour: faker.finance.amount({ min: 200, max: 2000, dec: 2 }),
        status: "active",
    }));
    await db.insert(court).values(courtsData);
    console.log(`✅ Inserted ${courtsData.length} courts`);

    // Bookings
    const bookingsData = Array.from({ length: 20 }).map(() => ({
        id: faker.string.uuid(),
        userId: faker.helpers.arrayElement(usersData).id,
        venueId: faker.helpers.arrayElement(venuesData).id,
        courtId: faker.helpers.arrayElement(courtsData).id,
        startAt: faker.date.future(),
        endAt: faker.date.future(),
        amount: faker.finance.amount({ min: 200, max: 2000, dec: 2 }),
        status: faker.helpers.arrayElement(["booked", "cancelled", "completed"]),
    }));
    await db.insert(booking).values(bookingsData);
    console.log(`✅ Inserted ${bookingsData.length} bookings`);

    // Reviews
    const reviewsData = Array.from({ length: 10 }).map(() => ({
        id: faker.string.uuid(),
        userId: faker.helpers.arrayElement(usersData).id,
        venueId: faker.helpers.arrayElement(venuesData).id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
    }));
    await db.insert(review).values(reviewsData);
    console.log(`✅ Inserted ${reviewsData.length} reviews`);

    // Owner metrics
    const metricsData = owners.map((o) => ({
        id: faker.string.uuid(),
        ownerId: o.id,
        totalBookings: faker.number.int({ min: 0, max: 200 }),
        activeCourts: faker.number.int({ min: 0, max: 20 }),
        earningsCents: faker.number.int({ min: 0, max: 500000 }),
    }));
    await db.insert(owner_metrics).values(metricsData);
    console.log(`✅ Inserted ${metricsData.length} owner metrics`);

    console.log("🎉 DB Seeding completed!");
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
