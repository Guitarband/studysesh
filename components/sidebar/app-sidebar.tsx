"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarRail,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar"

import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useEffect, useState } from "react";

// https://dribbble.com/tags/sidebar
export function AppSidebar() {
	const [userAvatarUrl, setUserAvatarUrl] = useState<string>("/default-avatar.jpg");
	const { state } = useSidebar();

	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (session?.user?.image) {
			setUserAvatarUrl(session.user.image);
		}
	}, [session?.user?.image])

	return (
		<Sidebar collapsible="icon" className="bg-transparent">
			<SidebarHeader>
				<SidebarMenuItem className="flex items-center justify-between gap-2">
					{ state != "collapsed" ? <span className="text-sm font-medium">App Name</span> : null}
					<SidebarTrigger />
				</SidebarMenuItem>
			</SidebarHeader>
			<SidebarContent></SidebarContent>
			<SidebarFooter>
				<SidebarMenuItem>
					<SidebarMenuButton className="group-data-[collapsible=icon]:p-1! justify-center" asChild>
						<a href="/profile">
							<img
								src={userAvatarUrl}
								alt="Profile"
								width={90}
								height={90}
								className="w-full h-full border border-[#8CB369] aspect-square rounded-full object-cover"
							/>
						</a>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton asChild>
						<a href="/settings">
							<IoSettingsOutline className="size-5" />
							<span>Settings</span>
						</a>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<SidebarMenuItem>
					<SidebarMenuButton asChild onClick={() => authClient.signOut({
						fetchOptions: {
							onSuccess: () => {
								window.location.href = "/"
							}
						}
					})}>
						<div className="cursor-pointer">
							<TbLogout className="size-5" />
							<span>Logout</span>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}