import bcrypt from "bcrypt";
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";
import prisma from "@/db";
import AuthError, { AuthErrorCode } from "./AuthError";
import authConfig from "@/config/auth";
import UserClaims from "./types/UserClaims";

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param password - The plain text password to hash.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, authConfig.saltRounds);
}

/**
 * Compares a plain text password with a hashed password.
 *
 * @param password - The plain text password to compare.
 * @param hash - The hashed password to compare against.
 * @returns True if the passwords match, false otherwise.
 */
export async function comparePassword(
	password: string,
	hash: string
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

/**
 * Creates a JWT token based on user claims.
 *
 * @param userClaims - The user claims to encode in the JWT.
 * @param options - Optional signing options.
 * @returns The generated JWT token.
 */
export function createJwtToken(
	userClaims: UserClaims,
	options?: SignOptions
): string {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new AuthError(AuthErrorCode.JWT_SECRET_EMPTY);
	return jwt.sign(userClaims, secret, options);
}

/**
 * Decodes a JWT token and retrieves the payload.
 *
 * @param token - The JWT token to decode.
 * @returns The decoded payload.
 */
export function decodeJwtToken(token: string): JwtPayload | string {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new AuthError(AuthErrorCode.JWT_SECRET_EMPTY);

	try {
		return jwt.verify(token, secret) as JwtPayload;
	} catch (error) {
		throw new AuthError(AuthErrorCode.INVALID_JWT_TOKEN);
	}
}

export async function getUserFromToken(token: string) {
	const decodedToken = decodeJwtToken(token) as {
		id: string;
		iat: number;
	};

	const user = await prisma.user.findFirst({
        include:{
            photoProfile: true,
        },
		where: {
			id: decodedToken.id,
		},
	});

	return user;
}
