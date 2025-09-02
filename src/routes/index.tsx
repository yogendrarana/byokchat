import { createFileRoute } from "@tanstack/react-router";

import Hero from "@/components/layout/hero";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import MaxWidthContainer from "@/components/max-width-container";

export const Route = createFileRoute("/")({
    component: App
});

function App() {
    return (
        <div className="flex bg-muted/30">
            <MaxWidthContainer>
                <div className="h-screen flex flex-col justify-between border-l border-r">
                    <Header />
                    <Hero />
                    <Footer className="border-t" />
                </div>
            </MaxWidthContainer>
        </div>
    );
}
