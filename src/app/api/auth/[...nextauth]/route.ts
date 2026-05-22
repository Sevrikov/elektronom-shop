// src/app/api/auth/[...nextauth]/route.ts
// Задача 1.5 — NextAuth v5 route handler

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
