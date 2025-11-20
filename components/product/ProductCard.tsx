import Link from 'next/link'
import type { Product } from '@/types/database'
import { WarningIcon } from '@/components/icons/Icons'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] || '/placeholder-product.jpg'

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg'
          }}
        />
        {discountPercent > 0 && (
          <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg">
            -{discountPercent}%
          </div>
        )}
        {product.stock > 0 && product.stock < 10 && (
          <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-orange-500 text-white text-[10px] md:text-xs font-semibold px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full">
            仅剩{product.stock}件
          </div>
        )}
        {product.seller && product.seller.role !== 'seller' && (
          <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 bg-yellow-500 text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg flex items-center gap-0.5 md:gap-1">
            <WarningIcon className="w-3 h-3 md:w-4 md:h-4" />
            <span>商家被审查中</span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-base md:text-lg font-bold">暂时缺货</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 md:p-4">
        {/* Title */}
        <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 mb-1.5 md:mb-2 group-hover:text-purple-600 transition-colors min-h-[2rem] md:min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating_count > 0 && (
          <div className="flex items-center gap-1 md:gap-1.5 mb-2 md:mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 md:w-3.5 md:h-3.5 ${
                    i < Math.round(product.rating_avg)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] md:text-xs text-gray-500 font-medium">
              ({product.rating_count})
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="mb-2 md:mb-3">
          <div className="flex items-baseline gap-1 md:gap-1.5">
            <span className="text-[10px] md:text-xs text-gray-500">¥</span>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {product.price.toFixed(2).split('.')[0]}
            </span>
            <span className="text-xs md:text-sm text-gray-500">
              .{product.price.toFixed(2).split('.')[1]}
            </span>
          </div>

          {product.original_price && product.original_price > product.price && (
            <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
              <span className="text-[10px] md:text-xs text-gray-400 line-through">
                ¥{product.original_price.toFixed(2)}
              </span>
              <span className="text-[10px] md:text-xs text-red-500 font-semibold">
                省¥{(product.original_price - product.price).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
          <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            包邮
          </span>
          {product.sales_count > 100 && (
            <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-purple-100 text-purple-800">
              🔥 热销
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
