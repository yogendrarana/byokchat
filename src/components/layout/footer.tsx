import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { siteData } from "@/config/site";

export default function Footer({ className }: { className?: string }) {
    return (
        <footer className={cn(className)}>
            <div className="px-4 py-6 flex flex-col items-center justify-between gap-8 md:flex-row border-b">
                <p className="font-bold">{siteData.name}</p>

                <div className="flex flex-wrap items-center gap-6">
                    <Link
                        to="/"
                        className="text-slate-600 hover:text-emerald-700 transition-colors text-sm"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        to="/"
                        className="text-slate-600 hover:text-emerald-700 transition-colors text-sm"
                    >
                        Terms of Service
                    </Link>
                    <Link
                        to="/"
                        className="text-slate-600 hover:text-emerald-700 transition-colors text-sm"
                    >
                        Documentation
                    </Link>
                    <a
                        href="https://github.com/bloom/bloom"
                        className="text-slate-600 hover:text-emerald-700 transition-colors text-sm"
                    >
                        GitHub
                    </a>
                </div>
            </div>

            <div className="py-6 flex items-center justify-center text-slate-500 text-sm">
                <span>
                    &copy; {new Date().getFullYear()} {siteData.name}. Open source and proud of it.
                </span>
            </div>
        </footer>
    );
}
