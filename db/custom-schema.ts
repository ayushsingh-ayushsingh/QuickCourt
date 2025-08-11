import {
    pgTable,
    text,
    timestamp,
    boolean,
    integer,
    numeric,
    json,
    real,
} from "drizzle-orm/pg-core";

/* ---------------------------
   Address table (reusable)
   --------------------------- */
export const address = pgTable("address", {
    id: text("id").primaryKey(),
    venueId: text("venue_id"),
    line1: text("line1"),
    line2: text("line2"),
    city: text("city"),
    state: text("state"),
    country: text("country"),
    pincode: text("pincode"),
    latitude: numeric("latitude"), // optional decimal
    longitude: numeric("longitude"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

/* ---------------------------
   Sports & Amenities master
   --------------------------- */
export const sport = pgTable("sport", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug"), // machine readable
    description: text("description"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

export const amenity = pgTable("amenity", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

/* ---------------------------
   Venues (facility) and metadata
   --------------------------- */
export const venue = pgTable("venue", {
    id: text("id").primaryKey(),
    ownerId: text("owner_id").notNull(), // store user.id of facility owner
    name: text("name").notNull(),
    slug: text("slug"),
    shortLocation: text("short_location"), // e.g., "Ahmedabad"
    description: text("description"),
    about: text("about"),
    startingPricePerHour: numeric("starting_price_per_hour"),
    isApproved: boolean("is_approved").default(false).notNull(),
    approvedBy: text("approved_by"), // admin user id if approved
    approvedAt: timestamp("approved_at"),
    ratingAvg: numeric("rating_avg"), // denormalized average rating
    ratingCount: integer("rating_count").default(0).notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

/* join tables for many-to-many relationships */
export const venue_sport = pgTable("venue_sport", {
    id: text("id").primaryKey(),
    venueId: text("venue_id").notNull(),
    sportId: text("sport_id").notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

export const venue_amenity = pgTable("venue_amenity", {
    id: text("id").primaryKey(),
    venueId: text("venue_id").notNull(),
    amenityId: text("amenity_id").notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

/* ---------------------------
   Venue photos / gallery
   --------------------------- */
export const venue_photo = pgTable("venue_photo", {
    id: text("id").primaryKey(),
    venueId: text("venue_id").notNull(),
    url: text("url").notNull(), // can be base64 or object store url
    altText: text("alt_text"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

/* ---------------------------
   Courts within a venue
   --------------------------- */
export const court = pgTable("court", {
    id: text("id").primaryKey(),
    venueId: text("venue_id").notNull(),
    name: text("name").notNull(), // "Court 1", "Turf A"
    sportId: text("sport_id"), // primary sport for this court
    pricePerHour: numeric("price_per_hour"),
    capacity: integer("capacity"), // players
    status: text("status").default("active").notNull(), // active/disabled/maintenance
    operatingHours: json("operating_hours"), // free-form JSON: {mon: [{start,end}], ...}
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

/* Predefined recurring time slots for a court (e.g., Mon 7-8pm) */
export const court_time_slot = pgTable("court_time_slot", {
    id: text("id").primaryKey(),
    courtId: text("court_id").notNull(),
    dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday .. 6 = Saturday
    startTime: text("start_time").notNull(), // "18:00"
    endTime: text("end_time").notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

/* Spot availability / blocked slots (one-off) */
export const court_availability = pgTable("court_availability", {
    id: text("id").primaryKey(),
    courtId: text("court_id").notNull(),
    blocked: boolean("blocked").default(false).notNull(), // true = blocked for maintenance
    date: timestamp("date").notNull(), // day affected
    startTime: text("start_time"), // optional
    endTime: text("end_time"),
    reason: text("reason"),
    createdBy: text("created_by"), // owner/admin id
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

/* ---------------------------
   Bookings / Reservations
   --------------------------- */
export const booking = pgTable("booking", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(), // who booked (user.id)
    ownerId: text("owner_id").notNull(), // denormalized owner for quick queries
    venueId: text("venue_id").notNull(),
    courtId: text("court_id").notNull(),
    startAt: timestamp("start_at").notNull(),
    endAt: timestamp("end_at").notNull(),
    durationMinutes: integer("duration_minutes"),
    amount: numeric("amount"), // final amount charged (simulated)
    paymentStatus: text("payment_status").default("pending").notNull(), // pending/paid/failed/refunded
    paymentMeta: json("payment_meta"), // simulated gateway response
    status: text("status").default("booked").notNull(), // booked/cancelled/completed
    cancelledBy: text("cancelled_by"),
    cancelledAt: timestamp("cancelled_at"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

/* Booking history / audit trail (each action on booking) */
export const booking_history = pgTable("booking_history", {
    id: text("id").primaryKey(),
    bookingId: text("booking_id").notNull(),
    action: text("action").notNull(), // created, updated, cancelled, completed
    performedBy: text("performed_by"), // user/admin id
    meta: json("meta"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

/* ---------------------------
   Reviews & Ratings
   --------------------------- */
export const review = pgTable("review", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    venueId: text("venue_id").notNull(),
    rating: integer("rating").notNull(), // 1..5
    title: text("title"),
    comment: text("comment"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

/* ---------------------------
   Owner metrics (precomputed, for dashboards)
   - you can maintain these via a cron or DB triggers
   --------------------------- */
export const owner_metrics = pgTable("owner_metrics", {
    id: text("id").primaryKey(),
    ownerId: text("owner_id").notNull(), // user.id of owner
    totalBookings: integer("total_bookings").default(0).notNull(),
    activeCourts: integer("active_courts").default(0).notNull(),
    earningsCents: real("earnings_cents").default(0).notNull(), // store cents/paise to avoid float issues
    bookingsLast7Days: json("bookings_last_7_days"), // store time-series array
    bookingsLast30Days: json("bookings_last_30_days"),
    peakHoursHeatmap: json("peak_hours_heatmap"), // e.g. {"08": 10, "09": 20}
    lastUpdatedAt: timestamp("last_updated_at").$defaultFn(() => new Date()).notNull(),
});

/* ---------------------------
   Admin / moderation actions & reports
   --------------------------- */
export const admin_action = pgTable("admin_action", {
    id: text("id").primaryKey(),
    adminId: text("admin_id").notNull(),
    targetType: text("target_type").notNull(), // "venue" | "user" | "booking" | "review"
    targetId: text("target_id").notNull(),
    action: text("action").notNull(), // "approve", "reject", "ban", "unban", "comment"
    comment: text("comment"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

export const report = pgTable("report", {
    id: text("id").primaryKey(),
    reporterId: text("reporter_id").notNull(),
    targetType: text("target_type").notNull(), // "venue" | "user" | "review" | "booking"
    targetId: text("target_id").notNull(),
    reason: text("reason"),
    status: text("status").default("open").notNull(), // open / in_review / resolved / dismissed
    resolvedBy: text("resolved_by"),
    resolvedAt: timestamp("resolved_at"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

/* ---------------------------
   Additional helpful tables
   --------------------------- */
/* Simulated payouts or earnings ledger per owner (useful for earnings chart) */
export const owner_earnings = pgTable("owner_earnings", {
    id: text("id").primaryKey(),
    ownerId: text("owner_id").notNull(),
    periodStart: timestamp("period_start").notNull(),
    periodEnd: timestamp("period_end").notNull(),
    grossAmount: real("gross_amount").default(0).notNull(),
    fees: real("fees").default(0).notNull(),
    netAmount: real("net_amount").default(0).notNull(),
    meta: json("meta"),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

/* Search helper (denormalized data for quick listing) */
export const venue_list_cache = pgTable("venue_list_cache", {
    id: text("id").primaryKey(),
    venueId: text("venue_id").notNull(),
    name: text("name"),
    shortLocation: text("short_location"),
    startingPricePerHour: numeric("starting_price_per_hour"),
    ratingAvg: numeric("rating_avg"),
    sports: json("sports"), // ["Badminton","Tennis"]
    amenities: json("amenities"),
    photos: json("photos"), // list of urls
    isApproved: boolean("is_approved").default(false).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

/* ---------------------------
   Export combined object for easy import
   --------------------------- */
export const customSchema = {
    address,
    sport,
    amenity,
    venue,
    venue_sport,
    venue_amenity,
    venue_photo,
    court,
    court_time_slot,
    court_availability,
    booking,
    booking_history,
    review,
    owner_metrics,
    admin_action,
    report,
    owner_earnings,
    venue_list_cache,
};
