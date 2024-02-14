import { SignOptions } from "jsonwebtoken";
import UserClaims from "../types/UserClaims";
import AuthError from "../error/AuthError";
import jwt from "jsonwebtoken";

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
	if (!secret) throw new AuthError({ errorCode: "JWT_SECRET_EMPTY" });
	return jwt.sign(userClaims, secret, options);
}
