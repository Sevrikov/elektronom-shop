import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ЕЛЕКТРОНОМ — Інтернет-магазин електрообладнання та інструментів',
  description:
    'Інтернет-магазин «ЕЛЕКТРОНОМ» — продаж електрообладнання, інструментів та техніки в Києві. Великий вибір товарів, вигідні ціни, швидка доставка по Україні.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
