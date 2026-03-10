import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { CalendarDaysIcon, ClockIcon } from "lucide-react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"


const CreateSessionDialog = ({setSessionOpen}: {setSessionOpen: (state: boolean) => void}) => {
	const [title, setTitle] = useState("")
	const [date, setDate] = useState<Date | undefined>()
	const [time, setTime] = useState("10:30")
	const [duration, setDuration] = useState(60)
	const [durationErrorToastVis, setDurationErrorToastVis] = useState(false)
	const [location, setLocation] = useState("")

	return (
		<DialogContent showCloseButton={false} className="max-w-[80vw]! w-full p-0 border-0">
			<div className="flex flex-row gap-4">
				<div className="flex-2 flex flex-col p-8 gap-2">
					<DialogTitle className="text-4xl font-garamond font-semibold text-black/80">Create New Session</DialogTitle>
					<DialogDescription className="text-md text-black/60 mb-4">
						Fill in the details to schedule a new session.
					</DialogDescription>
					<FieldGroup>
						<Field>
							<Label>Session Title</Label>
							<Input 
								className="h-12 m-0 bg-gray-50 font-medium" 
								placeholder="e.g., SWOTVAC Study Session" 
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</Field>
						<div className="flex flex-row gap-4">
							<Field className="flex-2">
								<Label>Date</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant="outline" className="h-12 m-0 -translate-y-px bg-gray-50 justify-start">
											<CalendarDaysIcon className="text-gray-500" />
											{date ? date.toDateString() : "Pick a date"}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={date}
											onSelect={setDate}
										/>
									</PopoverContent>
								</Popover>
							</Field>
							<Field className="flex-1">
								<Label>Start Time</Label>
								<InputGroup className="h-12 m-0 bg-gray-50">
									<InputGroupAddon className="flex items-center">
										<ClockIcon className="text-gray-500" />
									</InputGroupAddon>
									<InputGroupInput
										type="time"
										id="time-picker-optional"
										step="300"
										value={time}
										onChange={(e) => setTime(e.target.value)}
										className="appearance-none -translate-y-px [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
									/>
								</InputGroup>
							</Field>
							<Field className="flex-1">
								<Label>Duration</Label>
								<InputGroup className="h-12 m-0 bg-gray-50">
									<InputGroupAddon className="flex items-center">
										<ClockIcon className="text-gray-500" />
									</InputGroupAddon>
									<InputGroupInput
										type="number"
										value={String(duration)}
										onChange={(e) => {
											const duration = Number(e.target.value)
											if (duration <= 240) {
												setDuration(duration)
											}
											else {
												if (!durationErrorToastVis){
													toast.error("Duration cannot exceed 4 hours (240 minutes)")
													setDurationErrorToastVis(true)
													setTimeout(() => setDurationErrorToastVis(false), 2000)
												}
											}
										}}
										className="-translate-y-px"
									/>
									<InputGroupAddon align="inline-end" className="text-xs">
										{
											duration >= 60? `${Math.floor(duration / 60)} hr ${duration - (Math.floor(duration / 60) * 60)} min`
											: `${duration} min`
										}
									</InputGroupAddon>
								</InputGroup>
							</Field>
						</div>
						<Field>
							<Label>Location / Room</Label>
							<Input 
								type="text" 
								className="h-12 m-0 bg-gray-50 font-medium" 
								value={location} 
								onChange={(e) => setLocation(e.target.value)} 
								/>
						</Field>
						<Field>
							<Label>Description</Label>
							<Input 
								type="text" 
								className="h-24 m-0 bg-gray-50 font-medium" 
								placeholder="Additional details about the session (optional)" 
							/>
						</Field>
						<div className="mt-4 w-full flex flex-row items-center justify-end gap-4">
							<Button variant="ghost" className="px-8 hover:bg-red-600/70 hover:text-white" onClick={() => setSessionOpen(false)}>Cancel</Button>
							<Button onClick={() => toast.success("Session created!")}>Create Session</Button>
						</div>
					</FieldGroup>
				</div>
				<div className="flex-1 bg-gray-200 rounded-r-lg">
					<span>Calendar</span>
				</div>
			</div>
		</DialogContent>
	)
}

export default CreateSessionDialog