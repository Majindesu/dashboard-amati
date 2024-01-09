import prisma from "@/db";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import AuthError, { AuthErrorCode } from "./AuthError";
import authConfig from "@/config/auth";

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
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}