# So sánh chi phí deploy & AI learning capability
## Studio Vân Anh - Tháng 5/2026

---

## OPTION A: Vercel + Supabase (RECOMMENDED)

| Thành phần | Chi phí/tháng | Giới hạn free | Ghi chú |
|------------|---------------|---------------|---------|
| **Vercel Pro** | $20/tháng | Hobby (free) giới hạn 10s serverless, 1GB bandwidth | Pro = 5TB bandwidth, 15s serverless |
| **Supabase Free** | $0 | 500MB DB, 2GB storage, 150K edge func invocations | Đủ cho 1 user VA trong 6-12 tháng đầu |
| **Supabase Pro** | $25/tháng | 8GB DB, 100GB storage, 500K edge func | Khi vượt giới hạn free |
| **Claude API** | ~$15-50/tháng | Không có free tier | ~$3/1M input tokens, $15/1M output tokens. 30 bài/tháng ≈ $20 |
| **Tổng ước tính** | **$20-65/tháng** | Free tier: $15-50/tháng (chỉ tốn Claude) | |

### AI Learning Capability: ⭐⭐⭐⭐⭐
- ✅ PostgreSQL + JSONB → lưu voice rules phức tạp
- ✅ pgvector → semantic search bài viết tương tự
- ✅ Draft versions → AI học từ sửa đổi của VA
- ✅ Performance metrics → feedback loop cho AI
- ✅ Realtime → collaborative (nếu có team sau này)
- ✅ Row Level Security → an toàn dữ liệu

### Ưu điểm
- Next.js 16 native, App Router hoàn chỉnh
- Middleware, Server Actions, ISR hoạt động tốt
- Database chuyên nghiệp cho AI workloads
- Deploy chỉ cần `git push`

### Nhược điểm
- Tốn tiền khi scale (nhưng đến lúc đó đã có doanh thu)

---

## OPTION B: Cloudflare Pages + D1/KV + R2

| Thành phần | Chi phí/tháng | Giới hạn free | Ghi chú |
|------------|---------------|---------------|---------|
| **Cloudflare Pages** | $0 (free) | Unlimited requests, 500 builds/tháng | |
| **Cloudflare D1** | $0 | 500K rows, 5GB storage | SQLite edge, KHÔNG có pgvector |
| **Cloudflare KV** | $0 | 1GB storage, 100K reads/day | Key-value đơn giản |
| **Cloudflare R2** | $0 | 10GB storage | Object storage (ảnh, file) |
| **Claude API** | ~$15-50/tháng | Không có free tier | Tương tự Option A |
| **Tổng ước tính** | **$15-50/tháng** | | |

### AI Learning Capability: ⭐⭐ (Rất yếu)
- ❌ KHÔNG có pgvector → AI không tìm được bài viết tương tự
- ❌ D1 là SQLite → JSON support yếu, không lưu được voice rules phức tạp
- ❌ KV chỉ key-value → không filter, không join
- ❌ Không có draft versions history
- ❌ Performance metrics không có time-series
- ⚠️ Cần viết lại nhiều code cho D1/KV API

### Ưu điểm
- Rẻ nhất có thể (miễn phí hầu hết)
- Edge network nhanh toàn cầu
- Không lo bandwidth limit

### Nhược điểm
- **Không phù hợp cho AI learning app** - đây là dealbreaker
- Next.js 16 không support (phải hạ xuống 15)
- D1 còn beta, limited features
- Code phức tạp hơn nhiều để workaround database yếu

---

## OPTION C: Vercel + Supabase + Cloudflare AI Gateway (HYBRID)

| Thành phần | Chi phí/tháng | Giới hạn free | Ghi chú |
|------------|---------------|---------------|---------|
| **Vercel Pro** | $20/tháng | | Như Option A |
| **Supabase Free/Pro** | $0-25/tháng | | Như Option A |
| **Cloudflare AI Gateway** | $0 | 100K requests/tháng free | Cache + rate limit AI calls |
| **Claude API (qua Gateway)** | ~$10-35/tháng | | **Giảm 30-50%** nhờ cache |
| **Tổng ước tính** | **$20-80/tháng** | Free tier: $10-35/tháng | |

### AI Learning Capability: ⭐⭐⭐⭐⭐ (NHƯ A + tối ưu chi phí AI)
- ✅ Tất cả capabilities của Option A
- ✅ **AI Gateway cache** → các prompt giống nhau trả về từ cache, không tốn tiền Claude
- ✅ **Rate limiting** → tránh bị quota, tránh bill shock
- ✅ **Analytics** → biết API call nào tốn tiền nhất
- ✅ **Fallback** → nếu Claude lỗi, có thể dùng model khác qua Gateway

### Ưu điểm
- Tốt nhất cho AI learning + tối ưu chi phí AI
- Giảm 30-50% bill Claude nhờ cache
- Vẫn giữ full Next.js 16 + Supabase

### Nhược điểm
- Setup thêm 1 service (AI Gateway)
- Tổng chi phí cao hơn Option B

---

## So sánh trực tiếp: Chi phí theo giai đoạn

### Giai đoạn 1: MVP (1 user VA, 30 bài/tháng)

| Option | Vercel | Database | AI | Tổng/tháng |
|--------|--------|----------|-----|------------|
| **A. Vercel + Supabase Free** | $0 (Hobby) | $0 | ~$20 | **$20** |
| **B. Cloudflare** | $0 | $0 | ~$20 | **$20** |
| **C. Hybrid + Gateway** | $0 (Hobby) | $0 | ~$14 (cache 30%) | **$14** |

→ **Giai đoạn 1**: Option B rẻ bằng A, C rẻ hơn 30%. Nhưng B không có AI learning.

### Giai đoạn 2: Scale (2-3 users, 100 bài/tháng)

| Option | Vercel | Database | AI | Tổng/tháng |
|--------|--------|----------|-----|------------|
| **A. Vercel + Supabase** | $20 (Pro) | $0 (vẫn free) | ~$50 | **$70** |
| **B. Cloudflare** | $0 | $0 (D1 giới hạn 500K rows) | ~$50 | **$50** |
| **C. Hybrid + Gateway** | $20 (Pro) | $0 | ~$35 (cache 30%) | **$55** |

→ **Giai đoạn 2**: B rẻ nhưng database có thể đầy. C tối ưu AI cost tốt nhất.

### Giai đoạn 3: Production (team, 500+ bài/tháng)

| Option | Vercel | Database | AI | Tổng/tháng |
|--------|--------|----------|-----|------------|
| **A. Vercel + Supabase Pro** | $20 | $25 | ~$200 | **$245** |
| **B. Cloudflare** | $0 | $5 (D1 paid) | ~$200 | **$205** |
| **C. Hybrid + Gateway** | $20 | $25 | ~$140 (cache 30%) | **$185** |

→ **Giai đoạn 3**: C rẻ nhất nhờ AI cache, nhưng cần trả Supabase Pro.

---

## Đề xuất cuối cùng

| Tiêu chí | Option phù hợp |
|----------|-----------------|
| **AI học giọng văn thực sự** | **A hoặc C** (B không đáp ứng được) |
| **Rẻ nhất trong 6 tháng đầu** | **A free tier** = $20/tháng (chỉ tốn Claude) |
| **Tối ưu chi phí AI dài hạn** | **C** (Hybrid + AI Gateway) |
| **Đơn giản, ít service nhất** | **A** (Vercel + Supabase) |
| **Có credit Cloudflare muốn dùng** | **C** (dùng Gateway free tier) |

### MY RECOMMENDATION: OPTION A (Vercel + Supabase Free)

**Lý do:**
1. Free tier đủ cho 6-12 tháng đầu (chỉ tốn ~$20/tháng Claude API)
2. Không cần sửa code, không cần hạ Next.js 16
3. AI learning hoạt động đầy đủ ngay từ đầu
4. Khi scale, nâng lên Pro dần (Vercel $20 + Supabase $25 = $45/tháng)
5. Sau 6 tháng, nếu AI bill cao, thêm Cloudflare AI Gateway (Option C)

**Không nên chọn B vì:** AI không học được từ D1/KV. Mục tiêu chính của app là AI viết giống VA → cần database mạnh.

---

## Tham khảo giá (tháng 5/2026)

- Vercel Pricing: https://vercel.com/pricing
- Supabase Pricing: https://supabase.com/pricing
- Cloudflare AI Gateway: https://developers.cloudflare.com/ai-gateway/
- Claude API: https://www.anthropic.com/api
