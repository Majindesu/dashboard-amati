import { z } from "zod";
import { procedure, router } from "..";
import prisma from "@/db";
import createUser from "@/features/auth/actions/createUser";
import { AuthError } from "next-auth";
import { TRPCError } from "@trpc/server";

const authRouter = router({
    register: procedure
        .input(
            z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string(),
                passwordConfirmation: z.string(),
            })
            .refine(data => data.password === data.passwordConfirmation, {
                message: "Password don't match",
                path: ["passwordConfirmation"]
            })
        )
        .mutation(async ({input}) => {
            try {
                const user = await createUser({
                    email: input.email,
                    name: input.name,
                    plainPassword: input.password
                })

                return "ok"
            } catch (e: unknown) {
                if (e instanceof AuthError){
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: e.message,
                        cause: e
                    })
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR"
                })
            }
        })
})

export default authRouter;
