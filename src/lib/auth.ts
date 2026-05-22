// src/lib/auth.ts
// Задача 1.4 — NextAuth v5 + PrismaAdapter
// MASTER_CONTEXT v1.3

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/client";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),

    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [Facebook({
          clientId: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        })]
      : []),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            passwordHash: true,
            role: true,
          },
        });

        if (!user?.passwordHash) return null;

        const isValid = await bcryptjs.compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: UserRole }).role ?? "CUSTOMER";
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },

  pages: {
    signIn: "/uk/login",
    error: "/uk/login",
  },
});

// ─── Хелперы авторизации ──────────────────────────────────────────────────────

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function requireManager() {
  const user = await requireAuth();
  if (user.role !== "ADMIN" && user.role !== "MANAGER") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
