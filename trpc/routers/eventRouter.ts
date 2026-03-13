import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { get } from "http";
import z from "zod";

export const eventRouter = createTRPCRouter({
	create: protectedProcedure
		.input(z.object({ 
			title: z.string(),
			description: z.string().optional(),
			location: z.string(), 
			date: z.coerce.date(), 
			startTime: z.string(),
			duration: z.int(),
			capacity: z.int()
		}))
		.mutation(async ({ ctx, input }) => {
			console.log(input.date.toString())

			const [hours, minutes] = input.startTime.split(":").map(Number);
			const startsAt = new Date(input.date);
			startsAt.setHours(hours, minutes, 0, 0);
			const endsAt = new Date(input.date);
			endsAt.setHours(hours + Math.floor(input.duration / 60), minutes + (input.duration % 60), 0, 0);


			const event = await prisma.event.create({
				data: {
					creatorId: ctx.auth.user.id,
					type: "STUDY_SESSION",
					title: input.title,
					description: input.description,
					location: input.location,
					startsAt: startsAt,
					endsAt: endsAt,
					status: "Scheduled",

					source: ctx.auth.user.id,
					source_url: ctx.auth.user.id
				}
			})

			const attendee = await prisma.eventAttendee.create({
				data: {
					eventId: event.id,
					userId: ctx.auth.user.id,
					role: "HOST"
				}
			})

			return attendee;
	}),
	getOne: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
		const event = await prisma.event.findUnique({
			where: {
				id: input.id
			},
			include: {
				attendees: {
					select: {
						userId: true,
						role: true,
						joinedAt: true,
						user: {
							select: {
								name: true,
								image: true,
							}
						}
					}
				}
			}
		})

		return event;
	}),
	getActive: protectedProcedure.query(async ({ ctx }) => {
		const events = await prisma.event.findMany({
			where: {
				attendees: {
					some: {
						userId: ctx.auth.user.id
					}
				},
				status: {
					in: ["Scheduled", "Ongoing"]
				}
			},
			include: {
				attendees: {
					select: {
					userId: true,
					role: true,
					joinedAt: true,
					user: {
						select: {
						name: true,
						image: true,
						}
					}}
				}
			},
			orderBy: {
				startsAt: "asc"
			},
		})

		return events;
	}),
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const events = await prisma.event.findMany({
			where: {
				creatorId: ctx.auth.user.id
			},
			include: {
				attendees: {
					select: {
					userId: true,
					role: true,
					joinedAt: true,
					user: {
						select: {
						name: true,
						image: true,
						}
					}}
				}
			},
			orderBy: {
				startsAt: "asc"
			}
		})
		return events;
	}),
	cancel: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const event = await prisma.event.update({
				where: {
					id: input.id,
					creatorId: ctx.auth.user.id
				},
				data: {
					status: "Cancelled"
				}
			})
			return event;
	}),
	join: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {

			const event = await prisma.event.findUnique({
				where: {
					id: input.id
				},
				include: {
					attendees: true
				}
			})

			if (!event) {
				throw new Error("Event not found");
			}
			
			if (event.status === "Cancelled" || event.status === "Completed") {
				throw new Error("Cannot join an event that is cancelled or completed");
			}

			if ((event.capacity && event.capacity > 0) && event.attendees.length >= (event.capacity || Infinity)) {
				throw new Error("Event is at full capacity");
			}

			if (event.attendees.some(attendee => attendee.userId === ctx.auth.user.id)) {
				throw new Error("User already joined this event");
			}

			const attendee = await prisma.eventAttendee.create({
				data: {
					eventId: input.id,
					userId: ctx.auth.user.id,
					role: "ATTENDEE"
				}
			})
			return attendee;
	}),
})