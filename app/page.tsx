'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getProducts, getCategories } from '@/lib/supabase-fetch'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import type { Product, Category } from '@/types/database'
import Link from 'next/link'
import { CategoryIcons, FunctionalIcons } from '@/components/icons/Icons'

// Category images data
const categoryImages = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
  home: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&h=600&fit=crop',
  books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
}

// Category info mapping
const categoryInfo: Record<string, { name: string; Icon: React.ComponentType<{ className?: string }>; desc: string }> = {
  electronics: {
    name: '电子产品',
    Icon: CategoryIcons.electronics,
    desc: '手机、电脑、相机等'
  },
  fashion: {
    name: '服装鞋包',
    Icon: CategoryIcons.fashion,
    desc: '时尚潮流服饰配饰'
  },
  home: {
    name: '家居生活',
    Icon: CategoryIcons.home,
    desc: '家具、家纺、厨具等'
  },
  books: {
    name: '图书音像',
    Icon: CategoryIcons.books,
    desc: '图书、音乐、影视作品'
  },
}

// Category Card Component
function CategoryCard({ categorySlug, image }: { categorySlug: string; image: string }) {
  const info = categoryInfo[categorySlug]
  if (!info) return null

  const { name, Icon, desc } = info

  return (
    <Link
      href={`/products?category=${categorySlug}`}
      className="group block relative overflow-hidden rounded-2xl aspect-[4/3]"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover img-zoom"
        loading="lazy"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 category-overlay" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--profile-gold)/0.2)] flex items-center justify-center">
            <Icon className="w-5 h-5 text-gold" />
          </div>
          <h3 className="font-display text-2xl text-white">{name}</h3>
        </div>
        <p className="text-sm text-[hsl(var(--profile-text-secondary))] mb-3">{desc}</p>
        <span className="inline-flex items-center gap-2 text-gold text-sm font-medium group-hover:gap-3 transition-all">
          探索分类
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

// Marquee Component
function Marquee() {
  const items = [
    '新用户立减 ¥50',
    '满 ¥99 免运费',
    '限时特惠 5 折起',
    '7 天无理由退货',
    '正品保证',
    '24 小时发货',
  ]

  return (
    <div className="marquee-container py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, index) => (
          <span key={index} className="mx-8 text-sm text-[hsl(var(--profile-text-secondary))]">
            <span className="text-gold mr-2">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// Trust Bar Component
function TrustBar() {
  const features = [
    { icon: FunctionalIcons.truck, label: '快速配送' },
    { icon: FunctionalIcons.creditCard, label: '安全支付' },
    { icon: FunctionalIcons.refresh, label: '无忧退换' },
    { icon: FunctionalIcons.chat, label: '在线客服' },
  ]

  return (
    <div className="trust-bar px-6 py-4 flex items-center justify-center gap-8 md:gap-16 flex-wrap">
      {features.map((feature, index) => {
        const IconComponent = feature.icon
        return (
          <div key={index} className="flex items-center gap-2">
            <IconComponent className="w-5 h-5 text-gold" size={20} />
            <span className="text-sm text-[hsl(var(--profile-text-secondary))]">{feature.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [products, cats] = await Promise.all([
        getProducts(8),
        getCategories(8)
      ])
      setFeaturedProducts(products || [])
      setCategories(cats || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--profile-bg-primary))]">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] hero-gradient overflow-hidden">
        {/* Decorative elements - using gradient instead of blur for performance */}
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-gradient-radial from-[hsl(var(--profile-gold)/0.12)] to-transparent rounded-full opacity-60" />
        <div className="absolute bottom-40 left-[5%] w-48 h-48 bg-gradient-radial from-[hsl(var(--profile-amber)/0.10)] to-transparent rounded-full opacity-50" />

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--profile-bg-tertiary))] border border-[hsl(var(--profile-border))] mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-[hsl(var(--profile-text-secondary))]">全场包邮 · 正品保证</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 opacity-0 animate-slide-up-stagger stagger-1">
              精选好物
              <span className="block text-gold-gradient">品质生活</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-[hsl(var(--profile-text-secondary))] max-w-xl mb-10 opacity-0 animate-slide-up-stagger stagger-2">
              发现您喜爱的商品，享受便捷购物体验。
              <br className="hidden md:block" />
              精心挑选，品质保证。
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-slide-up-stagger stagger-3">
              <Link
                href="/products"
                className="profile-btn-gold text-center"
              >
                立即探索
              </Link>
              {!user && (
                <Link
                  href="/signup"
                  className="profile-btn-ghost text-center"
                >
                  创建账号
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 md:mt-24 flex gap-12 md:gap-16">
            <div>
              <div className="font-display text-3xl md:text-4xl text-white">10K+</div>
              <div className="text-sm text-[hsl(var(--profile-text-muted))]">精选商品</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl text-white">50K+</div>
              <div className="text-sm text-[hsl(var(--profile-text-muted))]">满意用户</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl text-gold">99%</div>
              <div className="text-sm text-[hsl(var(--profile-text-muted))]">好评率</div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <Marquee />

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Trust Bar */}
        <div className="mb-16">
          <TrustBar />
        </div>

        {/* Categories Section */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-white mb-2">精选分类</h2>
              <p className="text-[hsl(var(--profile-text-secondary))]">探索您感兴趣的商品类别</p>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 text-gold hover:gap-3 transition-all"
            >
              查看全部
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Object.entries(categoryImages).map(([slug, image]) => (
              <CategoryCard key={slug} categorySlug={slug} image={image} />
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-white mb-2">热门商品</h2>
              <p className="text-[hsl(var(--profile-text-secondary))]">发现最受欢迎的精选商品</p>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 text-gold hover:gap-3 transition-all"
            >
              查看全部
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gold animate-bounce-dot" />
                <div className="w-2 h-2 rounded-full bg-gold animate-bounce-dot" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-gold animate-bounce-dot" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant="dark" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 homepage-card rounded-2xl">
              <FunctionalIcons.package className="w-16 h-16 text-[hsl(var(--profile-text-muted))] mx-auto mb-4" size={64} />
              <h3 className="text-xl font-medium text-white mb-2">暂无商品</h3>
              <p className="text-[hsl(var(--profile-text-secondary))] mb-6">
                请在 Supabase 中添加示例商品数据
              </p>
              <Link href="/products" className="profile-btn-gold inline-block">
                查看商品列表
              </Link>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-3xl homepage-card p-8 md:p-12 lg:p-16">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--profile-gold)/0.1)] rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
                开启您的购物之旅
              </h2>
              <p className="text-[hsl(var(--profile-text-secondary))] max-w-md">
                立即注册，享受新用户专属优惠。我们为您精选优质商品，让购物更轻松。
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/products" className="profile-btn-gold whitespace-nowrap">
                浏览商品
              </Link>
              {!user && (
                <Link href="/signup" className="profile-btn-ghost whitespace-nowrap">
                  注册账号
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
