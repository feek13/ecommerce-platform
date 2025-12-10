'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getAllProducts, getProductsByCategory } from '@/lib/supabase-fetch'
import type { Product } from '@/types/database'
import ProductCard from '@/components/product/ProductCard'
import ProductSkeleton from '@/components/ui/ProductSkeleton'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'

function ProductsContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [category])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching products...', category ? `category: ${category}` : 'all products')

      let data
      if (category) {
        data = await getProductsByCategory(category, 50)
      } else {
        data = await getAllProducts(50)
      }

      console.log('✅ Products loaded:', data?.length || 0)
      setProducts(data || [])
    } catch (err: any) {
      console.error('❌ Error fetching products:', err)
      setError(err.message || '加载商品失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      {/* Amazon-style Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-[1500px] mx-auto px-4 py-4 md:py-6">
        {/* Breadcrumb */}
        <div className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">
          <span>首页</span>
          <span className="mx-1.5 md:mx-2">›</span>
          <span className="font-semibold">所有商品</span>
        </div>

        {/* Guest Mode Notice */}
        {!user && (
          <div className="mb-3 md:mb-4 p-2.5 md:p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-800 text-xs md:text-sm">
            👋 你正在以<strong>访客模式</strong>浏览。登录后可以购买商品、加入购物车、收藏商品等。
            <a href="/login" className="underline ml-1">点击登录</a>
          </div>
        )}

        {/* Loading State - Elegant Skeleton */}
        {loading && <ProductSkeleton count={10} />}

        {/* Error State */}
        {error && (
          <div className="p-4 md:p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm md:text-base text-red-800">
              ❌ {error}
            </p>
            <p className="text-xs md:text-sm text-red-600 mt-2">
              请确保已在 Supabase 中执行数据库迁移文件，并添加了示例商品数据。
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12 md:py-20">
            <div className="text-4xl md:text-6xl mb-3 md:mb-4">📦</div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1.5 md:mb-2">
              暂无商品
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              商家正在努力上架商品中，敬请期待...
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">结果</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#EAEDED]">
        <Header />
        <main className="max-w-[1500px] mx-auto px-4 py-4 md:py-6">
          {/* Breadcrumb skeleton */}
          <div className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">
            <span>首页</span>
            <span className="mx-1.5 md:mx-2">›</span>
            <span className="font-semibold">所有商品</span>
          </div>
          <ProductSkeleton count={10} />
        </main>
        <Footer />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
