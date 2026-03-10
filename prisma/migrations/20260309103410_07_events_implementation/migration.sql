-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('STUDY_SESSION', 'CAMPUS_SOCIAL', 'UNI_ACADEMIC', 'CUSTOM');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('Scheduled', 'Ongoing', 'Cancelled', 'Completed');

-- CreateEnum
CREATE TYPE "AttendeeRole" AS ENUM ('HOST', 'CO_HOST', 'ATTENDEE', 'INVITED', 'WAITLIST');

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "title" TEXT NOT NULL,
    "creatorId" TEXT,
    "universityId" TEXT,
    "unitId" TEXT,
    "roomId" TEXT,
    "location" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "status" "EventStatus" NOT NULL,
    "tags" JSONB,
    "meta" JSONB,
    "source" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_attendee" (
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AttendeeRole" NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "event_attendee_eventId_idx" ON "event_attendee"("eventId");

-- CreateIndex
CREATE INDEX "event_attendee_userId_idx" ON "event_attendee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendee_eventId_userId_key" ON "event_attendee"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
