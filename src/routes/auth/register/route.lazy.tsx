import React from "react";
import { ChevronLeft } from "lucide-react";
import { createLazyFileRoute, Link, Outlet } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import MaxWidthContainer from "@/components/max-width-container";

export const Route = createLazyFileRoute("/auth/register")({
    component: RouteComponent
});

function RouteComponent() {
    return (
        <MaxWidthContainer>
            <div className="flex h-screen flex-col items-center justify-center">
                <Link
                    to="/"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "absolute left-4 top-4 md:left-8 md:top-8"
                    )}
                >
                    <React.Fragment>
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back
                    </React.Fragment>
                </Link>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email to sign in to your account
                        </p>
                    </div>

                    {/* outlet */}
                    <Outlet />

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link to="/auth/login" className="hover:text-brand">
                            Already have an account? <span className="underline">Login</span>
                        </Link>
                    </p>
                </div>
            </div>
        </MaxWidthContainer>
    );
}
