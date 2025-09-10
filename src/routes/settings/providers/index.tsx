import { Key } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { getProviderKeys } from "./-lib/functions";
import { MODEL_PROVIDERS } from "@/lib/model-providers";
import SettingCard from "@/components/settings/setting-card";
import SettingHeader from "@/components/settings/setting-header";
import { BYOKProviderCard } from "./-components/byok-provider-card";

export const Route = createFileRoute("/settings/providers/")({
  component: RouteComponent,
  loader: async () => {
    const { success, data } = await getProviderKeys();
    return success ? data : null;
  }
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();

  return (
    <div>
      <SettingHeader
        title="Provider Settings"
        subtitle="Manage your provider keys"
        className="sticky top-0"
      />

      <div className="p-4 space-y-4">
        <SettingCard title="AI Providers" subtitle="Bring your own API keys" Icon={Key}>
          <div className="p-4 space-y-4">
            {MODEL_PROVIDERS.map((provider) => (
              <BYOKProviderCard
                key={provider.id}
                provider={provider}
                keys={loaderData?.[provider.id] || []}
              />
            ))}
          </div>
        </SettingCard>
      </div>
    </div>
  );
}
