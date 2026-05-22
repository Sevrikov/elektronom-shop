'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Loader2, Lock, Mail, User } from 'lucide-react'
import { registerUser } from '@/actions/auth'

interface RegisterFormProps {
  locale: string
}

export function RegisterForm({ locale }: RegisterFormProps) {
  const router = useRouter()
  const uk = locale !== 'ru'
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name || !email || !password) {
      setError(uk ? 'Заповніть усі поля' : 'Заполните все поля')
      return
    }

    if (password.length < 6) {
      setError(uk ? 'Пароль має бути не менше 6 символів' : 'Пароль должен быть не менее 6 символов')
      return
    }

    startTransition(async () => {
      const res = await registerUser({ name, email, password })
      if (!res.success) {
        setError(res.error || (uk ? 'Помилка реєстрації' : 'Ошибка регистрации'))
        return
      }

      // Auto login on successful registration
      try {
        const loginRes = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (loginRes?.error) {
          router.push(`/${locale}/login` as never)
        } else {
          router.push(`/${locale}` as never)
          router.refresh()
        }
      } catch (err) {
        console.error('[autoLogin]', err)
        router.push(`/${locale}/login` as never)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-text-primary">
          {uk ? 'Створити акаунт' : 'Создать аккаунт'}
        </h2>
        <p className="text-xs text-text-muted mt-1">
          {uk ? 'Заповніть форму для реєстрації' : 'Заполните форму для регистрации'}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
          {uk ? 'Ім\'я' : 'Имя'}
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-3.5 size-4 text-text-muted" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 pl-10 pr-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
            placeholder={uk ? 'Іван' : 'Иван'}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3.5 size-4 text-text-muted" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 pl-10 pr-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
            placeholder="example@mail.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
          {uk ? 'Пароль (мін. 6 символів)' : 'Пароль (мин. 6 символов)'}
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3.5 size-4 text-text-muted" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 pl-10 pr-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-lg text-white font-semibold flex items-center justify-center gap-2 cursor-pointer bg-accent hover:bg-accent-hover transition-colors text-sm disabled:bg-surface-raised disabled:text-text-muted disabled:cursor-not-allowed mt-2"
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : (uk ? 'Зареєструватися' : 'Зарегистрироваться')}
      </button>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-3 mt-1">
        <button
          type="button"
          onClick={() => void signIn('google', { callbackUrl: `/${locale}` })}
          className="h-11 rounded-lg border border-border-strong font-semibold flex items-center justify-center gap-2 cursor-pointer bg-white text-text-primary hover:bg-surface-alt transition-colors text-sm"
        >
          <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.53 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z"/>
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.87c2.16-1.99 3.74-4.92 3.74-8.55z"/>
            <path fill="#FBBC05" d="M5.24 10.55A6.98 6.98 0 0 1 5 12c0 .5.08 1 .24 1.45l-3.85 2.99A11.96 11.96 0 0 1 0 12c0-1.57.3-3.07.85-4.44l4.39 2.99z"/>
            <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.69-2.87c-1.02.68-2.33 1.09-4.24 1.09-3.34 0-5.86-1.81-6.76-4.51L1.39 16.8c1.98 3.89 5.96 6.56 10.61 6.56z"/>
          </svg>
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={() => void signIn('facebook', { callbackUrl: `/${locale}` })}
          className="h-11 rounded-lg border border-border-strong font-semibold flex items-center justify-center gap-2 cursor-pointer bg-white text-text-primary hover:bg-surface-alt transition-colors text-sm"
        >
          <svg className="size-4" fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Facebook</span>
        </button>
      </div>

      <p className="text-center text-xs text-text-muted mt-2">
        {uk ? 'Вже є акаунт?' : 'Уже есть аккаунт?'}{' '}
        <Link href={`/${locale}/login` as never} className="text-accent font-semibold hover:underline">
          {uk ? 'Увійти' : 'Войти'}
        </Link>
      </p>
    </form>
  )
}
