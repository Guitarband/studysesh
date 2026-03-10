"use client"

import ProfileSettings from "@/components/settings/profileSettings";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Settings() {
	const [selectedTab, setSelectedTab] = useState("account");

	return (
		<div className="flex flex-col gap-6 min-h-screen items-start justify-start bg-[#E0E0E0] font-sans dark:bg-black p-8">
			<h1 className="text-3xl font-bold">Settings</h1>
			<div className="flex flex-row gap-4">
				<Button onClick={() => setSelectedTab("account")} variant={selectedTab === "account" ? "default" : "ghost"} size="lg">Account</Button>
				<Button onClick={() => setSelectedTab("profile")} variant={selectedTab === "profile" ? "default" : "ghost"} size="lg">Profile</Button>
				<Button onClick={() => setSelectedTab("notifications")} variant={selectedTab === "notifications" ? "default" : "ghost"} size="lg">Notifications</Button>
				<Button onClick={() => setSelectedTab("privacy")} variant={selectedTab === "privacy" ? "default" : "ghost"} size="lg">Privacy</Button>
			</div>
			{
				selectedTab === "account" && <div className="mt-8">Account settings content goes here.</div>
			}
			{
				selectedTab === "profile" && <ProfileSettings />
			}
			{
				selectedTab === "notifications" && <div className="mt-8">Notifications settings content goes here.</div>
			}
			{
				selectedTab === "privacy" && <div className="mt-8">Privacy settings content goes here.</div>
			}
		</div>
	);
}
