"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/layouts/logout-button";
import { Menu, User2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export function NavbarSheet({ links }: { links: { href: string; name: string }[] }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetTitle className="sr-only">Navbar</SheetTitle>
                <SheetDescription className="sr-only">Collection of links</SheetDescription>
                <ul className="space-y-2 py-4 mt-10 m-2">
                    {links.map((item, index) => (
                        <li key={index}>
                            <Button asChild variant="ghost" className="w-full justify-start">
                                <Link href={item.href}>{item.name}</Link>
                            </Button>
                        </li>
                    ))}
                </ul>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline" className="w-full">
                            Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export function ProfileDropdown({ imageUrl = "" }: { imageUrl: string }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {imageUrl ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                            src={imageUrl}
                            alt="Avatar"
                            width={32}
                            height={32}
                            className="object-cover w-full h-full"
                        />
                    </div>
                ) : (
                    <User2 className="text-white bg-primary rounded-full w-8 h-8 cursor-pointer" />
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <Link href="/profile/edit">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                    <LogoutButton />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function Navbar({ session, role, roleEnabled = true }: { session?: any, role: string, roleEnabled?: boolean }) {
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "https://github.com/ayushsingh-ayushsingh/QuickCourt" },
        { name: "Contact Us", href: "mailto:ayushpno@gmail.com" },
    ];

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <nav
            className={`w-full border-b px-4 py-3 flex items-center justify-between bg-background sticky top-0 transition-transform duration-300 z-50 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
        >
            <Link href="/" className="text-2xl font-bold text-foreground">
                Quick<span className="text-primary">Court</span>
            </Link>

            <ul className="hidden md:flex gap-4 items-center">
                {navLinks.map((item, index) => (
                    <li key={index}>
                        <Button asChild variant="link" className="text-base">
                            <Link href={item.href}>{item.name}</Link>
                        </Button>
                    </li>
                ))}
            </ul>

            <div className="flex items-center gap-2">
                {
                    role === "admin" && roleEnabled &&
                    <Button asChild>
                        <Link href="/dashboard/admin">Admin</Link>
                    </Button>
                }
                {
                    role === "owner" && roleEnabled &&
                    <Button asChild>
                        <Link href="/dashboard/owner">Owner</Link>
                    </Button>
                }
                {session ? (
                    <ProfileDropdown imageUrl={session.user?.image as string} />
                ) : (
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                )}
                <NavbarSheet links={navLinks} />
            </div>
        </nav>
    );
}
