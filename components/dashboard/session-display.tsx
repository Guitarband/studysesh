import { ClockIcon, MapPinIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ViewSessionDialog from "../dialogs/view-session";
import { Avatar, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";


export default function SessionDisplay({ session }: { session: EventWithAttendees }) {
	const [sessionOpen, setSessionOpen] = useState(false)

	return(
		<Dialog open={sessionOpen} onOpenChange={setSessionOpen}>
			<DialogTrigger 
				className="bg-white p-4 flex flex-col gap-4 justify-between rounded-lg shadow-md" 
				onClick={() => setSessionOpen(true)}
			>
				<div className="flex flex-col items-start w-full gap-1">
					<div className="flex flex-row items-center w-full justify-between">
						<span className="text-gray-800 font-medium text-lg">{session.title}</span>
						{(() => {
							const today = new Date();
							const sessionDate = new Date(session.startsAt);
							// Remove time for comparison
							today.setHours(0,0,0,0);
							sessionDate.setHours(0,0,0,0);
							const diffDays = Math.floor((sessionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
							if (diffDays === 0) return <span className="text-blue-500 text-sm">Today</span>;
							if (diffDays === 1) return <span className="text-gray-800 text-sm">Tomorrow</span>;
							return <span className="text-gray-500 text-sm">{`${sessionDate.getDate()} ${sessionDate.toLocaleString('en-US', { month: 'short' })}`}</span>;
						})()}
					</div>
					<div className="text-gray-600 italic text-sm">{session.description}</div>
				</div>
				<div className="flex flex-col gap-1">
					<AvatarGroup className="flex flex-row items-center justify-start size-6 mb-1">
						{
							session.attendees.length > 0 ? (
								<>
									{session.attendees.slice(0, 3).map((attendee) => (
										<Avatar key={attendee.userId} className="size-6">
											<AvatarImage
												src={attendee.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(attendee.user.name)}`} 
												alt={attendee.user.name} 
												className="w-6 h-6 aspect-square object-cover rounded-full border-2 border-white -ml-2 first:ml-0"
											/>
										</Avatar>
									))}
									{
										session.attendees.length > 3 ? 
										<AvatarGroupCount>
										{`+${session.attendees.length - 3}`}
										</AvatarGroupCount>
										 : null
									}
								</>
							) : null
						}
					</AvatarGroup>
					<div className="text-xs flex flex-row items-center justify-baseline">
						<ClockIcon className="text-gray-500 inline mr-2 size-4" />
						<span className="text-gray-500">{new Date(session.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
						<span className="text-gray-500 mx-1">-</span>
						<span className="text-gray-500">{new Date(session.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
					</div>
					<div className="text-xs flex flex-row items-center justify-baseline">
						<MapPinIcon className="text-gray-500 inline mr-2 size-4" />
						<span className="text-gray-500">{session.location}</span>
					</div>
				</div>
			</DialogTrigger>
			<ViewSessionDialog sessionId={session.id} setSessionOpen={setSessionOpen} />
		</Dialog>
	)
}