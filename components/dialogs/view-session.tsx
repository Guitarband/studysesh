import {
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { Separator } from "@/components/ui/separator"
import { MapPinIcon } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

interface ViewSessionDialogProps {
  sessionId: string
  setSessionOpen: (state: boolean) => void
}

const ViewSessionDialog = ({ sessionId, setSessionOpen }: ViewSessionDialogProps) => {
  const { data: userSession, isPending: userIsPending } = authClient.useSession();

  const trpc = useTRPC()
  const { data: session, isPending, isError } = useQuery(
    trpc.event.getOne.queryOptions({ id: sessionId })
  ) as { data: EventWithAttendees | undefined; isPending: boolean; isError: boolean }

  const cancelSession = useMutation({
		...trpc.event.cancel.mutationOptions(),
		onSuccess: () => {
			toast.success("Session cancelled!");
			setSessionOpen(false);
		},
		onError: (error) => {
			toast.error("Failed to cancel session: " + error.message);
		},
	});

  const joinSession = useMutation({
		...trpc.event.join.mutationOptions(),
		onSuccess: () => {
			toast.success("Session cancelled!");
			setSessionOpen(false);
		},
		onError: (error) => {
			toast.error("Failed to cancel session: " + error.message);
		},
	});

  if (isPending) {
    return (
      <DialogContent className="max-w-[80vw]! w-full p-0 border-0 gap-0">
        <DialogTitle className="text-xl px-4 py-2 font-medium text-black/80">Loading Session...</DialogTitle>
        <Separator />
        <div className="p-4 text-lg text-black/60">Loading...</div>
      </DialogContent>
    )
  }

  if (isError || !session) {
    return (
      <DialogContent className="max-w-[80vw]! w-full p-0 border-0 gap-0">
        <DialogTitle className="text-xl px-4 py-2 font-medium text-black/80">Session Not Found</DialogTitle>
        <Separator />
        <div className="p-4 text-lg text-black/60">Could not load session.</div>
        <div className="mt-4 w-full flex flex-row items-center justify-end gap-4">
          <Button variant="ghost" className="px-8 hover:bg-red-600/70 hover:text-white" onClick={() => setSessionOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    )
  }

  if (!session) {
    return null;
  }

  const userInAtendees = () => {
    return session.attendees.some(attendee => attendee.userId === userSession?.user.id)
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/dashboard?event=${session.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied!");
  };
  
  return (
    <DialogContent className="max-w-[80vw]! min-h-[60vh] w-full p-0 border-0 gap-0">
      <div className="flex flex-row">
        <div className="flex-2 flex flex-col items-baseline justify-between p-6">
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div>
                <span className="inline-block w-auto font-semibold text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-full mb-2 capitalize">
                  {session.type.toLowerCase().replace("_", " ")}
                </span>
              </div>
              <DialogTitle className="text-4xl font-garamond font-medium">{session.title}</DialogTitle>
              <div className="flex flex-row items-center justify-baseline">
                <MapPinIcon className="text-gray-500 inline mr-2 size-4" />
                <span className="text-md text-black/60 pb-1">{session.location}</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 grid-rows-1 gap-4">
                {/* Date */}
                <div className="flex flex-col gap-1 bg-gray-100 rounded-lg p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Date</p>
                  <div className="flex flex-row items-center justify-baseline gap-2">
                    <p className="text-sm font-medium text-gray-700">
                      {
                        new Intl.DateTimeFormat('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }).format(new Date(session.startsAt))
                      }
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex flex-col gap-1 bg-gray-100 rounded-lg p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Time</p>
                  <div className="flex flex-row items-center justify-baseline gap-2">
                    <p className="text-sm font-medium text-gray-700">
                      {
                        new Intl.DateTimeFormat('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                        }).format(new Date(session.startsAt))
                      }
                    </p>
                    <p>-</p>
                    <p className="text-sm font-medium text-gray-700">
                      {
                        new Intl.DateTimeFormat('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                        }).format(new Date(session.endsAt))
                      }
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1 bg-gray-100 rounded-lg p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Status</p>
                  <p className="text-sm font-medium text-gray-700">{session.status}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{session.description || "No description provided."}</p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row-reverse items-center justify-between">
            {
              userSession?.user.id === session.creatorId ? 
              (
                <>
                  <Button variant="secondary">
                    Edit Details
                  </Button>
                  <Button variant="destructive" onClick={() => cancelSession.mutate({ id: session.id })}>
                    Cancel Session
                  </Button>
                </>
              ) :
              (
                <>
                  <Button variant="default" onClick={() => joinSession.mutate({ id: session.id })}>
                    Join Session
                  </Button>
                </>
              )
            }
          </div>
        </div>
        <Separator orientation="vertical" />
        <div className="flex-1 p-5 flex flex-col items-start justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">
              Attendees ({session.attendees.length})
            </p>
            <div className="flex flex-col gap-3 flex-1">
              {session.attendees.map((attendee) => (
                <div key={attendee.userId} className="flex flex-row items-center gap-3">
                  <img
                    src={attendee.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(attendee.user.name)}`}
                    alt={attendee.user.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <p className="text-xs font-medium text-gray-800">{attendee.user.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{attendee.role.toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {
            userInAtendees() &&
            <div className="w-full">
              <Button className="w-full" onClick={() => handleCopyLink()}>Invite</Button>
            </div>
          }        
        </div>
      </div>
    </DialogContent>
  )
}

export default ViewSessionDialog
