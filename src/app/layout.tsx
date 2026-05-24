import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Electronom — Інтернет-магазин електрообладнання та інструментів',
  description:
    'Інтернет-магазин «Electronom» — продаж електрообладнання, інструментів та техніки в Києві. Великий вибір товарів, вигідні ціни, швидка доставка по Україні.',
  icons: {
    icon: [
      { url: '/logo/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
