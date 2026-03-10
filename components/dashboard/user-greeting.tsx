"use client"

import { authClient } from "@/lib/auth-client";
import { animate, splitText, stagger } from 'animejs';
import { useEffect, useRef, useState } from "react";

const greetings = ['Welcome back', 'Hello', 'Good to see you', 'What\'s up']

export default function UserGreeting({ onComplete }: { onComplete?: () => void }) {
	const { data: session, isPending } = authClient.useSession();
	const [selectedGreeting, setSelectedGreeting] = useState<string>();
	const greetingSplit = useRef<any>(null);
  	const usernameSplit = useRef<any>(null);

	useEffect(() => {
		if (Math.random() < 0.3) {
			setSelectedGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
		} else {
			const hour = new Date().getHours();
			if (hour < 12 && hour >= 7) {
				setSelectedGreeting("Good morning");
			} else if (hour >= 12 && hour < 15) {
				setSelectedGreeting("Good afternoon");
			} else {
				setSelectedGreeting("Good evening");
			}
		}
	}, [])

	// Animate greeting
	useEffect(() => {
		if (!selectedGreeting) return;

		greetingSplit.current?.revert();

		greetingSplit.current = splitText(".greeting", {
		words: { wrap: "clip" },
		});
		
		animate(greetingSplit.current.words, {
		opacity: [0, 1],
		y: [
			{ to: ['120%', '0%'] },
		],
		duration: 750,
		ease: 'out(3)',
		delay: stagger(200),
		begin: () => {
			document.querySelector('.greeting')?.classList.remove('invisible')
		}
		});
	}, [selectedGreeting]);

	// Animate username when it appears
	useEffect(() => {
		if (!session?.user?.name) return;

		usernameSplit.current?.revert();

		usernameSplit.current = splitText(".username", {
		chars: { wrap: "clip" },
		});

		animate(usernameSplit.current.chars, {
		opacity: [0, 1],
		y: [
			{ to: ['120%', '0%'] },
		],
		duration: 750,
		ease: 'out(3)',
		delay: stagger(100, { start: 400 }),
		begin: () => {
			document.querySelector('.username')?.classList.remove('invisible')
		},
		}).then(() => {
			if (onComplete) onComplete();
		});
	}, [session?.user?.name]);

	return (
		<div className="flex flex-row text-4xl text-[#688a49] font-garamond">
			<span className="greeting invisible leading-[1.4]">
				{selectedGreeting},&nbsp;
			</span>
			<span className="username invisible leading-[1.4]">{session?.user.name}!</span>
		</div>
	);
}
