'use client'

import { useState, useRef, useEffect } from 'react'
import type { ChatMessage, ChatConversation } from '@/hooks/useChat'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface ChatWindowProps {
  conversation: ChatConversation | null
  messages: ChatMessage[]
  userId: string
  sending: boolean
  messagesLoading: boolean
  onSendMessage: (content: string) => Promise<boolean>
  userRole: 'buyer' | 'seller'
}

export default function ChatWindow({
  conversation,
  messages,
  userId,
  sending,
  messagesLoading,
  onSendMessage,
  userRole
}: ChatWindowProps) {
  const [messageText, setMessageText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when conversation changes
  useEffect(() => {
    if (conversation) {
      inputRef.current?.focus()
    }
  }, [conversation])

  const handleSend = async () => {
    if (!messageText.trim() || sending) return

    const success = await onSendMessage(messageText)
    if (success) {
      setMessageText('')
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-gray-500 text-sm md:text-base">选择一个对话开始聊天</p>
      </div>
    )
  }

  const otherUser = userRole === 'buyer' ? conversation.seller : conversation.buyer

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="p-3 md:p-4 border-b bg-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
          {otherUser?.full_name?.[0] || otherUser?.email?.[0] || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm md:text-base truncate">
            {otherUser?.full_name || otherUser?.email}
          </h3>
          {conversation.product && (
            <p className="text-xs text-gray-600 truncate">
              关于: {conversation.product.name}
            </p>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50">
        {messagesLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500 text-sm">
            暂无消息，发送第一条消息开始聊天
          </div>
        ) : (
          messages.map((message) => {
            const isSender = message.sender_id === userId

            return (
              <div
                key={message.id}
                className={`flex gap-2 md:gap-3 ${isSender ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium ${
                  isSender
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {message.sender?.full_name?.[0] || message.sender?.email?.[0] || '?'}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 max-w-[75%] ${isSender ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl px-3 md:px-4 py-2 md:py-3 ${
                      isSender
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm md:text-base whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 px-2 ${isSender ? 'text-right' : ''}`}>
                    {formatDistanceToNow(new Date(message.created_at), {
                      locale: zhCN,
                      addSuffix: true
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 border-t bg-white">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息... (按 Enter 发送)"
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={2}
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!messageText.trim() || sending}
            className="px-4 md:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 self-end"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="hidden md:inline">发送中...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="hidden md:inline">发送</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
