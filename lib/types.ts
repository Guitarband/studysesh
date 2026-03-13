type EventAttendee = {
  userId: string;
  role: string;
  joinedAt: Date;
  user: {
    name: string;
    image: string | null;
  };
};

type EventWithAttendees = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  location: string;
  startsAt: Date;
  endsAt: Date;
  capacity: number | null;
  isPublic: boolean;
  isOnline: boolean;
  status: string;
  attendees: EventAttendee[];

  creatorId: string | null;
};