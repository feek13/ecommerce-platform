'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseTestPage() {
  const [status, setStatus] = useState('准备测试...')
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    testSupabase()
  }, [])

  const testSupabase = async () => {
    console.log('🧪 Starting Supabase test...')
    setStatus('正在连接 Supabase...')

    try {
      console.log('📡 Fetching products...')
      const startTime = Date.now()

      const { data, error } = await Promise.race([
        supabase.from('products').select('*').limit(5),
        new Promise<any>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout after 10s')), 10000)
        )
      ])

      const elapsed = Date.now() - startTime
      console.log(`⏱️ Request took ${elapsed}ms`)

      if (error) {
        console.error('❌ Supabase error:', error)
        setStatus(`错误: ${error.message}`)
        return
      }

      console.log('✅ Success! Got products:', data?.length)
      setProducts(data || [])
      setStatus(`成功！获取到 ${data?.length} 个商品`)
    } catch (err: any) {
      console.error('❌ Exception:', err)
      setStatus(`异常: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Supabase 连接测试</h1>

        <div className="mb-6 p-4 bg-blue-50 rounded">
          <p className="text-lg font-semibold">{status}</p>
        </div>

        {products.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">商品列表：</h2>
            {products.map((product) => (
              <div key={product.id} className="p-4 bg-gray-50 rounded">
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-600">价格: ¥{product.price}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:underline">← 返回首页</a>
        </div>
      </div>
    </div>
  )
}
