import Image from "next/image"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { MapPin } from "lucide-react"
import * as React from "react"
import { getVenues } from "@/app/actions/getVenues";
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

const images = [
    "https://cdn.pixabay.com/photo/2016/05/31/23/21/badminton-1428046_1280.jpg",
    "https://cdn.pixabay.com/photo/2022/01/27/14/37/sports-6972298_1280.jpg",
    "https://cdn.pixabay.com/photo/2014/08/14/19/18/tennis-player-418226_1280.jpg",
    "https://cdn.pixabay.com/photo/2016/05/27/14/33/football-1419954_1280.jpg",
    "https://cdn.pixabay.com/photo/2022/10/23/19/38/womens-football-7541990_1280.jpg",
];

export async function PopularVenues() {
    const venues = await getVenues();

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="relative">
                <Carousel opts={{ align: "start" }} className="w-full max-w-full">
                    <CarouselContent>
                        {venues.map((venue, index) => (
                            <CarouselItem
                                key={venue.id}
                                className="md:basis-1/2 lg:basis-1/3"
                            >
                                <div className="p-1">
                                    <Card className="overflow-hidden">
                                        {/* Top: Image */}
                                        <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96">
                                            <img
                                                src={images[index % images.length]} // cycle images
                                                alt={venue.name}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>

                                        {/* Divider */}
                                        <hr className="border-t border-gray-200" />

                                        {/* Bottom: Text */}
                                        <CardContent className="p-4 text-center">
                                            <h3 className="text-lg font-semibold">{venue.name}</h3>
                                            {venue.description && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {venue.description.length > 80
                                                        ? venue.description.slice(0, 80) + "..."
                                                        : venue.description}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="left-2 sm:left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="right-2 sm:right-4 top-1/2 -translate-y-1/2" />
                </Carousel>
            </div>
        </section>
    );
}

const sports = [
    {
        image: "https://cdn.pixabay.com/photo/2016/05/31/23/21/badminton-1428046_1280.jpg",
        game: "Badminton",
    },
    {
        image: "https://cdn.pixabay.com/photo/2022/01/27/14/37/sports-6972298_1280.jpg",
        game: "Cricket",
    },
    {
        image: "https://cdn.pixabay.com/photo/2014/08/14/19/18/tennis-player-418226_1280.jpg",
        game: "Tennis",
    },
    {
        image: "https://cdn.pixabay.com/photo/2016/05/27/14/33/football-1419954_1280.jpg",
        game: "Football",
    },
    {
        image: "https://cdn.pixabay.com/photo/2022/10/23/19/38/womens-football-7541990_1280.jpg",
        game: "Football",
    },
];

export function PopularSports() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="relative">
                <Carousel opts={{ align: "start" }} className="w-full max-w-full">
                    <CarouselContent>
                        {sports.map((sport, index) => (
                            <CarouselItem
                                key={index}
                                className="md:basis-1/2 lg:basis-1/3"
                            >
                                <div className="p-1">
                                    <Card className="overflow-hidden">
                                        {/* Image */}
                                        <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96">
                                            <img
                                                src={sport.image}
                                                alt={sport.game}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        {/* Text */}
                                        <CardContent className="p-4 text-center">
                                            <span className="text-lg font-semibold">
                                                {sport.game}
                                            </span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="left-2 sm:left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="right-2 sm:right-4 top-1/2 -translate-y-1/2" />
                </Carousel>
            </div>
        </section>
    );
}

export function Hero() {
    return (
        <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 grid gap-8 lg:grid-cols-2 items-center">
                {/* Left column - text */}
                <div className="flex items-center ml-4">
                    <div>
                        <div className="flex gap-2 items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />Ahmedabad, Gujarat
                        </div>

                        <div className="mt-2">
                            <div className="text-2xl text-primary sm:text-3xl md:text-4xl mt-4 leading-tight">
                                Welcome to,
                            </div>
                            <TypingAnimation>QuickCourt...</TypingAnimation>
                            <div className="text-2xl sm:text-3xl md:text-4xl mt-4 leading-tight">
                                Find Venues and <br />Players Nearby
                            </div>
                            <p className="max-w-md mt-4 text-base">
                                Seamlessly explore sports venues and play with sports enthusiasts just like you.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right column - image */}
                <div className="w-full">
                    <div className="relative w-full h-56 sm:h-72 md:h-96 lg:h-[85vh] rounded-xl overflow-hidden">
                        <Image
                            src="/badminton.jpg"
                            alt="Hero Image"
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default function Main() {
    return (
        <div>
            <Hero />
            <div className="mt-6">
                <div className="mx-5 flex justify-between items-center">
                    <span className="text-xl font-semibold">
                        Popular Venues:
                    </span>
                    <span className="text-xl font-medium hover:underline">
                        <Link href="/find-venues">
                            All Venues
                        </Link>
                    </span>
                </div>
                <PopularVenues />
            </div>
            <div className="mt-6">
                <div className="mx-5 flex justify-between items-center">
                    <span className="text-xl font-semibold">
                        Popular Sports:
                    </span>
                    <span className="text-xl font-medium hover:underline">
                        <Link href="/find-venues">
                            Find More
                        </Link>
                    </span>
                </div>
                <PopularSports />
            </div>
        </div>
    )
}
