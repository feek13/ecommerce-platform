'use client'

import type { ChatConversation } from '@/hooks/useChat'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface ConversationListProps {
  conversations: ChatConversation[]
  currentConversationId: string | null
  onSelectConversation: (conversation: ChatConversation) => void
  userId: string
  userRole: 'buyer' | 'seller'
}

export default function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  userId,
  userRole
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm">暂无聊天记录</p>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto h-full">
      {conversations.map((conversation) => {
        const otherUser = userRole === 'buyer' ? conversation.seller : conversation.buyer
        const isActive = conversation.id === currentConversationId

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full p-3 md:p-4 border-b hover:bg-gray-50 transition text-left ${
              isActive ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                {otherUser?.full_name?.[0] || otherUser?.email?.[0] || '?'}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name & Time */}
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="font-medium text-gray-900 text-sm md:text-base truncate">
                    {otherUser?.full_name || otherUser?.email}
                  </h4>
                  {conversation.last_message_at && (
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatDistanceToNow(new Date(conversation.last_message_at), {
                        locale: zhCN,
                        addSuffix: true
                      })}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                {conversation.product && (
                  <div className="flex items-center gap-2 mb-1">
                    {conversation.product.images && conversation.product.images[0] && (
                      <img
                        src={conversation.product.images[0]}
                        alt={conversation.product.name}
                        className="w-8 h-8 object-cover rounded border border-gray-200"
                      />
                    )}
                    <span className="text-xs text-gray-600 truncate">
                      {conversation.product.name}
                    </span>
                  </div>
                )}

                {/* Last Message Preview */}
                {conversation.last_message && (
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {conversation.last_message}
                  </p>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
