"use client"

import { Button } from "@/components/ui/button";
import { DoorOpenIcon, ListPlusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreateSessionDialog from "@/components/dialogs/create-session";

export const QuickActions = () => {
	const [createSessionDialogOpen, setCreateSessionDialogOpen] = useState(false)

	return (
		<div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">
			<span className="text-gray-700 font-semibold">Quick Actions</span>
			<div className="grid grid-cols-2 gap-2">
				<Button variant="secondary">
				<ListPlusIcon className="mr-2" />
				New task
				</Button>
				<Dialog open={createSessionDialogOpen} onOpenChange={setCreateSessionDialogOpen}>
				<DialogTrigger asChild>
					<Button variant="secondary" onClick={() => setCreateSessionDialogOpen(true)}>
					<PlusIcon className="mr-2" />
					New session
					</Button>
				</DialogTrigger>
				<CreateSessionDialog setSessionOpen={setCreateSessionDialogOpen} />
				</Dialog>
				<Button variant="secondary">
				<DoorOpenIcon className="mr-2" />
				Book room
				</Button>
			</div>
		</div>
	)
}