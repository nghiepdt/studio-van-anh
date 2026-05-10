# Studio Vân Anh - Hệ thống quản lý Content + AI

**Stack miễn phí server** — chỉ trả tiền Claude API (~$20/tháng cho 30 bài)

| Thành phần | Dịch vụ | Chi phí |
|------------|---------|---------|
| Frontend | [Vercel Hobby](https://vercel.com) | **$0** |
| Database | [Supabase Free](https://supabase.com) | **$0** |
| AI | [Claude API](https://anthropic.com) | ~$20/tháng |
| **TỔNG** | | **~$20/tháng** |

---

## Chức năng chính

- **Kho Ý Tưởng** — Kanban board (raw → developing → ready), filters, search
- **Draft Editor** — AI viết bài theo giọng Vân Anh, Style Checker 6 rules
- **Thiết Kế** — Quote cards (placeholder)
- **Lịch Đăng** — Calendar view (placeholder)
- **Xuất Bản** — Publish queue (placeholder)
- **Hiệu Quả** — Metrics dashboard (placeholder)

---

## Deploy trong 5 phút

### Bước 1: Supabase (Database)

1. Vào [supabase.com](https://supabase.com) → Tạo project mới
2. SQL Editor → New query → Paste nội dung file:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Chạy query (Run) → Database + RLS + seed data được tạo
4. Vào Project Settings → API → copy:
   - `Project URL` (vd: `https://abc123.supabase.co`)
   - `anon public` key

### Bước 2: Vercel (Frontend + API)

1. Push code lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/studio-van-anh.git
   git push -u origin main
   ```

2. Vào [vercel.com/new](https://vercel.com/new)
3. Import GitHub repo `studio-van-anh`
4. Framework Preset: **Next.js**
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   CLAUDE_API_KEY=sk-ant-your-claude-key
   ```
6. Deploy → có URL miễn phí: `https://studio-van-anh.vercel.app`

### Bước 3: Claude API Key

1. Vào [console.anthropic.com](https://console.anthropic.com)
2. Tạo API key → paste vào Vercel env var `CLAUDE_API_KEY`
3. Redeploy (hoặc Vercel tự động khi update env)

---

## Chạy local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Lưu ý:** Cần tạo file `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
CLAUDE_API_KEY=
```

---

## Free Tier Limits

| Dịch vụ | Giới hạn free | Đủ dùng? |
|---------|---------------|----------|
| Vercel Hobby | 10s serverless, 1GB bandwidth | ✅ Edge Runtime 30s cho AI |
| Supabase DB | 500MB | ✅ ~10 năm nếu chỉ lưu text |
| Supabase Storage | 2GB | ✅ Ảnh nén |
| Claude API | Không free tier | ~$20/tháng (30 bài) |

---

## Backup Database

Backup tự động qua GitHub Actions (mỗi Chủ Nhật):

1. Vào GitHub repo → Settings → Secrets → New repository secret
2. Tạo secret: `SUPABASE_DB_URL` = connection string từ Supabase (Database → Connection string)
3. Workflow chạy tự động → backup file `.sql` được lưu làm artifact

Hoặc chạy thủ công: Actions → Backup Supabase Database → Run workflow

---

## Cấu trúc thư mục

```
studio-van-anh/
├── src/
│   ├── app/(dashboard)/     # 6 màn hình chính
│   ├── app/api/ai/          # AI proxy (Edge Runtime)
│   ├── components/            # UI components + Kanban
│   ├── lib/supabase/          # Client + Server + Actions
│   └── types/               # TypeScript types
├── supabase/migrations/       # Database schema
├── docs/                      # Tài liệu deploy & so sánh
└── .github/workflows/         # Backup automation
```

---

## Khi nào cần nâng cấp?

| Tín hiệu | Nâng lên | Chi phí |
|----------|----------|---------|
| Database >400MB | Supabase Pro | +$25/tháng |
| Bandwidth >900MB | Vercel Pro | +$20/tháng |
| AI timeout >30s | Vercel Pro | +$20/tháng (5 phút) |

**Dự kiến:** 6-12 tháng đầu hoàn toàn miễn phí server.

---

## Tài liệu tham khảo

- [Deploy miễn phí chi tiết](./docs/deploy-mien-phi.md)
- [So sánh chi phí deploy](./docs/so-sanh-chi-phi-deploy.md)
- [Voice Style Guide](../voice-style-guide.md) — Prompt cho AI
