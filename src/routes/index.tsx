import { createFileRoute } from "@tanstack/react-router";

import Hero from "@/components/layout/hero";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { getUserThreads } from "./thread/-lib/functions";
import { ThreadsHistory } from "@/components/layout/threads-history";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const res = await getUserThreads();
    if (res.success && res.data) {
      return res.data;
    }
    return [];
  }
});

function App() {
  const threads = Route.useLoaderData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <ThreadsHistory threads={threads.slice(0, 6)} />
      <Footer />
    </div>
  );
}
