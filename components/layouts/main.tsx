import Image from "next/image"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import { MapPin } from "lucide-react"
import * as React from "react"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export function PopularSports() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="relative"> {/* Keeps arrows inside this box */}
                <Carousel
                    opts={{ align: "start" }}
                    className="w-full max-w-full"
                >
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem
                                key={index}
                                className="md:basis-1/2 lg:basis-1/3"
                            >
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <span className="text-3xl font-semibold">{index + 1}</span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Move arrows inward for smaller screens */}
                    <CarouselPrevious className="left-2 sm:left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="right-2 sm:right-4 top-1/2 -translate-y-1/2" />
                </Carousel>
            </div>
        </section>
    )
}

export function PopularVenues() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="relative"> {/* Keeps arrows inside this box */}
                <Carousel
                    opts={{ align: "start" }}
                    className="w-full max-w-full"
                >
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem
                                key={index}
                                className="md:basis-1/2 lg:basis-1/3"
                            >
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <span className="text-3xl font-semibold">{index + 1}</span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Move arrows inward for smaller screens */}
                    <CarouselPrevious className="left-2 sm:left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="right-2 sm:right-4 top-1/2 -translate-y-1/2" />
                </Carousel>
            </div>
        </section>
    )
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
