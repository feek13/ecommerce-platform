import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './providers/AuthProvider'
import { CartProvider } from './providers/CartProvider'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
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
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://ecommerce-platform.vercel.app',
    title: '智选商城 - 您的在线购物平台',
    description: '智选商城 - 提供电子产品、服装鞋包、家居生活等多品类商品的在线购物平台。安全可靠，品质保证，让购物更轻松！',
    siteName: '智选商城',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: '智选商城 - 您的在线购物平台',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '智选商城 - 您的在线购物平台',
    description: '智选商城 - 提供电子产品、服装鞋包、家居生活等多品类商品的在线购物平台。安全可靠，品质保证，让购物更轻松！',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://ecommerce-platform.vercel.app'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
