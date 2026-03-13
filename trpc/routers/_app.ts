import { createTRPCRouter } from '../init';
import { eventRouter } from './eventRouter';

export const appRouter = createTRPCRouter({
	event: eventRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;