'use client'

export default function EnvTestPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">环境变量测试</h1>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-bold mb-2">Supabase URL:</h2>
            <code className="text-sm break-all">
              {supabaseUrl || '❌ 未定义'}
            </code>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-bold mb-2">Supabase Key:</h2>
            <code className="text-sm">
              {hasKey ? '✅ 已定义' : '❌ 未定义'}
            </code>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-bold mb-2">Process Env Type:</h2>
            <code className="text-sm">
              {typeof process !== 'undefined' ? `✅ process 存在 (${typeof process})` : '❌ process 不存在'}
            </code>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-bold mb-2">All NEXT_PUBLIC_ vars:</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(
                Object.keys(process?.env || {}).filter(k => k.startsWith('NEXT_PUBLIC')),
                null,
                2
              )}
            </pre>
          </div>
        </div>

        <div className="mt-6">
          <a href="/" className="text-blue-600 hover:underline">← 返回首页</a>
        </div>
      </div>
    </div>
  )
}
