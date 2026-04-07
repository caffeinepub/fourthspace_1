import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Save, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "../components/ThemeToggle";
import { useBackend } from "../hooks/useBackend";
import { getTenantId, useWorkspace } from "../hooks/useWorkspace";
import { Role } from "../types";

export default function SettingsPage() {
  const { userProfile } = useWorkspace();
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();

  const [displayName, setDisplayName] = useState(
    userProfile?.displayName ?? "",
  );
  const [email, setEmail] = useState(userProfile?.email ?? "");

  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor || !userProfile) throw new Error("Not connected");
      return actor.upsertProfile(tenantId, {
        displayName,
        email,
        role: userProfile.role,
        workspaceId: userProfile.workspaceId,
      });
    },
    onSuccess: (result) => {
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        toast.success("Profile updated!");
      } else toast.error(result.err);
    },
    onError: () => toast.error("Failed to update profile"),
  });

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground font-display text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">
                {displayName || "Your Name"}
              </p>
              <p className="text-sm text-muted-foreground">
                {email || "your@email.com"}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Display Name</Label>
              <Input
                id="settings-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                data-ocid="settings-name-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="settings-email"
                  type="email"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-ocid="settings-email-input"
                />
              </div>
            </div>
          </div>
          {userProfile && (
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {userProfile.role}
                </span>
              </div>
            </div>
          )}
          <Button
            onClick={() => saveProfile()}
            disabled={!displayName || isPending}
            data-ocid="settings-save-btn"
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">
                Switch between light and dark mode
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                role: Role.Admin,
                desc: "Full access to all features, user management, and admin panel.",
              },
              {
                role: Role.Manager,
                desc: "Can manage projects, payroll, and view analytics.",
              },
              {
                role: Role.TeamMember,
                desc: "Access to notes, tasks, chat, and calendar.",
              },
            ].map((r) => (
              <div key={r.role} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {r.role}
                  </p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
