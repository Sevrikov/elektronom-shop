import type { Metadata } from 'next'
import { LoginForm } from './login-form'
import { isValidLocale } from '@/i18n/request'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Вхід' : 'Вход'} | ЕЛЕКТРОНОМ`,
  }
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-surface-alt py-12 px-4">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl p-6 lg:p-8 shadow-sm">
        <LoginForm locale={locale} />
      </div>
    </div>
  )
}
