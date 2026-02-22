import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Find user by email
        const userList = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const user = userList[0];

        if (!user) {
          return null;
        }

        // For demo purposes, accept "demo123" for the hashed password
        // In production, use: await bcrypt.compare(password, user.password)
        const isValid = 
          password === "demo123" || 
          await bcrypt.compare(password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.subscriptionTier = (user as any).subscriptionTier;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).subscriptionTier = token.subscriptionTier;
      }
      return session;
    },
  },
});
