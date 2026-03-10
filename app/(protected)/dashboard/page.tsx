"use client"

import UserGreeting from "@/components/dashboard/user-greeting";
import { Button } from "@/components/ui/button";
import { DoorOpenIcon, ListPlusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { animate, splitText, stagger } from 'animejs';
import { createTimeline } from 'animejs';

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreateSessionDialog from "@/components/dialogs/create-session";

export default function Dashboard() {
  const [greetingComplete, setGreetingComplete] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [sessionOpen, setSessionOpen] = useState(false)

  const onGreetingComplete = () => {
    setGreetingComplete(true);

		animate(".main-content", {
      opacity: [0, 1],
      y: [
        { to: ['10px', '0'] },
      ],
      duration: 800,
      ease: 'out(3)',
      delay: 500,
      begin: () => {
        document.querySelector('.main-content')?.classList.remove('invisible')
      }
		});
  }

  return (
    <div className="flex flex-col min-h-screen items-start justify-start bg-[#E0E0E0] font-sans dark:bg-black p-8">
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
      <div className="md:h-[8vh] w-full" />
      <div className="main-content invisible flex flex-row gap-16 w-full h-full items-start justify-center">
        <div className="flex-3 w-full h-full flex flex-col gap-8">
          <div className="bg-white p-4 pb-24 rounded-lg shadow-md flex flex-col gap-4">
            Calendar (later :p)
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <span className="text-gray-800 text-2xl font-semibold">Upcoming Sessions</span>
              {
                sessions.length === 0 ? 
                <Button variant="link" className="ml-auto text-blue-600 text-sm">Explore Sessions</Button>
                :
                <Button variant="link" className="ml-auto text-blue-600 text-sm">View schedule</Button>
              }
            </div>
            {
                sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 shadow-md rounded-lg bg-black/5">
                    <ListPlusIcon className="text-gray-400 size-12" />
                    <span className="text-gray-500">No upcoming sessions</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {/* Map through sessions and display them here */}
                  </div>
                )
              }
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-8">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-4">
            <span className="text-gray-700 font-semibold">Quick Actions</span>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary">
                <ListPlusIcon className="mr-2" />
                New task
              </Button>
              <Dialog open={sessionOpen} onOpenChange={setSessionOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" onClick={() => setSessionOpen(true)}>
                    <PlusIcon className="mr-2" />
                    New session
                  </Button>
                </DialogTrigger>
                <CreateSessionDialog setSessionOpen={setSessionOpen} />
              </Dialog>
              <Button variant="secondary">
                <DoorOpenIcon className="mr-2" />
                Book room
              </Button>
            </div>
          </div>
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
