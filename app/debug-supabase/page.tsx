'use client'

import { useEffect, useState } from 'react'

export default function DebugSupabasePage() {
  const [diagnostics, setDiagnostics] = useState<any>({})

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    const results: any = {}

    // 1. 检查环境变量
    results.envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING'
    results.envHasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // 2. 动态导入 Supabase 客户端
    try {
      const { supabase } = await import('@/lib/supabase')
      results.clientImported = true
      results.clientType = typeof supabase

      // 检查客户端对象
      results.hasFrom = typeof supabase?.from === 'function'
      results.hasAuth = typeof supabase?.auth === 'object'

      // 尝试直接使用 fetch
      const fetchStart = Date.now()
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?limit=1`,
          {
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
            }
          }
        )
        const fetchTime = Date.now() - fetchStart
        results.directFetchWorks = response.ok
        results.fetchStatus = response.status
        results.fetchTime = fetchTime
        if (response.ok) {
          const data = await response.json()
          results.fetchData = data
        }
      } catch (e: any) {
        results.fetchError = e.message
      }

    } catch (err: any) {
      results.clientError = err.message
    }

    setDiagnostics(results)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Supabase 诊断</h1>

        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(diagnostics, null, 2)}
        </pre>

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:underline">← 返回首页</a>
        </div>
      </div>
    </div>
  )
}
