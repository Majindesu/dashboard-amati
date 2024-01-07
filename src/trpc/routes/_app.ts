import { z } from 'zod';
import { procedure, router } from '..';
import authRouter from './auth';

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
    auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;