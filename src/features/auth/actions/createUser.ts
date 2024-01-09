import prisma from "@/db"
import AuthError, { AuthErrorCode } from "../AuthError";
import { hashPassword } from "../authUtils";

interface CreateUserSchema {
    name: string,
    email: string,
    plainPassword: string,
}

const register = async (inputData: CreateUserSchema) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: inputData.email
        }
    });

    if (existingUser) throw new AuthError(AuthErrorCode.USER_ALREADY_EXISTS, 419, "Email already exists")

    const user = await prisma.user.create({
        data: {
            name: inputData.name,
            email: inputData.email,
            passwordHash: await hashPassword(inputData.plainPassword)
        }
    });

    return user;
}

export default register;
