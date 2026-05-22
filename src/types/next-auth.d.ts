// src/types/next-auth.d.ts
// Расширение типов NextAuth v5 — добавляем role и id

import type { UserRole } from "@/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }

  interface User {
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
