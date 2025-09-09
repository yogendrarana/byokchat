import { useEffect } from "react";
import { Key, Settings2, User2 } from "lucide-react";
import { createFileRoute, Link, Outlet, useLocation, useRouter } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import { authClient } from "@/lib/auth/auth-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import MaxWidthContainer from "@/components/max-width-container";

const routes = [
    { label: "Account", icon: User2, href: "/settings" },
    { label: "Providers", icon: Key, href: "/settings/providers" },
    { label: "Preferences", icon: Settings2, href: "/settings/preferences" }
];

export const Route = createFileRoute("/settings")({
    component: RouteComponent
});

function RouteComponent() {
    const router = useRouter();
    const location = useLocation();
    const { isPending, data } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !data?.user?.id) {
            router.navigate({ to: "/" });
        }
    }, [isPending, data, router]);

    if (isPending || !data?.user?.id) return null;

    const NavContent = (
        <nav className="flex flex-col gap-2 p-4">
            {routes.map((route) => {
                const Icon = route.icon;
                const isActive = location.pathname === route.href;

                return (
                    <Link key={route.href} to={route.href}>
                        <div
                            className={cn(
                                "py-1 flex items-center text-sm",
                                isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                            )}
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            {route.label}
                        </div>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <MaxWidthContainer>
            <div className="min-h-screen border-l border-r flex flex-col">
                <Header />

                <div className="block md:hidden border-b">{NavContent}</div>

                <div className="flex flex-1">
                    <div className="hidden md:block w-56 border-r sticky top-[70px] h-[calc(100vh-70px)]">
                        <ScrollArea className="h-full">{NavContent}</ScrollArea>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-auto h-[calc(100vh-70px)]">
                        <ScrollArea className="h-full">
                            <Outlet />
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </MaxWidthContainer>
    );
}
