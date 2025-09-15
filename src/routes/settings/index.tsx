import { toast } from "sonner";
import { useState, useTransition } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Clock, Globe, Settings, Shield, Trash2, User, UserX } from "lucide-react";

import {
  cn,
  formatDate,
  formatExpiryDate,
  getBrowserName,
  getDeviceIcon,
  getDeviceName
} from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import SettingCard from "@/components/settings/setting-card";
import DeleteAccount from "@/components/settings/delete-account";
import SettingHeader from "@/components/settings/setting-header";
import DeactivateAccount from "@/components/settings/deactivate-account";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
  loader: async () => {
    const { data, error } = await authClient.listSessions();
    if (error || !data) return { sessions: [] };

    const activeSessions = data
      .filter((session) => new Date(session.expiresAt) > new Date())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { sessions: activeSessions };
  }
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();
  const { data } = authClient.useSession();
  const [isPending, startTransition] = useTransition();

  const [sessions, setSessions] = useState<any[]>(loaderData.sessions || []);

  if (isPending || !data?.user) return <>Loading ...</>;

  const [profileData, setProfileData] = useState({
    name: data.user.name || "",
    email: data.user.email || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    startTransition(async () => {
      if (!profileData.name || !profileData.email) {
        toast.error("Name and email are required.");
        return;
      }

      const { error } = await authClient.updateUser(profileData);
      if (error) {
        toast.error("Update failed", { description: error.message });
        return;
      }

      toast.success("Profile updated!");
    });
  };

  const handleRevokeSession = async (sessionToken: string) => {
    try {
      startTransition(async () => {
        const res = await authClient.revokeSession({
          token: sessionToken
        });

        if (res.error && !res.data) {
          throw new Error();
        }

        if (res.data && !res.error) {
          setSessions((prevSessions) =>
            prevSessions.filter((session) => session.token !== sessionToken)
          );
          toast.success("Success", {
            description: "Revoked the session successfully"
          });
        }
      });
    } catch (err: any) {
      toast.error("Error", {
        description: err?.message || err?.data?.message || "Error while revoking the token"
      });
    }
  };

  function handlePasswordChange() {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warning("New password and confirmation do not match.");
      return;
    }

    try {
      startTransition(async () => {
        const res = await authClient.changePassword({
          newPassword: passwordData.newPassword,
          currentPassword: passwordData.currentPassword,
          revokeOtherSessions: true
        });

        if (res?.error?.code === "INVALID_PASSWORD") {
          toast.error("Error", {
            description: "Current password is incorrect. Please try again."
          });
          return;
        }

        if (!res.error) {
          toast.success("Success", {
            description: "Password has been changed successfully."
          });
          setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        }
      });
    } catch (err: any) {
      toast.error("Error", {
        description: err?.message || err?.message?.data || "Something went wrong. Please try again."
      });
    }
  }

  return (
    <div>
      <SettingHeader
        title="Profile Settings"
        subtitle="Manage your profile data"
        className="sticky top-0 z-1"
      />

      <div className="p-4 space-y-4">
        <SettingCard title="Profile Setting" subtitle="Change your profile data" Icon={User}>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={data.user.image ?? undefined} />
                <AvatarFallback className="text-lg bg-muted text-foreground">
                  {profileData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
                <p className="text-xs text-muted-foreground">Your avatar visible to public.</p>
              </div>
            </div>

            {/* Name Field */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 ">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <p className="text-sm text-muted-foreground">
                  Your full name, as visible to others.
                </p>
              </div>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="h-10"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 ">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Your email address associated with your account.
                </p>
              </div>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="h-10"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div className="p-4 border-t">
            <Button
              type="button"
              onClick={handleSave}
              disabled={
                isPending ||
                !profileData.name ||
                !profileData.email ||
                (profileData.name === data.user.name && profileData.email === data.user.email)
              }
            >
              {isPending ? (
                <>
                  <Settings className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </SettingCard>

        {/* security settings */}
        <SettingCard title="Password" subtitle="Manage your account password" Icon={Shield}>
          <div className="p-4 space-y-4">
            {/* Row: Current Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-medium">
                  Current Password
                </Label>
                <p className="text-sm text-muted-foreground">Enter your existing password</p>
              </div>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))
                }
                className="h-10"
                placeholder="Current password"
              />
            </div>

            {/* Row: New Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <p className="text-sm text-muted-foreground">Choose a strong new password</p>
              </div>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value
                  }))
                }
                className="h-10"
                placeholder="New password"
              />
            </div>

            {/* Row: Confirm New Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <p className="text-sm text-muted-foreground">Re-enter new password</p>
              </div>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))
                }
                className="h-10"
                placeholder="New password"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-4 border-t flex gap-2">
            <Button
              onClick={handlePasswordChange}
              disabled={
                isPending ||
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword
              }
            >
              {isPending ? (
                <>
                  <Settings className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>Save Changes</>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setPasswordData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: ""
                })
              }
            >
              Reset
            </Button>
          </div>
        </SettingCard>

        {/* sesson settings */}
        <SettingCard
          Icon={Globe}
          title="Session Settings"
          subtitle={`Manage your active login sessions across all devices (${sessions.length} active)`}
        >
          <div className="">
            {sessions.map((session, idx) => {
              const Icon = getDeviceIcon(session.userAgent);

              return (
                <div
                  key={session.id}
                  className={cn("flex flex-col gap-2 p-4", {
                    "border-b": idx !== sessions.length - 1
                  })}
                >
                  {/* Row 1: Device info and Revoke button */}
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />

                    <span className="truncate">
                      {session.userAgent ? getDeviceName(session.userAgent) : "Unknown Device"}
                    </span>

                    <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-full">
                      {session.userAgent ? getBrowserName(session.userAgent) : "Unknown Browser"}
                    </Badge>

                    {data?.session?.token === session.token && (
                      <Badge className="ml-2 text-xs px-2 py-0.5 rounded-full border bg-green-100 text-green-700 border-green-200">
                        Current Session
                      </Badge>
                    )}

                    <div className="flex-1" />

                    {data?.session?.token !== session.token && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeSession(session.token)}
                        className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                      >
                        {isPending ? (
                          <>
                            <Settings className="h-4 w-4 animate-spin" />
                            Revoking...
                          </>
                        ) : (
                          <>Revoke</>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Row 2: IP, Created, Expires */}
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4" />
                      <span>Created {formatDate(session.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="h-4 w-4 inline-block">
                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                          <rect width="16" height="16" rx="2" fill="hsl(var(--muted))" />
                          <path
                            d="M8 4v4l3 1"
                            stroke="hsl(var(--muted-foreground))"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>

                      <span>{formatExpiryDate(session.expiresAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SettingCard>

        {/* Account Management Section */}
        <SettingCard
          Icon={AlertTriangle}
          title="Account Management"
          subtitle="Manage your account status and data"
        >
          <div>
            {/* Deactivate Account */}
            <div className="border-b p-4 bg-background">
              <div className="grid md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserX className="w-4 h-4 text-orange-500" />
                    <h3 className="font-medium text-gray-900">Deactivate Account</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable your account. You can reactivate it anytime by logging back
                    in. Your data will be preserved but your account will be hidden from other
                    users.
                  </p>
                </div>

                <div className="flex items-start justify-end">
                  <DeactivateAccount />
                </div>
              </div>
            </div>

            {/* Delete Account */}
            <div className="p-4 bg-background">
              <div className="grid md:grid-cols-2 gap-4 items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <h3 className="font-medium text-gray-900">Delete Account</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be
                    undone. All your files, settings, and account information will be permanently
                    removed.
                  </p>
                </div>

                <div className="flex items-start justify-end">
                  <DeleteAccount />
                </div>
              </div>
            </div>
          </div>
        </SettingCard>
      </div>
    </div>
  );
}
