# Deploy Miễn Phí 100% - Chỉ Trả Tiền Claude API
## Studio Vân Anh

---

## Stack Miễn Phí

| Thành phần | Dịch vụ | Chi phí | Giới hạn free | Cách vượt giới hạn |
|------------|---------|---------|---------------|-------------------|
| **Frontend** | Vercel Hobby | $0 | 10s serverless, 1GB bandwidth | Edge Functions cho AI calls |
| **Database** | Supabase Free | $0 | 500MB DB, 2GB storage | Nén ảnh, chỉ lưu metadata |
| **Auth** | Supabase Auth | $0 | 50K users/tháng | Đủ dư |
| **Storage** | Supabase Storage | $0 | 2GB | Chỉ lưu avatar + ảnh nén |
| **AI APIs** | Claude API | ~$15-50/tháng | Không có free | Đây là chi phí DUY NHẤT |
| **TỔNG** | | **$15-50/tháng** | | |

---

## Vấn đề & Giải pháp

### 1. Vercel 10s Timeout (Serverless Functions)

**Vấn đề:** Claude API đôi khi mất 15-30s để trả lời → Vercel Hobby kill request sau 10s.

**Giải pháp - Chuyển AI route sang Edge Runtime:**

```typescript
// src/app/api/ai/generate-draft/route.ts
export const runtime = "edge"  // Không giới hạn 10s, chạy ở edge network

export async function POST(req: NextRequest) {
  // Edge Functions timeout: 30s (Hobby), 5 phút (Pro)
  // Đủ cho Claude API
  ...
}
```

Edge Runtime trên Vercel Hobby: **30s timeout** (thay vì 10s). Đủ cho 90% Claude calls.

### 2. Supabase 500MB Database

**Vấn đề:** Database đầy sau 6-12 tháng nếu lưu nhiều content.

**Giải pháp:**
- **Chỉ lưu text** (500 bài ≈ 5-10MB) → đủ 10+ năm
- **Không lưu ảnh trong DB** → lưu URL, ảnh để ở Supabase Storage (2GB free)
- **Xoá draft versions cũ** sau 30 ngày (giữ lại bài published)
- **Nén ảnh trước upload** → giảm 80% dung lượng

### 3. Vercel 1GB Bandwidth

**Vấn đề:** Nếu nhiều người dùng, bandwidth có thể vượt 1GB.

**Giải pháp:**
- App nội bộ (chỉ VA dùng) → 1GB đủ dư
- Nếu có team: ảnh dùng Supabase CDN (không qua Vercel)
- Static assets: dùng Cloudflare DNS proxy (miễn phí, cache toàn cầu)

---

## Cấu hình Edge Runtime cho AI APIs

### 1. Sửa AI route sang Edge

```typescript
// src/app/api/ai/generate-draft/route.ts
export const runtime = "edge"
export const maxDuration = 30  // 30 giây max

import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { topic, pillar, postType, hookPattern } = await req.json()
  
  // Gọi Claude API trực tiếp từ Edge (không qua Node.js serverless)
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CLAUDE_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    }),
  })
  
  const data = await response.json()
  return NextResponse.json({ draft: data.content[0]?.text })
}
```

### 2. Middleware cũng chuyển Edge

```typescript
// src/middleware.ts
export const runtime = "edge"

export async function middleware(request: NextRequest) {
  // Chạy ở edge, không tốn serverless execution time
  ...
}
```

### 3. Supabase Client cho Edge

```typescript
// lib/supabase/edge.ts
import { createClient } from "@supabase/supabase-js"

export function createEdgeClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,  // Edge không lưu session
        autoRefreshToken: false,
      },
    }
  )
}
```

---

## Cách deploy miễn phí

### 1. GitHub Repository (miễn phí)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/you/studio-van-anh.git
git push -u origin main
```

### 2. Vercel (miễn phí)
1. Vào https://vercel.com/new
2. Import GitHub repo
3. Framework Preset: Next.js
4. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `CLAUDE_API_KEY`
5. Deploy → có URL miễn phí: `studio-van-anh.vercel.app`

### 3. Supabase (miễn phí)
1. Vào https://supabase.com
2. Tạo project mới
3. SQL Editor → chạy migration `001_initial_schema.sql`
4. Copy Project URL + Anon Key → paste vào Vercel env vars

---

## Ưu điểm & Nhược điểm

### Ưu điểm
- ✅ **$0 server cost** trong 6-12 tháng đầu
- ✅ Chỉ trả Claude API (~$20/tháng)
- ✅ Vẫn có PostgreSQL + pgvector đầy đủ
- ✅ Edge Functions 30s → đủ cho AI generation
- ✅ Auto-deploy từ GitHub

### Nhược điểm
- ⚠️ Nếu AI call >30s → timeout (hiếm, Claude thường 5-15s)
- ⚠️ Database 500MB → cần dọn dẹp định kỳ (script xoá draft cũ)
- ⚠️ Không có backup tự động (Supabase free không backup)

---

## Khi nào cần nâng cấp?

| Tín hiệu | Nâng lên | Chi phí thêm |
|----------|----------|--------------|
| Database >400MB | Supabase Pro | +$25/tháng |
| Bandwidth >900MB | Vercel Pro | +$20/tháng |
| AI timeout thường xuyên | Vercel Pro (5 phút) | +$20/tháng |
| Team >3 người | Vercel Pro + Supabase Pro | +$45/tháng |

**Dự kiến:** 6-12 tháng đầu hoàn toàn miễn phí server.

---

## Backup dữ liệu miễn phí (tự làm)

Vì Supabase free không có backup, tự backup bằng GitHub Actions:

```yaml
# .github/workflows/backup.yml
name: Backup Database
on:
  schedule:
    - cron: '0 2 * * 0'  # Mỗi Chủ Nhật 2AM
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Backup Supabase
        run: |
          pg_dump $SUPABASE_URL > backup-$(date +%Y%m%d).sql
          # Upload lên GitHub Releases hoặc Google Drive
```

---

## Tóm lại

**CÓ THỂ MIỄN PHÍ 100% SERVER.** Chỉ cần:
1. Vercel Hobby (free)
2. Supabase Free (500MB)
3. Chuyển AI routes sang Edge Runtime (30s timeout)
4. Chỉ trả Claude API (~$15-50/tháng tùy số bài)

**Chi phí thực tế MVP:** $20/tháng (chỉ Claude API cho 30 bài).
