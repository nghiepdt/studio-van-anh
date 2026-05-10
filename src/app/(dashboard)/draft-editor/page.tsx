"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wand2, Save, Loader2, RefreshCw } from "lucide-react"
import { useAIGenerate } from "@/lib/hooks/use-ai-generate"
import { StyleChecker } from "@/components/draft-editor/style-checker"

export default function DraftEditorPage() {
  const [topic, setTopic] = useState("")
  const [pillar, setPillar] = useState("khach-quay-lai")
  const [postType, setPostType] = useState("Soi gương nỗi đau")
  const [hookPattern, setHookPattern] = useState("Contrarian Opinion")
  const [content, setContent] = useState("")
  const { generateDraft, isLoading, error } = useAIGenerate()

  const handleGenerate = async () => {
    if (!topic.trim()) return
    const draft = await generateDraft({ topic, pillar, postType, hookPattern })
    if (draft) setContent(draft)
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Viết Bài</h2>
          <p className="text-muted-foreground">AI viết bài theo giọng Vân Anh</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Đang viết..." : "AI Viết Bài"}
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Lưu Bản Nháp
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin bài viết</CardTitle>
              <CardDescription>Chọn pillar, dạng bài, hook pattern</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Chủ đề *</label>
                <input 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  placeholder="VD: Sai lầm khi giảm giá liên tục"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pillar</label>
                <select 
                  value={pillar}
                  onChange={(e) => setPillar(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="khach-quay-lai">Khách quay lại</option>
                  <option value="leadership">Leadership</option>
                  <option value="van-hanh">Vận hành</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dạng bài</label>
                <select 
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option>Soi gương nỗi đau</option>
                  <option>Mini-Confession</option>
                  <option>Framework Drop</option>
                  <option>Contrarian Opinion</option>
                  <option>Case Study</option>
                  <option>Behind the Scenes</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hook Pattern</label>
                <select 
                  value={hookPattern}
                  onChange={(e) => setHookPattern(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option>Contrarian Opinion</option>
                  <option>Mini-Confession</option>
                  <option>Controversial Question</option>
                  <option>Framework Drop</option>
                  <option>Data Drop</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <StyleChecker content={content} />
        </div>
        
        {/* Center & Right: Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bản nháp</CardTitle>
                <CardDescription>
                  {wordCount} từ · {content.length} ký tự
                </CardDescription>
              </div>
              {content && (
                <Button variant="ghost" size="sm" onClick={() => setContent("")}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[500px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed font-mono"
                placeholder={`Nhập nội dung bài viết...

Hoặc nhấn "AI Viết Bài" để AI tự sinh theo giọng Vân Anh.

Cấu trúc chuẩn:
1. Hook (1-2 dòng, bold)
2. ——————
3. Scenes 🫧 (2-4 cảnh)
4. ——————
5. Insight (4-8 dòng, bold keyword)
6. Closing + Ký VAB.`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
