import bcrypt from "bcrypt";
import authConfig from "../authConfig";

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param password - The plain text password to hash.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, authConfig.saltRounds);
}

export default hashPassword;
