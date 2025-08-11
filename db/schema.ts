import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  varchar,
  real,
} from "drizzle-orm/pg-core";

/* ---------------------------
   Auth tables
--------------------------- */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: text("role").notNull().default("user"),
  isBanned: boolean("is_banned").default(false).notNull(),
  pendingRole: varchar("pending_role"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ---------------------------
   Core business tables
--------------------------- */
export const address = pgTable("address", {
  id: text("id").primaryKey(),
  venueId: text("venue_id"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
});

export const sport = pgTable("sport", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const amenity = pgTable("amenity", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const venue = pgTable("venue", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  startingPricePerHour: numeric("starting_price_per_hour"),
  isApproved: boolean("is_approved").default(false).notNull(),
  ratingAvg: numeric("rating_avg"),
  ratingCount: integer("rating_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const venue_sport = pgTable("venue_sport", {
  id: text("id").primaryKey(),
  venueId: text("venue_id").notNull(),
  sportId: text("sport_id").notNull(),
});

export const venue_amenity = pgTable("venue_amenity", {
  id: text("id").primaryKey(),
  venueId: text("venue_id").notNull(),
  amenityId: text("amenity_id").notNull(),
});

export const venue_photo = pgTable("venue_photo", {
  id: text("id").primaryKey(),
  venueId: text("venue_id").notNull(),
  url: text("url").notNull(),
});

export const court = pgTable("court", {
  id: text("id").primaryKey(),
  venueId: text("venue_id").notNull(),
  name: text("name").notNull(),
  sportId: text("sport_id"),
  pricePerHour: numeric("price_per_hour"),
  status: text("status").default("active").notNull(),
});

export const booking = pgTable("booking", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  venueId: text("venue_id").notNull(),
  courtId: text("court_id").notNull(),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at").notNull(),
  amount: numeric("amount"),
  status: text("status").default("booked").notNull(),
});

export const review = pgTable("review", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  venueId: text("venue_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
});

export const owner_metrics = pgTable("owner_metrics", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  totalBookings: integer("total_bookings").default(0).notNull(),
  activeCourts: integer("active_courts").default(0).notNull(),
  earningsCents: real("earnings_cents").default(0).notNull(),
});

export const schema = {
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
};
