export interface Idea {
  id: string
  title: string
  content: string
  pillar: "khach-quay-lai" | "leadership" | "van-hanh"
  post_type: string
  maturity: "raw" | "developing" | "ready"
  created_at: string
  updated_at: string
}

export interface Draft {
  id: string
  idea_id: string
  content: string
  ai_generated: boolean
  status: "draft" | "reviewing" | "approved"
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  draft_id: string
  content: string
  platform: "facebook" | "fanpage"
  scheduled_at?: string
  published_at?: string
  status: "scheduled" | "published" | "failed"
  created_at: string
}

export interface PerformanceMetric {
  id: string
  post_id: string
  reach: number
  likes: number
  comments: number
  shares: number
  saves: number
  recorded_at: string
}
