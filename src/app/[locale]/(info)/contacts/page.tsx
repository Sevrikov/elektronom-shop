import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/i18n/request'
import Breadcrumbs from '@/components/layout/breadcrumbs'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { contactInfo } from '@/lib/constants'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const uk = locale !== 'ru'
  return {
    title: `${uk ? 'Контакти' : 'Контакты'} | Electronom`,
    description: uk
      ? 'Контактна інформація інтернет-магазину Electronom. Телефон, email, адреса складу в Києві.'
      : 'Контактная информация интернет-магазина Electronom. Телефон, email, адрес склада в Киеве.',
  }
}

export default async function ContactsPage({ params }: PageProps) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const uk = locale !== 'ru'

  const breadcrumbs = [
    { name: uk ? 'Головна' : 'Главная', url: '/' },
    { name: uk ? 'Контакти' : 'Контакты' },
  ]

  const contacts = [
    {
      icon: Phone,
      title: uk ? 'Телефон' : 'Телефон',
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/[\s()-]/g, '')}`,
      sub: contactInfo.workingHours[locale as 'uk' | 'ru'],
    },
    {
      icon: Mail,
      title: 'Email',
      value: contactInfo.email ?? 'info@elektronom.com.ua',
      href: `mailto:${contactInfo.email ?? 'info@elektronom.com.ua'}`,
      sub: uk ? 'Відповідаємо протягом 1 дня' : 'Отвечаем в течение 1 дня',
    },
    {
      icon: MapPin,
      title: uk ? 'Склад / Самовивіз' : 'Склад / Самовывоз',
      value: contactInfo.address[locale as 'uk' | 'ru'],
      href: 'https://maps.google.com',
      sub: contactInfo.workingHours[locale as 'uk' | 'ru'],
    },
    {
      icon: Clock,
      title: uk ? 'Графік роботи' : 'График работы',
      value: uk ? 'Понеділок — Субота' : 'Понедельник — Суббота',
      href: null,
      sub: '7:00 — 19:00',
    },
  ]

  return (
    <div className="min-h-[calc(100vh-200px)] bg-surface-alt py-6 lg:py-8">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-20">
        <Breadcrumbs items={breadcrumbs} locale={locale} />

        <h1 className="text-3xl font-extrabold text-text-primary mt-4 mb-8">
          {uk ? 'Контакти' : 'Контакты'}
        </h1>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {contacts.map(({ icon: Icon, title, value, href, sub }) => (
            <div key={title} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="size-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                <Icon className="size-5" />
              </div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{title}</p>
              {href ? (
                <a href={href} className="text-sm font-bold text-text-primary hover:text-accent transition-colors">
                  {value}
                </a>
              ) : (
                <p className="text-sm font-bold text-text-primary">{value}</p>
              )}
              <p className="text-xs text-text-muted mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-border rounded-2xl p-6 lg:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-text-primary mb-6">
            {uk ? 'Написати нам' : 'Написать нам'}
          </h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                {uk ? "Ім'я" : "Имя"}
              </label>
              <input
                type="text"
                name="name"
                className="w-full h-11 px-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
                placeholder={uk ? 'Іван Петренко' : 'Иван Петренко'}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full h-11 px-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors"
                placeholder="example@mail.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                {uk ? 'Повідомлення' : 'Сообщение'}
              </label>
              <textarea
                name="message"
                rows={5}
                className="w-full p-3.5 rounded-lg border border-border-strong bg-white focus:border-accent outline-none text-sm text-text-primary transition-colors resize-none"
                placeholder={uk ? 'Ваше запитання або повідомлення...' : 'Ваш вопрос или сообщение...'}
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="h-11 px-8 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors text-sm cursor-pointer"
              >
                {uk ? 'Надіслати' : 'Отправить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
