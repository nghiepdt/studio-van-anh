"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"

interface FilterBarProps {
  onFilterChange: (filters: {
    pillar?: string
    post_type?: string
    maturity?: string
    search?: string
  }) => void
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState("")
  const [pillar, setPillar] = useState("")
  const [maturity, setMaturity] = useState("")

  function handleSearchChange(value: string) {
    setSearch(value)
    onFilterChange({ pillar, maturity, search: value })
  }

  function handlePillarChange(value: string) {
    setPillar(value)
    onFilterChange({ pillar: value, maturity, search })
  }

  function handleMaturityChange(value: string) {
    setMaturity(value)
    onFilterChange({ pillar, maturity: value, search })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Tìm kiếm ý tưởng..."
          className="pl-9"
        />
      </div>

      <select
        value={pillar}
        onChange={(e) => handlePillarChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">Tất cả pillar</option>
        <option value="khach-quay-lai">Khách quay lại</option>
        <option value="leadership">Leadership</option>
        <option value="van-hanh">Vận hành</option>
        <option value="ca-nhan">Cá nhân</option>
      </select>

      <select
        value={maturity}
        onChange={(e) => handleMaturityChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">Tất cả maturity</option>
        <option value="raw">Mới</option>
        <option value="developing">Đang phát triển</option>
        <option value="ready">Sẵn sàng</option>
      </select>
    </div>
  )
}
