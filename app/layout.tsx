import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './providers/AuthProvider'
import { CartProvider } from './providers/CartProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: '智选商城 - 您的在线购物平台',
    template: '%s | 智选商城'
  },
  description: '智选商城 - 提供电子产品、服装鞋包、家居生活等多品类商品的在线购物平台。安全可靠，品质保证，让购物更轻松！',
  keywords: ['电商平台', '在线购物', '电子产品', '服装鞋包', '家居生活', '智选商城'],
  authors: [{ name: '智选商城' }],
  icons: {
    icon: '/icon',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
