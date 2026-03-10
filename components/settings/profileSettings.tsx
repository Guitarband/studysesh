"use client"

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { uploadAvatar } from "@/lib/profile-updater";
import { toast } from "sonner";

export default function ProfileSettings() {
	const { data: session, isPending } = authClient.useSession();

	const updateProfilePicture = (file: File) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			uploadAvatar(file).then(() => {
				toast.success("Profile picture updated successfully!")
				
				const img = document.querySelector('img[alt="Profile"]') as HTMLImageElement;
				if (img) img.src = event.target?.result as string;
			}).catch((err) => {
				toast.error("Failed to update profile picture: " + err.message);
			})
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className="w-full max-w-md">
			<h2 className="text-xl font-semibold mb-4">Profile</h2>
			<div className="flex items-center gap-4">
				{
					isPending ? (
						<Skeleton className="w-24 h-24 aspect-square bg-zinc-600 rounded-full" />
					) : (
						<img
							src={session?.user?.image || "/default-avatar.jpg"}
							alt="Profile"
							className="w-24 h-24 aspect-square rounded-full object-cover"
						/>
					)
				}
				<Input
					type="file"
					accept="image/*"
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) {
							updateProfilePicture(file);
						}
					}}
					className="block h-auto text-sm text-gray-500 p-2 cursor-pointer file:cursor-pointer file:mr-4 file:px-2 file:rounded file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-200 file:transition-colors file:duration-300"
				>
				</Input>
			</div>
		</div>
	)
}