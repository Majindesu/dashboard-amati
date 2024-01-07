import { z } from "zod";
import { procedure, router } from "..";

const authRouter = router({
    register: procedure.query(() => "hi, register")
})

export default authRouter;
