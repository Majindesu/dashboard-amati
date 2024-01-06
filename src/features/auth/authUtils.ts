export async function validateUser(email: string, password: string) {
    // Your user validation logic here...
    // If valid, return user object; otherwise, return null.
    // This is a placeholder function, implement your own validation logic.
    if (email === "user@example.com" && password === "password") {
        return { id: 1, name: "John Doe", email: "user@example.com" };
    } else {
        return null;
    }
}
