"use client"

import UserGreeting from "@/components/dashboard/user-greeting";
import { Button } from "@/components/ui/button";
import { DoorOpenIcon, ListPlusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { animate } from 'animejs';

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreateSessionDialog from "@/components/dialogs/create-session";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import SessionDisplay from "@/components/dashboard/session-display";
import { useRouter, useSearchParams } from "next/navigation";
import ViewSessionDialog from "@/components/dialogs/view-session";
import { QuickActions } from "@/components/dashboard/quick-actions";


export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewSessionId, setViewSessionId] = useState<string | null>(null);
  const [viewSessionOpen, setViewSessionOpen] = useState(false);

  const trpc = useTRPC();
  const { data: sessions, isPending, isError } = useQuery(
    trpc.event.getActive.queryOptions()
  ) as { data: EventWithAttendees[] | undefined; isPending: boolean; isError: boolean };

  const [greetingComplete, setGreetingComplete] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [sessionOpen, setSessionOpen] = useState(false)

  const onGreetingComplete = () => {
    setGreetingComplete(true);

		animate(".main-content", {
      opacity: [0, 1],
      y: [
        { to: ['10px', '0'] },
      ],
      duration: 1000,
      ease: 'out(3)',
      delay: 600,
      begin: () => {
        document.querySelector('.main-content')?.classList.remove('invisible')
      }
		});
  }

  const handleViewDialogClose = (open: boolean) => {
    setViewSessionOpen(open);
    if (!open) {
      router.replace("/dashboard", { scroll: false });
      setViewSessionId(null);
    }
  };

  useEffect(() => {
    const eventId = searchParams.get("event");
    console.log("Search params changed, eventId:", eventId);
    if (eventId) {
      setViewSessionId(eventId);
      setViewSessionOpen(true);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen items-start justify-start bg-[#E0E0E0] font-sans dark:bg-black p-8">
      <Dialog open={viewSessionOpen} onOpenChange={handleViewDialogClose}>
        {
          viewSessionId && (
            <ViewSessionDialog
              sessionId={viewSessionId}
              setSessionOpen={handleViewDialogClose}
            />
          )
        }
      </Dialog>
      <div className="flex flex-col">
        <UserGreeting onComplete={onGreetingComplete} />
        <div className="flex flex-row gap-4 items-center justify-start text-muted-foreground">
          <span className={`text-sm ${greetingComplete ? 'opacity-100' : 'opacity-0'} transition-opacity duration-400`}>
            {
              new Date().toLocaleDateString("en-US", {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })
            }
          </span>
        </div>
      </div>
      <div className="md:h-[6vh] w-full" />
      <div className="main-content invisible flex flex-row gap-16 w-full h-full items-start justify-center">
        <div className="flex-3 w-full h-full flex flex-col gap-8">
          <div className="bg-white p-4 pb-24 rounded-lg shadow-md flex flex-col gap-4">
            Calendar (later :p)
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <span className="text-gray-800 text-2xl font-semibold">Upcoming Sessions</span>
              {
                sessions?.length === 0 ? 
                <Button variant="link" className="ml-auto text-blue-600 text-sm">Explore Sessions</Button>
                :
                <Button variant="link" className="ml-auto text-blue-600 text-sm">View schedule</Button>
              }
            </div>
            {
                sessions?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 shadow-md rounded-lg bg-black/5">
                    <ListPlusIcon className="text-gray-400 size-12" />
                    <span className="text-gray-500">No upcoming sessions</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 grid-rows-2 gap-4">
                    { sessions?.map((session) => (
                      <SessionDisplay key={session.id} session={{...session}} />
                    ))}
                  </div>
                )
              }
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-8">
          <QuickActions />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between">
              <span className="text-gray-700 text-lg font-semibold">Upcoming Tasks</span>
              {
                tasks.length === 0 ? 
                <Button variant="link" className="ml-auto text-blue-600 text-sm">Create New</Button>
                :
                <Button variant="link" className="ml-auto text-blue-600 text-sm">View all</Button>
              }
            </div>
            {
              tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 shadow-md rounded-lg bg-black/5">
                  <ListPlusIcon className="text-gray-400 size-12" />
                  <span className="text-gray-500">No upcoming tasks</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Map through tasks and display them here */}
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
