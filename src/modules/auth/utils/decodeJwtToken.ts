import jwt, { JwtPayload } from "jsonwebtoken";
import AuthError from "../error/AuthError";

/**
 * Decodes a JWT token and retrieves the payload.
 *
 * @param token - The JWT token to decode.
 * @returns The decoded payload.
 */
function decodeJwtToken(token: string): JwtPayload | string {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new AuthError({ errorCode: "JWT_SECRET_NOT_EMPTY" });

	try {
		return jwt.verify(token, secret) as JwtPayload;
	} catch (error) {
		throw new AuthError({ errorCode: "INVALID_JWT_TOKEN" });
	}
}

export default decodeJwtToken;
