'use server'

import { z } from 'zod'
import bcryptjs from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function registerUser(data: z.infer<typeof RegisterSchema>) {
  try {
    const parsed = RegisterSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: 'Некоректні дані' }
    }

    const { name, email, password } = parsed.data

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existing) {
      return { success: false, error: 'Користувач з таким email вже існує' }
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10)

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('[registerUser] Error:', error)
    return { success: false, error: 'Помилка при реєстрації' }
  }
}
