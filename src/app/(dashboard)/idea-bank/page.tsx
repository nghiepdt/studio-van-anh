"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getIdeas } from "@/lib/supabase/actions"
import { KanbanColumn } from "@/components/idea-bank/kanban-column"
import { FilterBar } from "@/components/idea-bank/filter-bar"
import { AddIdeaModal } from "@/components/idea-bank/add-idea-modal"

export default function IdeaBankPage() {
  const [ideas, setIdeas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({})

  const loadIdeas = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getIdeas(filters)
      setIdeas(data || [])
    } catch (error) {
      console.error("Failed to load ideas:", error)
      setIdeas([])
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadIdeas()
  }, [loadIdeas])

  const rawIdeas = ideas.filter((i) => i.maturity === "raw")
  const developingIdeas = ideas.filter((i) => i.maturity === "developing")
  const readyIdeas = ideas.filter((i) => i.maturity === "ready")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kho Ý Tưởng</h2>
          <p className="text-muted-foreground">
            {isLoading ? "Đang tải..." : `${ideas.length} ý tưởng`}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm ý tưởng
        </Button>
      </div>

      <FilterBar onFilterChange={setFilters} />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <KanbanColumn
            title="Mới"
            maturity="raw"
            ideas={rawIdeas}
            count={rawIdeas.length}
            onCardClick={(idea) => console.log("Clicked:", idea)}
          />
          <KanbanColumn
            title="Đang phát triển"
            maturity="developing"
            ideas={developingIdeas}
            count={developingIdeas.length}
            onCardClick={(idea) => console.log("Clicked:", idea)}
          />
          <KanbanColumn
            title="Sẵn sàng"
            maturity="ready"
            ideas={readyIdeas}
            count={readyIdeas.length}
            onCardClick={(idea) => console.log("Clicked:", idea)}
          />
        </div>
      )}

      <AddIdeaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadIdeas}
      />
    </div>
  )
}
