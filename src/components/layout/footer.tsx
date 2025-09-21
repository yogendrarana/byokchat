import { Link } from "@tanstack/react-router";

import { siteData } from "@/config/site";
import MaxWidthContainer from "../max-width-container";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={className}>
      <div className="border-b">
        <MaxWidthContainer className="sm:border-l sm:border-r px-2 md:px-8">
          <div className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left: Site name */}
            <p className="font-bold text-base text-foreground text-center md:text-left">
              {siteData.name}
            </p>

            {/* Middle: Links */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link
                to="/"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Documentation
              </Link>
              <a
                target="_blank"
                href="https://github.com/yogendrarana/byokchat"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                GitHub
              </a>
            </div>
          </div>
        </MaxWidthContainer>
      </div>
      {/* Bottom: Copyright */}
      <MaxWidthContainer className="sm:border-l sm:border-r">
        <div className="py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteData.name}
        </div>
      </MaxWidthContainer>
    </footer>
  );
}
