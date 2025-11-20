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

// 分类轮播图片数据
const categoryImages = {
  electronics: [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=450&fit=crop',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=450&fit=crop',
  ],
  home: [
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=450&fit=crop',
  ],
  books: [
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=450&fit=crop',
  ],
}

// 分类卡片轮播组件
function CategoryCard({ category, images }: { category: string; images: string[]; }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (isHovering) return // 鼠标悬停时暂停轮播

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3000) // 每3秒切换

    return () => clearInterval(interval)
  }, [images.length, isHovering])

  const categoryInfo = {
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
  }[category as keyof typeof categoryImages]

  if (!categoryInfo) return null
  const { name, Icon, desc } = categoryInfo

  return (
    <Link
      href={`/products?category=${category}`}
      className="group relative overflow-hidden hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        {/* 轮播图片 */}
        {images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`${categoryInfo.name} ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${index === currentImage
              ? 'opacity-100 scale-100 group-hover:scale-110'
              : 'opacity-0 scale-105'
              }`}
          />
        ))}

        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* 内容 */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">{name}</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-200 mb-2 sm:mb-3">{desc}</p>
          <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[#FFD814] text-xs sm:text-sm md:text-base font-semibold group-hover:gap-3 transition-all">
            立即选购
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>

        {/* 轮播指示器 */}
        <div className="absolute top-4 right-4 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                setCurrentImage(index)
              }}
              className={`w-2 h-2 rounded-full transition-all ${index === currentImage
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/80'
                }`}
            />
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const { user, loading: authLoading } = useAuth()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Always fetch data, even if user is not logged in (guest mode)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching data with direct fetch...')

      // Fetch featured products using direct fetch
      const products = await getProducts(8)
      console.log('✅ Products loaded:', products?.length || 0)

      // Fetch categories using direct fetch
      const cats = await getCategories(8)
      console.log('✅ Categories loaded:', cats?.length || 0)

      setFeaturedProducts(products || [])
      setCategories(cats || [])
    } catch (error) {
      console.error('❌ Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      <Header />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 h-[400px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-blob"></div>

        <div className="relative max-w-[1500px] mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-xl pt-10 sm:pt-0 animate-fade-in-up">
            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-3 md:mb-4 tracking-tight">
              欢迎来到<span className="text-[#FF9900]">电商平台</span>
            </h1>
            <p className="text-base sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-5 md:mb-6 text-gray-100 leading-relaxed">
              发现您喜爱的商品，享受便捷购物体验
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/products"
                className="px-8 py-3.5 bg-[#FF9900] text-gray-900 font-bold rounded-full hover:bg-[#F3A847] transition-transform active:scale-95 shadow-lg shadow-orange-500/30 text-center text-base"
              >
                立即购物
              </Link>
              {!user && (
                <Link
                  href="/signup"
                  className="px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-transform active:scale-95 text-center text-base"
                >
                  注册账号
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1500px] mx-auto px-4 mt-6 sm:-mt-16 md:-mt-20 relative z-10 pb-20">
        {/* Category Carousel */}
        <div className="mb-8">
          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 divide-x divide-gray-100 scrollbar-hide">
              <div className="min-w-[85vw] sm:min-w-[50vw] md:min-w-0 snap-center">
                <CategoryCard category="electronics" images={categoryImages.electronics} />
              </div>
              <div className="min-w-[85vw] sm:min-w-[50vw] md:min-w-0 snap-center">
                <CategoryCard category="fashion" images={categoryImages.fashion} />
              </div>
              <div className="min-w-[85vw] sm:min-w-[50vw] md:min-w-0 snap-center">
                <CategoryCard category="home" images={categoryImages.home} />
              </div>
              <div className="min-w-[85vw] sm:min-w-[50vw] md:min-w-0 snap-center">
                <CategoryCard category="books" images={categoryImages.books} />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white p-6 rounded mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">热门商品</h2>
            <Link href="/products" className="text-[#007185] hover:underline">
              查看全部
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <FunctionalIcons.package className="w-24 h-24 text-gray-400" size={96} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                暂无商品
              </h3>
              <p className="text-gray-600 mb-4">
                请在 Supabase 中添加示例商品数据
              </p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-[#FF9900] text-gray-900 font-bold rounded hover:bg-[#F3A847] transition"
              >
                查看商品列表
              </Link>
            </div>
          )}
        </div>

        {/* Promotional Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded text-white">
            <h3 className="text-2xl font-bold mb-2">新用户专享</h3>
            <p className="mb-4">首单立减 ¥50</p>
            <Link
              href="/signup"
              className="inline-block px-6 py-2 bg-white text-purple-600 font-bold rounded hover:bg-gray-100 transition"
            >
              立即注册
            </Link>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8 rounded text-white">
            <h3 className="text-2xl font-bold mb-2">全场包邮</h3>
            <p className="mb-4">满 ¥99 免运费</p>
            <Link
              href="/products"
              className="inline-block px-6 py-2 bg-white text-blue-600 font-bold rounded hover:bg-gray-100 transition"
            >
              立即选购
            </Link>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 rounded text-white">
            <h3 className="text-2xl font-bold mb-2">限时特惠</h3>
            <p className="mb-4">精选商品 5 折起</p>
            <Link
              href="/products"
              className="inline-block px-6 py-2 bg-white text-orange-600 font-bold rounded hover:bg-gray-100 transition"
            >
              查看优惠
            </Link>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white p-8 rounded mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            为什么选择我们
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <FunctionalIcons.truck className="w-16 h-16 text-primary" size={64} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">快速配送</h3>
              <p className="text-sm text-gray-600">
                次日达服务，让您更快收到商品
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <FunctionalIcons.creditCard className="w-16 h-16 text-primary" size={64} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">安全支付</h3>
              <p className="text-sm text-gray-600">
                多种支付方式，交易更安全
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <FunctionalIcons.refresh className="w-16 h-16 text-primary" size={64} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">7天无理由退货</h3>
              <p className="text-sm text-gray-600">
                不满意可退换，购物更放心
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <FunctionalIcons.chat className="w-16 h-16 text-primary" size={64} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">在线客服</h3>
              <p className="text-sm text-gray-600">
                7×24小时在线服务，随时解答
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
