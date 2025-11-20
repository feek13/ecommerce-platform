'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import {
  Smartphone,
  Shirt,
  Home,
  Apple,
  Sparkles,
  Dumbbell,
  BookOpen,
  Baby,
  Menu,
  Search,
  ShoppingCart,
  User,
  Package,
  ChevronDown,
  ChevronRight,
  X,
  Flame,
  LayoutGrid
} from 'lucide-react'

// 分类数据结构
const categories = [
  {
    id: 'electronics',
    name: '电子产品',
    icon: <Smartphone className="w-5 h-5" />,
    subcategories: [
      { name: '手机通讯', items: ['智能手机', '老人机', '对讲机', '手机配件'] },
      { name: '电脑办公', items: ['笔记本', '台式机', '平板电脑', 'DIY硬件'] },
      { name: '数码影音', items: ['数码相机', '摄像机', '耳机音响', '智能设备'] },
    ]
  },
  {
    id: 'fashion',
    name: '服装鞋包',
    icon: <Shirt className="w-5 h-5" />,
    subcategories: [
      { name: '女装', items: ['连衣裙', 'T恤', '裤装', '外套'] },
      { name: '男装', items: ['衬衫', 'T恤', '裤装', '外套'] },
      { name: '鞋靴', items: ['运动鞋', '皮鞋', '靴子', '拖鞋'] },
      { name: '箱包', items: ['双肩包', '单肩包', '行李箱', '钱包'] },
    ]
  },
  {
    id: 'home',
    name: '家居生活',
    icon: <Home className="w-5 h-5" />,
    subcategories: [
      { name: '家具', items: ['沙发', '床', '桌椅', '柜子'] },
      { name: '家纺', items: ['床上用品', '窗帘', '地毯', '毛巾'] },
      { name: '厨具', items: ['锅具', '刀具', '餐具', '厨房电器'] },
    ]
  },
  {
    id: 'food',
    name: '食品生鲜',
    icon: <Apple className="w-5 h-5" />,
    subcategories: [
      { name: '休闲食品', items: ['零食', '坚果', '饼干', '糖果'] },
      { name: '水果蔬菜', items: ['新鲜水果', '新鲜蔬菜', '进口水果'] },
      { name: '肉禽蛋奶', items: ['猪肉', '牛肉', '鸡蛋', '牛奶'] },
    ]
  },
  {
    id: 'beauty',
    name: '美妆个护',
    icon: <Sparkles className="w-5 h-5" />,
    subcategories: [
      { name: '面部护肤', items: ['洁面', '爽肤水', '面霜', '面膜'] },
      { name: '彩妆', items: ['口红', '粉底', '眼影', '睫毛膏'] },
      { name: '个人护理', items: ['洗发水', '沐浴露', '牙膏', '香水'] },
    ]
  },
  {
    id: 'sports',
    name: '运动户外',
    icon: <Dumbbell className="w-5 h-5" />,
    subcategories: [
      { name: '运动服饰', items: ['运动鞋', '运动服', '运动内衣', '运动配件'] },
      { name: '健身器材', items: ['跑步机', '哑铃', '瑜伽垫', '动感单车'] },
      { name: '户外装备', items: ['帐篷', '睡袋', '登山包', '户外服装'] },
    ]
  },
  {
    id: 'books',
    name: '图书音像',
    icon: <BookOpen className="w-5 h-5" />,
    subcategories: [
      { name: '图书', items: ['小说', '文学', '经管', '科技'] },
      { name: '电子书', items: ['Kindle电子书', '网络小说', '有声读物'] },
      { name: '音像', items: ['CD', 'DVD', '蓝光碟', '黑胶唱片'] },
    ]
  },
  {
    id: 'kids',
    name: '母婴玩具',
    icon: <Baby className="w-5 h-5" />,
    subcategories: [
      { name: '奶粉辅食', items: ['婴儿奶粉', '营养辅食', '宝宝零食'] },
      { name: '纸尿裤', items: ['婴儿纸尿裤', '拉拉裤', '尿布'] },
      { name: '玩具', items: ['益智玩具', '毛绒玩具', '遥控玩具', '积木'] },
    ]
  },
]

export default function Header() {
  const { user, profile } = useAuth()
  const { itemCount } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`
    }
  }

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setCategoryMenuOpen(false)
      }
    }

    if (categoryMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [categoryMenuOpen])

  return (
    <header className="bg-[#232F3E] sticky top-0 z-50 shadow-md">
      {/* Main Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:h-[60px] px-4 gap-2 md:gap-4 py-2 md:py-0">
        {/* Top Row: Menu, Logo, Cart (Mobile) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-white p-2 hover:bg-[#37475A] rounded transition"
              aria-label="打开菜单"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-white font-bold text-base md:text-xl px-2 py-1 border border-transparent hover:border-white transition">
                <span className="text-[#FF9900]">电商</span>平台
              </div>
            </Link>
          </div>

          {/* Cart (Visible on Mobile in Top Row) */}
          <div className="md:hidden">
            <Link
              href="/cart"
              className="flex items-center text-white px-2 py-1 border border-transparent hover:border-white transition relative"
            >
              <div className="relative">
                <ShoppingCart className="w-7 h-7" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF9900] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Deliver to (Desktop Only) */}
        <div className="hidden md:flex items-center text-white text-sm px-2 py-1 border border-transparent hover:border-white transition cursor-pointer">
          <div>
            <div className="text-xs text-gray-300">配送至</div>
            <div className="font-bold">中国</div>
          </div>
        </div>

        {/* Search Bar (Full width on mobile row 2, Flex on desktop) */}
        <form onSubmit={handleSearch} className="w-full md:flex-1 max-w-3xl">
          <div className="flex h-10 rounded-lg overflow-hidden shadow-sm">
            <select className="hidden md:block bg-gray-100 border-none rounded-l px-3 text-sm text-gray-900 font-medium hover:bg-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF9900]">
              <option>全部</option>
              <option>电子产品</option>
              <option>服装鞋包</option>
              <option>家居生活</option>
              <option>图书音像</option>
              <option>运动户外</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索商品..."
              className="flex-1 px-4 border-none outline-none bg-white text-gray-900 text-base font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#FF9900]"
            />
            <button
              type="submit"
              className="bg-[#FEBD69] hover:bg-[#F3A847] px-6 rounded-r transition-colors duration-200 flex items-center justify-center"
            >
              <Search className="w-5 h-5 text-gray-900" />
            </button>
          </div>
        </form>

        {/* Account & Orders (Desktop Only) */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Link
              href="/profile"
              className="hidden lg:flex items-center text-white text-sm px-2 py-1 border border-transparent hover:border-white transition"
            >
              <div>
                <div className="text-xs">
                  你好, {profile?.full_name || profile?.email?.split('@')[0]}
                </div>
                <div className="font-bold">账户与订单</div>
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden lg:flex items-center text-white text-sm px-2 py-1 border border-transparent hover:border-white transition"
            >
              <div>
                <div className="text-xs">你好, 访客</div>
                <div className="font-bold">登录</div>
              </div>
            </Link>
          )}

          {/* Returns & Orders */}
          {user && (
            <Link
              href="/orders"
              className="hidden lg:flex items-center text-white text-sm px-2 py-1 border border-transparent hover:border-white transition"
            >
              <div>
                <div className="text-xs">退货</div>
                <div className="font-bold">与订单</div>
              </div>
            </Link>
          )}

          {/* Cart (Desktop Only) */}
          <Link
            href="/cart"
            className="flex items-center text-white px-2 py-1 border border-transparent hover:border-white transition relative"
          >
            <div className="relative">
              <ShoppingCart className="w-7 h-7 md:w-8 md:h-8" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF9900] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="ml-2 font-bold hidden sm:inline">购物车</span>
          </Link>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-[#37475A] text-white text-sm relative">
        <div className="flex items-center h-10 px-4 space-x-3 md:space-x-6">
          {/* 全部分类按钮 - 桌面端显示 */}
          <div className="relative hidden lg:block" ref={menuRef}>
            <button
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
              className="flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white transition"
            >
              <Menu className="w-5 h-5" />
              <span className="whitespace-nowrap">全部分类</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* 下拉菜单 */}
            {categoryMenuOpen && (
              <div className="absolute top-full left-0 mt-0 bg-white shadow-2xl z-50 flex border border-gray-200 rounded-b-lg overflow-hidden">
                {/* 左侧主分类列表 */}
                <div className="w-56 bg-white">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      className="relative"
                    >
                      <Link
                        href={`/products?category=${category.id}`}
                        className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition border-l-4 ${hoveredCategory === category.id
                          ? 'border-purple-600 bg-purple-50 text-purple-600'
                          : 'border-transparent'
                          }`}
                        onClick={() => setCategoryMenuOpen(false)}
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium flex-1">{category.name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>

                {/* 右侧子分类详情 */}
                {hoveredCategory && (
                  <div className="w-[600px] bg-gray-50 p-6 border-l border-gray-200">
                    {categories
                      .find(cat => cat.id === hoveredCategory)
                      ?.subcategories.map((subcat, idx) => (
                        <div key={idx} className="mb-6 last:mb-0">
                          <h3 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                            {subcat.name}
                          </h3>
                          <div className="grid grid-cols-4 gap-3">
                            {subcat.items.map((item, itemIdx) => (
                              <Link
                                key={itemIdx}
                                href={`/products?category=${hoveredCategory}&subcategory=${encodeURIComponent(item)}`}
                                className="text-sm text-gray-600 hover:text-purple-600 hover:bg-white px-3 py-2 rounded transition"
                                onClick={() => setCategoryMenuOpen(false)}
                              >
                                {item}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link href="/products" className="px-2 py-1 border border-transparent hover:border-white transition">
            热门商品
          </Link>
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="hidden lg:block px-2 py-1 border border-transparent hover:border-white transition"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-[85vw] max-w-[320px] bg-white z-50 shadow-2xl overflow-y-auto lg:hidden animate-slide-in-left">
            {/* Sidebar Header */}
            <div className="bg-[#232F3E] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8" />
                <div>
                  {user ? (
                    <>
                      <div className="font-bold">
                        {profile?.full_name || profile?.email?.split('@')[0]}
                      </div>
                      <div className="text-xs text-gray-300">{profile?.email}</div>
                    </>
                  ) : (
                    <div>
                      <div className="font-bold">你好，访客</div>
                      <Link
                        href="/login"
                        className="text-xs text-[#FF9900] hover:underline"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        点击登录
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 hover:bg-[#37475A] rounded transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {/* Account Links */}
              {user && (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>我的账户</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="w-5 h-5" />
                    <span>我的订单</span>
                  </Link>
                  <div className="border-t border-gray-200 my-2" />
                </>
              )}

              {/* Hot Categories */}
              <Link
                href="/products"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Flame className="w-5 h-5 text-orange-500" />
                <span>热门商品</span>
              </Link>

              {/* All Categories */}
              <div className="px-4 py-3 text-sm font-bold text-gray-500 uppercase flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                商品分类
              </div>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-gray-500">{category.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs text-gray-500">
                      {category.subcategories.length} 个子分类
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  )
}
