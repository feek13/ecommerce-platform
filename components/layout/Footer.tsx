import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-6">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                🛍️ 电商平台
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              专业的在线购物平台，为您提供优质的商品和服务。让购物变得更简单、更愉快。
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              快速导航
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 group-hover:bg-pink-500 transition-colors"></span>
                  热门商品
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 group-hover:bg-pink-500 transition-colors"></span>
                  电子产品
                </Link>
              </li>
              <li>
                <Link href="/products?category=fashion" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 group-hover:bg-pink-500 transition-colors"></span>
                  时尚服饰
                </Link>
              </li>
              <li>
                <Link href="/seller" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 group-hover:bg-pink-500 transition-colors"></span>
                  卖家中心
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              客户服务
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 group-hover:bg-pink-500 transition-colors"></span>
                  帮助中心
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 group-hover:bg-pink-500 transition-colors"></span>
                  退货政策
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 group-hover:bg-pink-500 transition-colors"></span>
                  配送说明
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 group-hover:bg-pink-500 transition-colors"></span>
                  联系我们
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              订阅优惠
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              订阅我们的邮件，获取最新优惠信息
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="输入邮箱"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-sm text-white placeholder-gray-500"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all transform hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">安全支付</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">7天退货</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">正品保证</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="text-gray-500 text-sm">支持支付方式：</div>
            <div className="flex gap-4">
              <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400 hover:bg-gray-700 transition-colors cursor-pointer">
                微信
              </div>
              <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400 hover:bg-gray-700 transition-colors cursor-pointer">
                支付宝
              </div>
              <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400 hover:bg-gray-700 transition-colors cursor-pointer">
                银联
              </div>
              <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400 hover:bg-gray-700 transition-colors cursor-pointer">
                VISA
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-500 text-sm text-center md:text-left">
            © 2025 电商平台. All rights reserved. | 毕业设计项目
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">隐私政策</a>
            <a href="#" className="hover:text-white transition-colors">服务条款</a>
            <a href="#" className="hover:text-white transition-colors">Cookie 设置</a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-110 z-50"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  )
}
