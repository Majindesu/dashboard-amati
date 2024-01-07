import CredentialsProvider from "next-auth/providers/credentials"

const credential = CredentialsProvider({
    name: "email-password",
    credentials: {
        email: {
            label: "Email",
            type: "text",
        },
        password: {
            label: "password",
            type: "password"
        }
    },
    authorize: async (credentials) => {
        // Ensure credentials are defined and properly structured
        if (credentials && typeof credentials.email === 'string' && typeof credentials.password === 'string') {
            // Implement your authentication logic here
            // For the sake of example, we're using a static user object
            const user = { id: "1", name: "John Doe", email: "john.doe@example.com" };

            // Add your logic to validate the user here
            // ...

            if (user){
                return user;
            }
            console.log("here inside")
        }
        console.log("here outside")
        return null;
    },
})

export default credential;