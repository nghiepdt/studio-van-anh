"use client"

import { cn } from "@/lib/utils"
import { Lightbulb, MessageSquare, Calendar } from "lucide-react"

interface IdeaCardProps {
  idea: {
    id: string
    title: string
    content?: string
    pillar: string
    post_type?: string
    maturity: string
    created_at: string
  }
  onClick: () => void
}

const pillarColors: Record<string, string> = {
  "khach-quay-lai": "bg-blue-100 text-blue-700 border-blue-200",
  leadership: "bg-green-100 text-green-700 border-green-200",
  "van-hanh": "bg-purple-100 text-purple-700 border-purple-200",
  "ca-nhan": "bg-orange-100 text-orange-700 border-orange-200",
}

const pillarLabels: Record<string, string> = {
  "khach-quay-lai": "Khách quay lại",
  leadership: "Leadership",
  "van-hanh": "Vận hành",
  "ca-nhan": "Cá nhân",
}

const maturityEmojis: Record<string, string> = {
  raw: "💡",
  developing: "🔨",
  ready: "✅",
}

export function IdeaCard({ idea, onClick }: IdeaCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all hover:shadow-md",
        "hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm leading-snug line-clamp-2">{idea.title}</h4>
        <span className="text-xs shrink-0">{maturityEmojis[idea.maturity] || "💡"}</span>
      </div>
      
      {idea.content && (
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{idea.content}</p>
      )}
      
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", pillarColors[idea.pillar])}>
          {pillarLabels[idea.pillar] || idea.pillar}
        </span>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(idea.created_at).toLocaleDateString("vi-VN")}
        </div>
      </div>
      
      {idea.post_type && (
        <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MessageSquare className="h-3 w-3" />
          {idea.post_type}
        </div>
      )}
    </div>
  )
}
