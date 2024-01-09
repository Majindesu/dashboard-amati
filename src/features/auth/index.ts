import NextAuth from "next-auth";
import emailPasswordProvider from "./providers/emailPasswordProvider";
import prisma from "@/db";
import { PrismaAdapter } from "@auth/prisma-adapter";

const nextAuth = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },
    providers:[
        emailPasswordProvider
    ],
    callbacks: {
        // signIn: ({ user, account, profile, email, credentials}) => {
        //     console.log("sign in callback")
        //     console.table({user, account, profile, email, credentials})
        //     return true;
        // },
        // session: async({session, user, token}) => {
        //     if (session.user){
        //         session.user.id = token.userId as string;
        //     }
        //     return session;
        // },
        // jwt: async ({ token, user, account, profile }) => {
        //     if(account && account.type === "credentials") {
        //         token.userId = account.providerAccountId; // this is Id that coming from authorize() callback 
        //     }
        //     return token
        // },
        // redirect: async ({url, baseUrl}) => {
        //     console.log("redirect callback called")
        //     console.table({url, baseUrl})
        //     return url
        // }
    },
    pages: {
        signIn: "/login"
    }
});

export const {
    signIn,
    signOut,
    handlers: { GET, POST},
    auth
} = nextAuth;

export default nextAuth;