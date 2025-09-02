import { ArrowLeft, Home } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import MaxWidthContainer from "@/components/max-width-container";

export default function NotFound() {
    const router = useRouter();

    const handleGoBack = () => {
        if (typeof window !== "undefined") {
            router.history.back();
        }
    };

    return (
        <MaxWidthContainer className="h-screen flex items-center justify-center">
            <div className="text-center space-y-8">
                {/* 404 Icon/Number */}
                <div className="relative">
                    <h1 className="text-8xl font-bold text-accent select-none">404</h1>
                </div>

                {/* Error Message */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-semibold">Page Not Found</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Sorry, we couldn't find the page you're looking for. The page might have
                        been moved, deleted, or the URL might be incorrect.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={handleGoBack}
                        variant="outline"
                        className="flex items-center gap-2 px-6 bg-transparent"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>

                    <Button asChild className="flex items-center gap-2 px-6">
                        <Link to="/">
                            <Home className="h-4 w-4" />
                            Return Home
                        </Link>
                    </Button>
                </div>
            </div>
        </MaxWidthContainer>
    );
}
