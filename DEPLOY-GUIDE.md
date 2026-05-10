# Hướng Dẫn Deploy Studio Vân Anh — Từng Bước

Repo: https://github.com/nghiepdt/studio-van-anh

---

## BƯỚC 1: Deploy Vercel (2 phút)

1. Mở trình duyệt → Vào https://vercel.com/new
2. Click nút **"Continue with GitHub"** → Đăng nhập GitHub
3. Tìm repo `studio-van-anh` → Click **Import**
4. Trang cấu hình hiện ra:
   - Project Name: `studio-van-anh` (giữ nguyên)
   - Framework Preset: `Next.js` (tự nhận)
   - Root Directory: `./` (giữ nguyên)
5. Kéo xuống phần **Environment Variables** → Add từng biến:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | (để trống) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (để trống) |
   | `CLAUDE_API_KEY` | (để trống) |

6. Click **Deploy**
7. Đợi 1-2 phút → Thấy chữ **"Congratulations!"** → Click **Continue to Dashboard**
8. Copy URL: `https://studio-van-anh-xxx.vercel.app`

**Lưu URL này lại.**

---

## BƯỚC 2: Tạo Supabase Database (3 phút)

1. Mở tab mới → https://supabase.com
2. Click **"Start your project"** → Sign in bằng GitHub
3. Click **"New project"**
   - Organization: (chọn default)
   - Project name: `studio-van-anh`
   - Database password: Đặt mật khẩu (ghi nhớ!)
   - Region: **Southeast Asia (Singapore)** ← Chọn gần Việt Nam nhất
4. Click **"Create new project"** → Đợi 1-2 phút

### 2a. Chạy migration (tạo database)

5. Project mở ra → Click **"SQL Editor"** ở menu trái
6. Click **"New query"**
7. Mở file trên máy:
   ```
   G:\3 - Claude\05 - DỰ ÁN LÀM WEB\studio-van-anh\supabase\migrations\001_initial_schema.sql
   ```
   Copy toàn bộ nội dung → Paste vào SQL Editor
8. Click **"Run"** (nút xanh)
9. Thấy thông báo "Success. No rows returned" → Database đã tạo xong!

### 2b. Lấy API keys

10. Click **"Project Settings"** (góc trái dưới, hình bánh răng)
11. Click **"API"**
12. Copy 2 giá trị:
    - `Project URL` (vd: `https://abc123.supabase.co`)
    - `anon public` key (dài, bắt đầu bằng `eyJ...`)

**Lưu 2 giá trị này.**

---

## BƯỚC 3: Kết nối Vercel + Supabase (1 phút)

1. Quay lại tab Vercel Dashboard
2. Click tab **"Settings"** → **"Environment Variables"**
3. Update 2 biến (click Edit từng cái):

   | Key | Value (paste vào) |
   |-----|-------------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://abc123.supabase.co` (Project URL từ Bước 2) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (anon key từ Bước 2) |

4. Click **Save**
5. Vercel tự động redeploy (đợi 30 giây)

---

## BƯỚC 4: Lấy Claude API Key (1 phút)

1. Mở tab mới → https://console.anthropic.com
2. Sign up / Sign in
3. Click **"Get API keys"** → **"Create Key"**
4. Đặt tên: `Studio Van Anh`
5. Copy key (bắt đầu bằng `sk-ant-...`)
6. Quay lại Vercel → Environment Variables
7. Update: `CLAUDE_API_KEY` = `sk-ant-...` (paste vào)
8. Save → Đợi redeploy

---

## KIỂM TRA

Mở URL từ Bước 1 (dạng `https://studio-van-anh-xxx.vercel.app`):

- ✅ Thấy trang login → OK
- ✅ Sign up bằng email → OK
- ✅ Vào `/idea-bank` → Thấy Kanban board → OK
- ✅ Vào `/draft-editor` → Thấy AI viết bài → OK

---

## NẾU LỖI

| Lỗi | Cách fix |
|-----|----------|
| "Supabase URL required" | Check lại Bước 3, copy đúng URL |
| "Failed to generate draft" | Check `CLAUDE_API_KEY` đúng chưa, còn credits? |
| "Build failed" | Vercel Dashboard → Deployments → xem lỗi chi tiết |
| Không thấy dữ liệu | Supabase SQL Editor chạy lại migration |

---

## TÔNG KẾT CHI PHÍ

| Thành phần | Chi phí |
|------------|---------|
| Vercel Hobby | **$0** |
| Supabase Free | **$0** |
| Claude API | **~$20/tháng** (30 bài) |
| **TỔNG** | **~$20/tháng** |

---

## SUPPORT

Nếu gặp lỗi, copy lỗi và báo tôi. Tôi sẽ fix code và bạn push lại.
