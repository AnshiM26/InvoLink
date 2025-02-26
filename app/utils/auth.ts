import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Sendgrid from "next-auth/providers/sendgrid";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
adapter:PrismaAdapter(prisma),
  providers: [
    Sendgrid({
      apiKey: process.env.AUTH_SENDGRID_KEY,
      from: "InvoLink@anshikamisra.com",
      maxAge: 86400
    })
  ],
  pages:{
    verifyRequest:"/verify"
  }
});
