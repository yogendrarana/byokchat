import { toast } from "sonner";
import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Palette, Bell, Moon, Sun } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import SettingCard from "@/components/settings/setting-card";

import { authClient } from "@/lib/auth/auth-client";
import SettingHeader from "@/components/settings/setting-header";
import { getUserPreference, updateMode } from "./-lib/functions";

export const Route = createFileRoute("/settings/preferences/")({
  component: RouteComponent,
  loader: async () => {
    const { data, success } = await getUserPreference();
    return success ? data : null;
  }
});

function RouteComponent() {
  const preference = Route.useLoaderData();
  const { data, isPending } = authClient.useSession();

  const [theme, setTheme] = useState(preference?.appearanceSettings?.theme || "light");

  const handleUpdateMode = useCallback(async (theme: "dark" | "light") => {
    if (!data || isPending) return;

    try {
      const { success, message } = await updateMode({
        data: {
          userId: data.user.id,
          theme
        }
      });

      if (success) {
        toast.success("Success!", { description: message });
        setTheme(theme);
      }
    } catch (err: any) {
      toast.error("Error!", {
        description: err?.message || err?.result?.message
      });
    }
  }, []);

  return (
    <div>
      <SettingHeader
        title="Preference Settings"
        subtitle="Manage your preference data"
        className="sticky top-0"
      />

      <div className="p-4 space-y-4">
        <SettingCard title="Appearance" subtitle="Customize how the app looks" Icon={Palette}>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>

              <div className="flex rounded-md bg-muted p-1 relative">
                {/* Background slider */}
                <div
                  className={`absolute top-1 h-8 w-8 bg-background rounded-md shadow-sm transition-transform duration-200 ease-in-out ${
                    theme === "dark" ? "translate-x-8" : "translate-x-0"
                  }`}
                />

                {/* Light mode button */}
                <Button
                  variant="ghost"
                  onClick={() => handleUpdateMode("light")}
                  className={`size-8 hover:bg-transparent relative z-10 rounded-md transition-colors duration-200 ${
                    theme === "light"
                      ? "text-foreground hover:text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sun className="h-4 w-4" />
                </Button>

                {/* Dark mode button */}
                <Button
                  variant="ghost"
                  onClick={() => handleUpdateMode("dark")}
                  className={`size-8 hover:bg-transparent relative z-10 rounded-md transition-colors duration-200 ${
                    theme === "dark"
                      ? "text-foreground hover:text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* Notifications */}
        <SettingCard
          title="Notifications"
          subtitle="Control how you receive notifications"
          Icon={Bell}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">Show notifications in your browser</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Share Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  When someone shares a video with you
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </SettingCard>
      </div>
    </div>
  );
}
