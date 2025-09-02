import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { Logo } from "../icons/logo";
import { UserButton } from "../user-button";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";

export default function Header({ className }: { className?: string }) {
    const isHydrated = useHydrated();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        // Set initial scroll state
        handleScroll();

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav
            className={cn("h-[70px] px-4 border-b sticky top-0 z-50", className, {
                "bg-background duration-300": isHydrated && isScrolled
            })}
        >
            <div className={cn("h-full w-full flex items-center justify-between duration-300")}>
                {/* Logo */}
                <div className="mr-6 flex">
                    <Link to="/" className="mr-8 flex items-center space-x-3 group">
                        <Logo />
                    </Link>
                </div>

                <div className="flex gap-2 md:gap-8 items-center">
                    {/* Desktop Navigation */}

                    <div className="flex gap-2 items-center">
                        <ThemeToggle />
                        <UserButton />

                        {/* Mobile menu button */}
                        <div className="md:hidden space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? (
                                    <X className="h-4 w-4" />
                                ) : (
                                    <Menu className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="w-full rounded-sm  md:hidden">
                    <div className="mt-2 p-4 space-y-2 border rounded-sm bg-background backdrop-blur-sm ">
                        {/* TODO: chat list */}
                    </div>
                </div>
            )}
        </nav>
    );
}
