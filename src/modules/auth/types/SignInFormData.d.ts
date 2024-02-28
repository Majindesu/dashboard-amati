/**
 * Defines the structure for sign-in form data.
 * 
 * This interface is utilized to type-check the data received from the sign-in form, ensuring that it contains
 * both an `email` and a `password` field of type `string`. The `email` field represents the user's email address,
 * and the `password` field represents the user's password. Both fields are required for the sign-in process.
 */
export default interface SignInFormData {
    /**
     * The user's email address.
     * Must be a valid email format.
     */
    email: string;

    /**
     * The user's password.
     * There are no specific constraints defined here for the password's format or strength, but it is expected
     * to comply with the application's password policy.
     */
    password: string;
}
