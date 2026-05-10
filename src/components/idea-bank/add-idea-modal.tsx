"use client"

import { useState } from "react"
import { createIdea } from "@/lib/supabase/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"

interface AddIdeaModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddIdeaModal({ isOpen, onClose, onSuccess }: AddIdeaModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    pillar: "khach-quay-lai",
    post_type: "",
    maturity: "raw",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsLoading(true)
    try {
      await createIdea(formData)
      setFormData({ title: "", content: "", pillar: "khach-quay-lai", post_type: "", maturity: "raw" })
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Failed to create idea:", error)
      alert("Lỗi khi tạo ý tưởng")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Thêm ý tưởng mới</h3>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề ý tưởng..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nội dung</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Mô tả ý tưởng..."
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pillar</label>
              <select
                value={formData.pillar}
                onChange={(e) => setFormData({ ...formData, pillar: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="khach-quay-lai">Khách quay lại</option>
                <option value="leadership">Leadership</option>
                <option value="van-hanh">Vận hành</option>
                <option value="ca-nhan">Cá nhân</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Dạng bài</label>
              <Input
                value={formData.post_type}
                onChange={(e) => setFormData({ ...formData, post_type: e.target.value })}
                placeholder="VD: Soi gương nỗi đau"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Maturity</label>
            <select
              value={formData.maturity}
              onChange={(e) => setFormData({ ...formData, maturity: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="raw">Mới (raw)</option>
              <option value="developing">Đang phát triển</option>
              <option value="ready">Sẵn sàng</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              {isLoading ? "Đang tạo..." : "Tạo ý tưởng"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
