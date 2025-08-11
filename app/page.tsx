import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const navLinks = [
    {
      name: "Login",
      href: "/login",
    },
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact Us",
      href: "/contact-us",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <nav className="flex justify-between">
        <Button asChild variant={"link"}>
          <Link href={"/"} >QuickCourt</Link>
        </Button>
        <ul className="flex gap-0">
          {
            navLinks.map((item, index) => (
              <li key={index}>
                <Button asChild variant={"link"}>
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              </li>
            ))
          }
        </ul>
      </nav>
    </div>
  );
}
