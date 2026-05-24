import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { User, Shield, Mail } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Профіль' : 'Профиль'} | Electronom`,
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const uk = locale !== 'ru'
  const session = await auth()
  if (!session?.user) notFound()

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-6">
        {uk ? 'Профіль користувача' : 'Профиль пользователя'}
      </h2>

      <div className="flex flex-col gap-6 max-w-md">
        {/* Avatar Placeholder */}
        <div className="flex items-center gap-4">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ?? 'Avatar'}
              className="size-16 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="size-16 rounded-full bg-accent-subtle/30 flex items-center justify-center text-accent">
              <User className="size-8" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-text-primary">
              {session.user.name || (uk ? 'Гість' : 'Гость')}
            </h3>
            <p className="text-xs text-text-muted">
              ID: {session.user.id}
            </p>
          </div>
        </div>

        {/* User Details */}
        <div className="border border-border rounded-xl divide-y divide-border overflow-hidden shadow-sm">
          <div className="p-4 flex items-center gap-3">
            <Mail className="size-4 text-text-muted shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Email</p>
              <p className="text-sm font-semibold text-text-primary">{session.user.email}</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-3">
            <Shield className="size-4 text-text-muted shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {uk ? 'Роль' : 'Роль'}
              </p>
              <p className="text-sm font-semibold text-text-primary">{session.user.role || 'CUSTOMER'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
