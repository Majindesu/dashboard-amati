import jwt from "jsonwebtoken";
import appEnv from "../appEnv";

// Environment variables for secrets, defaulting to a random secret if not set.
const accessTokenSecret = appEnv.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = appEnv.REFRESH_TOKEN_SECRET;

// Algorithm to be used for JWT encoding.
const algorithm: jwt.Algorithm = "HS256";

// Expiry settings for tokens. 'null' signifies no expiry.
export const accessTokenExpiry: number | string | null = null;
export const refreshTokenExpiry: number | string | null = "30d";

// Interfaces to describe the payload structure for access and refresh tokens.
interface AccessTokenPayload {
	uid: string;
}

interface RefreshTokenPayload {
	uid: string;
}

/**
 * Generates a JSON Web Token (JWT) for access control using a specified payload.
 *
 * @param payload - The payload containing user-specific data for the token.
 * @returns A promise that resolves to the generated JWT string.
 */
export const generateAccessToken = async (payload: AccessTokenPayload) => {
	const token = jwt.sign(payload, accessTokenSecret, {
		algorithm,
		...(accessTokenExpiry ? { expiresIn: accessTokenExpiry } : {}),
	});
	return token;
};

/**
 * Generates a JSON Web Token (JWT) for refresh purposes using a specified payload.
 *
 * @param payload - The payload containing user-specific data for the token.
 * @returns A promise that resolves to the generated JWT string.
 */
export const generateRefreshToken = async (payload: RefreshTokenPayload) => {
	const token = jwt.sign(payload, refreshTokenSecret, {
		algorithm,
		...(refreshTokenExpiry ? { expiresIn: refreshTokenExpiry } : {}),
	});
	return token;
};

/**
 * Verifies a given access token and decodes the payload if the token is valid.
 *
 * @param token - The JWT string to verify.
 * @returns A promise that resolves to the decoded payload or null if verification fails.
 */
export const verifyAccessToken = async (token: string) => {
	try {
		const payload = jwt.verify(
			token,
			accessTokenSecret
		) as AccessTokenPayload;
		return payload;
	} catch {
		return null;
	}
};

/**
 * Verifies a given refresh token and decodes the payload if the token is valid.
 *
 * @param token - The JWT string to verify.
 * @returns A promise that resolves to the decoded payload or null if verification fails.
 */
export const verifyRefreshToken = async (token: string) => {
	try {
		const payload = jwt.verify(
			token,
			refreshTokenSecret
		) as RefreshTokenPayload;
		return payload;
	} catch {
		return null;
	}
};
