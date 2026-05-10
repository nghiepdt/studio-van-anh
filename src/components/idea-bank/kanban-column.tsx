"use client"

import { cn } from "@/lib/utils"
import { IdeaCard } from "./idea-card"

interface KanbanColumnProps {
  title: string
  maturity: string
  ideas: any[]
  count: number
  onCardClick: (idea: any) => void
}

const columnColors: Record<string, string> = {
  raw: "border-yellow-200 bg-yellow-50/50",
  developing: "border-blue-200 bg-blue-50/50",
  ready: "border-green-200 bg-green-50/50",
}

const headerColors: Record<string, string> = {
  raw: "bg-yellow-100 text-yellow-800",
  developing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
}

const labels: Record<string, string> = {
  raw: "Mới",
  developing: "Đang phát triển",
  ready: "Sẵn sàng",
}

export function KanbanColumn({ title, maturity, ideas, count, onCardClick }: KanbanColumnProps) {
  return (
    <div className={cn("flex flex-col rounded-lg border-2", columnColors[maturity])}>
      <div className={cn("flex items-center justify-between rounded-t-md px-4 py-2", headerColors[maturity])}>
        <span className="font-semibold text-sm">{labels[maturity] || title}</span>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium">{count}</span>
      </div>
      
      <div className="flex flex-col gap-3 p-3 min-h-[200px]">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} onClick={() => onCardClick(idea)} />
        ))}
      </div>
    </div>
  )
}
