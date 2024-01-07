import NextAuth from "next-auth";
import emailPasswordProvider from "./providers/emailPasswordProvider";

const nextAuth = NextAuth({
    session: {
        strategy: "jwt"
    },
    providers:[
        emailPasswordProvider
    ],
    callbacks: {
        session: async({session, user, token}) => {
            if (session.user){
                session.user.id = token.userId as string;
            }
            return session;
        },
        jwt: async ({ token, user, account, profile }) => {
            if(account && account.type === "credentials") {
                token.userId = account.providerAccountId; // this is Id that coming from authorize() callback 
            }
            return token
        }
    },
    pages: {
        signIn: "/login"
    }
})

export const {
    signIn,
    signOut,
    handlers: { GET, POST},
    auth
} = nextAuth;

export default nextAuth;