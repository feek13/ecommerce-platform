'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Product } from '@/types/database'
import Toast from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

export default function SellerProductsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user, filter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('products')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '删除商品',
      message: '确定要删除这个商品吗？此操作无法撤销。',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })

        try {
          const { error } = await supabase
            .from('products')
            .update({ status: 'deleted' })
            .eq('id', id)

          if (error) throw error

          setToast({ message: '商品已删除', type: 'success' })
          fetchProducts()
        } catch (error) {
          console.error('Error deleting product:', error)
          setToast({ message: '删除失败，请稍后重试', type: 'error' })
        }
      }
    })
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      setToast({
        message: `商品已${newStatus === 'active' ? '上架' : '下架'}`,
        type: 'success'
      })
      fetchProducts()
    } catch (error) {
      console.error('Error updating product status:', error)
      setToast({ message: '更新失败，请稍后重试', type: 'error' })
    }
  }

  const filteredProducts = products.filter((product) => product.status !== 'deleted')

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 lg:mb-8 gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">商品管理</h1>
          <p className="text-sm md:text-base text-gray-600">管理您的所有商品</p>
        </div>
        <Link
          href="/seller/products/new"
          className="inline-flex items-center px-4 md:px-5 lg:px-6 py-2.5 md:py-2.5 lg:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:from-purple-700 active:to-pink-700 text-white font-semibold rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base min-h-[44px] w-full sm:w-auto justify-center"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          添加商品
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-3 md:p-4 mb-4 md:mb-6 border border-gray-100">
        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
          <span className="text-xs md:text-sm font-medium text-gray-700 flex-shrink-0">筛选：</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 md:px-4 py-2 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-colors whitespace-nowrap min-h-[44px] ${
              filter === 'all'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100 active:bg-gray-100'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 md:px-4 py-2 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-colors whitespace-nowrap min-h-[44px] ${
              filter === 'active'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100 active:bg-gray-100'
            }`}
          >
            在售
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-3 md:px-4 py-2 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-colors whitespace-nowrap min-h-[44px] ${
              filter === 'inactive'
                ? 'bg-gray-200 text-gray-700'
                : 'text-gray-600 hover:bg-gray-100 active:bg-gray-100'
            }`}
          >
            已下架
          </button>
        </div>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="flex justify-center items-center py-12 md:py-20">
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-8 md:p-12 text-center border border-gray-100">
          <div className="text-4xl md:text-6xl mb-3 md:mb-4">📦</div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1.5 md:mb-2">还没有商品</h3>
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">开始添加您的第一个商品吧！</p>
          <Link
            href="/seller/products/new"
            className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg md:rounded-xl hover:shadow-lg active:shadow-lg transition-all text-sm md:text-base min-h-[44px]"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            添加商品
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="space-y-3 md:hidden">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {/* Product Header */}
                <div className="p-3 flex gap-3">
                  <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/100'}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {product.status === 'active' ? '在售' : '已下架'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Info Grid */}
                <div className="px-3 pb-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-gray-500 mb-0.5">价格</div>
                    <div className="font-semibold text-gray-900">¥{product.price.toFixed(2)}</div>
                    {product.original_price && product.original_price > product.price && (
                      <div className="text-gray-400 line-through">¥{product.original_price.toFixed(2)}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-gray-500 mb-0.5">库存</div>
                    <div className={`font-medium ${
                      product.stock === 0 ? 'text-red-600' :
                      product.stock < 10 ? 'text-orange-600' :
                      'text-gray-900'
                    }`}>
                      {product.stock} 件
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-0.5">销量</div>
                    <div className="font-medium text-gray-900">{product.sales_count || 0}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-3 pb-3 flex gap-2">
                  <Link
                    href={`/seller/products/${product.id}/edit`}
                    className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-700 text-white text-sm font-medium rounded-lg transition text-center min-h-[44px] flex items-center justify-center"
                  >
                    编辑
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(product.id, product.status)}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-700 text-white text-sm font-medium rounded-lg transition min-h-[44px]"
                  >
                    {product.status === 'active' ? '下架' : '上架'}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 active:bg-red-700 text-white text-sm font-medium rounded-lg transition min-h-[44px]"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    商品
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    价格
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    库存
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    销量
                  </th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 lg:h-16 lg:w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={product.images?.[0] || 'https://via.placeholder.com/100'}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-3 lg:ml-4">
                          <div className="text-xs lg:text-sm font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm font-semibold text-gray-900">
                        ¥{product.price.toFixed(2)}
                      </div>
                      {product.original_price && product.original_price > product.price && (
                        <div className="text-xs text-gray-400 line-through">
                          ¥{product.original_price.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <div className={`text-xs lg:text-sm font-medium ${
                        product.stock === 0 ? 'text-red-600' :
                        product.stock < 10 ? 'text-orange-600' :
                        'text-gray-900'
                      }`}>
                        {product.stock} 件
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 lg:px-3 py-0.5 lg:py-1 text-xs font-semibold rounded-full ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {product.status === 'active' ? '在售' : '已下架'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900">
                      {product.sales_count || 0}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-right text-xs lg:text-sm font-medium">
                      <div className="flex items-center justify-end gap-1.5 lg:gap-2">
                        <Link
                          href={`/seller/products/${product.id}/edit`}
                          className="text-purple-600 hover:text-purple-900 active:text-purple-900 transition-colors px-2 py-1"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(product.id, product.status)}
                          className="text-blue-600 hover:text-blue-900 active:text-blue-900 transition-colors px-2 py-1"
                        >
                          {product.status === 'active' ? '下架' : '上架'}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 active:text-red-900 transition-colors px-2 py-1"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
