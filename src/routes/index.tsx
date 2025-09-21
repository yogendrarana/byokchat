import { createFileRoute } from "@tanstack/react-router";

import Hero from "@/components/layout/hero";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { getUserChats } from "./chat/-lib/functions";
import { ChatHistory } from "@/components/layout/chat-history";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const res = await getUserChats();
    if (res.success && res.data) {
      return res.data;
    }
    return [];
  }
});

function App() {
  const chats = Route.useLoaderData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <ChatHistory chats={chats.slice(0, 6)} />
      <Footer />
    </div>
  );
}
