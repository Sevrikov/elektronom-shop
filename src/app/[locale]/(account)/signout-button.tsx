'use client'

import { useTransition } from 'react'
import { signOut } from 'next-auth/react'
import { LogOut, Loader2 } from 'lucide-react'

interface SignOutButtonProps {
  locale: string
}

export function SignOutButton({ locale }: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition()
  const uk = locale !== 'ru'

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut({ callbackUrl: `/${locale}` })
    })
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isPending}
      className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-destructive hover:bg-destructive/5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}
      {uk ? 'Вийти' : 'Выйти'}
    </button>
  )
}
