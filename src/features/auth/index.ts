import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"

const auth = NextAuth({
    providers:[
        CredentialsProvider({
            name: "Email/Password",
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
            authorize: async (credentials, req) => {

                const user = { id: "1", name: "John Doe", email: "john.doe@example.com" };

                if (user){
                    return user;
                }
                return null;
            },
        })
    ]
})

export default auth;
