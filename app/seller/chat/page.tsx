'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSellerAuth } from '@/app/providers/SellerAuthProvider'
import { useChat } from '@/hooks/useChat'
import ConversationList from '@/components/chat/ConversationList'
import ChatWindow from '@/components/chat/ChatWindow'

export default function SellerChatPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useSellerAuth()
  const [isMobile, setIsMobile] = useState(false)
  const [showConversationList, setShowConversationList] = useState(true)

  const {
    conversations,
    currentConversation,
    messages,
    loading,
    messagesLoading,
    sending,
    selectConversation,
    sendMessage
  } = useChat(user?.id)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Redirect if not logged in or not a seller
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
      } else if (profile && profile.role !== 'seller') {
        router.push('/')
      }
    }
  }, [user, profile, authLoading, router])

  // Handle conversation selection on mobile
  const handleSelectConversation = (conversation: any) => {
    selectConversation(conversation)
    if (isMobile) {
      setShowConversationList(false)
    }
  }

  // Handle back button on mobile
  const handleBack = () => {
    setShowConversationList(true)
    selectConversation(null)
  }

  const handleSendMessage = async (content: string) => {
    if (!currentConversation) return false
    return await sendMessage(currentConversation.id, content)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user || (profile && profile.role !== 'seller')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">客服消息</h1>
          <p className="text-sm text-gray-600 mt-1">
            与买家沟通，解答问题
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-7xl mx-auto p-0 md:p-6">
        <div className="bg-white rounded-none md:rounded-lg shadow-sm h-[calc(100vh-120px)] md:h-[calc(100vh-180px)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Left: Conversations List */}
            <div className={`border-r ${
              isMobile
                ? (showConversationList ? 'block' : 'hidden')
                : 'block'
            }`}>
              <div className="p-4 border-b bg-purple-50">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">客户咨询</h2>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  {conversations.length} 个对话
                </p>
              </div>
              <ConversationList
                conversations={conversations}
                currentConversationId={currentConversation?.id || null}
                onSelectConversation={handleSelectConversation}
                userId={user.id}
                userRole="seller"
              />
            </div>

            {/* Right: Chat Window */}
            <div className={`lg:col-span-2 ${
              isMobile
                ? (showConversationList ? 'hidden' : 'block')
                : 'block'
            }`}>
              {/* Mobile Back Button */}
              {isMobile && currentConversation && (
                <div className="p-3 border-b bg-white flex items-center gap-3">
                  <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="font-medium text-gray-900">返回</span>
                </div>
              )}

              <ChatWindow
                conversation={currentConversation}
                messages={messages}
                userId={user.id}
                sending={sending}
                messagesLoading={messagesLoading}
                onSendMessage={handleSendMessage}
                userRole="seller"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
