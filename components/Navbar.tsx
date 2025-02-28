import Link from "next/link";
import Logo from "@/public/logo.png"
import Image from "next/image";
import { buttonVariants } from "./ui/button";
import { RainbowButton } from "./magicui/rainbow-button";
export function Navbar(){
    return (
        <div className="flex items-center justify-between py-5">
            <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} alt="logo" className="size-10" />
            <h3 className="text-3xl font-semibold">Invo<span className="text-blue-700">Link</span></h3>
            </Link>
            <Link href="/login"><RainbowButton>Get Started</RainbowButton>
            </Link>
        </div>
    )
}