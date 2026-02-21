
"use client"

import { useState, useRef, useEffect } from 'react'
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Loader2, Sparkles, User } from "lucide-react"
import { aiHealthAssistantChat } from '@/ai/flows/ai-health-assistant-chat-flow'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'أهلاً بك! أنا مدربك الصحي الشخصي. كيف يمكنني مساعدتك اليوم في رحلتك نحو اللياقة؟' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const { response } = await aiHealthAssistantChat({
        message: userMsg,
        userProfile: { weight: 75, height: 175, goal: 'خسارة وزن', level: 'مبتدئ' },
        dailySummary: { consumedCalories: 1200, remainingCalories: 650 }
      })
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'عذراً، حدث خطأ ما. حاول مرة أخرى.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col rtl">
      <header className="p-6 bg-white shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-xl font-bold font-headline">المساعد الذكي</h1>
      </header>

      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
          >
            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-muted' : 'bg-primary'}`}>
              {msg.role === 'user' ? <User className="h-4 w-4 text-muted-foreground" /> : <Sparkles className="h-4 w-4 text-white" />}
            </div>
            <Card className={`p-4 rounded-2xl shadow-sm border-none ${msg.role === 'user' ? 'bg-white rounded-tr-none' : 'bg-primary text-white rounded-tl-none'}`}>
              <p className="text-sm leading-relaxed text-right whitespace-pre-wrap">{msg.content}</p>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2 max-w-[85%] ml-auto animate-pulse">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Loader2 className="h-4 w-4 text-white animate-spin" />
            </div>
            <Card className="p-4 rounded-2xl bg-primary text-white rounded-tl-none shadow-sm border-none">
              <p className="text-sm">جاري التفكير...</p>
            </Card>
          </div>
        )}
      </main>

      <div className="p-4 bg-white border-t sticky bottom-16 md:bottom-0">
        <div className="flex gap-2">
          <Button 
            className="rounded-full bg-primary w-12 h-12 p-0 shrink-0" 
            onClick={handleSend}
            disabled={isLoading}
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
          <Input 
            className="rounded-full border-muted bg-muted/30 text-right h-12 text-sm" 
            placeholder="اسألني أي شيء عن صحتك..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
