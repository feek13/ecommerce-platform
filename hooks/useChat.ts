import { useState, useEffect, useCallback } from 'react'
import {
  getChatConversations,
  getConversationMessages,
  sendChatMessage,
  createChatConversation,
  markConversationAsRead
} from '@/lib/supabase-fetch'

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
  sender?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
}

export interface ChatConversation {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string
  last_message?: string
  last_message_at?: string
  created_at: string
  updated_at: string
  buyer?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
  seller?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
  product?: {
    id: string
    name: string
    images: string[]
  }
}

export function useChat(userId: string | undefined) {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sending, setSending] = useState(false)

  // Fetch all conversations for the user
  const fetchConversations = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      const data = await getChatConversations(userId)
      setConversations(data || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setMessagesLoading(true)
      const data = await getConversationMessages(conversationId)
      setMessages(data || [])

      // Mark as read
      if (userId) {
        await markConversationAsRead(conversationId, userId)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setMessagesLoading(false)
    }
  }, [userId])

  // Send a message
  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    if (!userId || !content.trim()) return false

    try {
      setSending(true)
      const newMessage = await sendChatMessage({
        conversation_id: conversationId,
        sender_id: userId,
        content: content.trim()
      })

      if (newMessage) {
        // Add the new message to the list
        setMessages((prev) => [...prev, newMessage[0]])
        // Refresh conversations to update last message
        await fetchConversations()
        return true
      }
      return false
    } catch (error) {
      console.error('Error sending message:', error)
      return false
    } finally {
      setSending(false)
    }
  }, [userId, fetchConversations])

  // Create a new conversation
  const createConversation = useCallback(async (
    buyerId: string,
    sellerId: string,
    productId: string
  ) => {
    try {
      const newConversation = await createChatConversation({
        buyer_id: buyerId,
        seller_id: sellerId,
        product_id: productId
      })

      if (newConversation) {
        await fetchConversations()
        return newConversation[0]
      }
      return null
    } catch (error) {
      console.error('Error creating conversation:', error)
      return null
    }
  }, [fetchConversations])

  // Select a conversation
  const selectConversation = useCallback((conversation: ChatConversation | null) => {
    setCurrentConversation(conversation)
    if (conversation) {
      fetchMessages(conversation.id)
    } else {
      setMessages([])
    }
  }, [fetchMessages])

  // Get unread count
  const getUnreadCount = useCallback(() => {
    return conversations.reduce((count, conv) => {
      // Count conversations with unread messages
      // This is a placeholder - you'd need to track unread in the conversation table
      return count
    }, 0)
  }, [conversations])

  // Initial load
  useEffect(() => {
    if (userId) {
      fetchConversations()
    }
  }, [userId, fetchConversations])

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    messagesLoading,
    sending,
    fetchConversations,
    selectConversation,
    sendMessage,
    createConversation,
    getUnreadCount
  }
}
