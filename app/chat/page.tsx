'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useChat } from '@/hooks/useChat'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ConversationList from '@/components/chat/ConversationList'
import ChatWindow from '@/components/chat/ChatWindow'

export default function ChatPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
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

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

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
      <div className="min-h-screen bg-[#EAEDED]">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#EAEDED] flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto w-full px-0 md:px-4 py-0 md:py-6">
        <div className="bg-white rounded-none md:rounded-lg shadow-sm h-[calc(100vh-64px)] md:h-[calc(100vh-180px)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Left: Conversations List */}
            <div className={`border-r ${
              isMobile
                ? (showConversationList ? 'block' : 'hidden')
                : 'block'
            }`}>
              <div className="p-4 border-b bg-gray-50">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">我的消息</h2>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  {conversations.length} 个对话
                </p>
              </div>
              <ConversationList
                conversations={conversations}
                currentConversationId={currentConversation?.id || null}
                onSelectConversation={handleSelectConversation}
                userId={user.id}
                userRole="buyer"
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
                userRole="buyer"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
