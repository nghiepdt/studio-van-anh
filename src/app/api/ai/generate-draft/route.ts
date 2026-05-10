export const runtime = "edge"
export const maxDuration = 30  // 30 giây cho free tier (thay vì 10s)

import { NextRequest, NextResponse } from "next/server"

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"

export async function POST(req: NextRequest) {
  try {
    const { topic, pillar, postType, hookPattern } = await req.json()

    const systemPrompt = `Bạn là trợ lý viết content cho Vân Anh (VAB), founder Page Hải Phòng Media.

TONE: Chân thật, nói thẳng, không sến, không FOMO. Kiểu "chị đi trước kể cho em nghe".
Triết lý: Nuôi dưỡng (vun trồng) chứ không săn bắt.
Chủ ngữ mặc định: "mình" (60%). Dùng "bạn" khi hướng tới audience (25%). Dùng "tôi" khi cần authority nặng (10%).

CẤU TRÚC BÀI:
1. Hook: Tuyên ngôn sắc / Contrarian Opinion / Mini-Confession (1-2 dòng, bold unicode)
2. ——————
3. Scenes 🫧: 2-4 cảnh đời thường, có chi tiết cảm giác
4. ——————
5. Insight: Giải thích TẠI SAO scenes đó xảy ra (4-8 dòng, bold keyword)
6. Closing: Câu hỏi kết + CTA HOẶC Scenario tương lai
7. Ký: VAB. (riêng dòng, có dấu chấm)

QUY TẮC:
- Mỗi scene bắt đầu bằng 🫧
- Câu hỏi nội tâm dùng italic
- Keyword quan trọng dùng bold unicode (𝐭𝐞𝐱𝐭) — chỉ 2-3 từ/đoạn
- Không dùng "các bạn", "anh chị em", "em"
- Emoji tối đa 12/bài: 🫧 🔥 ➖ ✧ 👉 📣 🚩 ☑️ 🗝️ 🤎 〰️ 🫣
- Paragraph 2-3 câu, 1 line break giữa paragraph
- Độ dài: 500-900 từ

THÔNG TIN THƯƠNG HIỆU:
- Tên: Page Hải Phòng Media
- Dịch vụ: Phòng kinh doanh thuê ngoài (độc quyền 5-10km, khép kín 4 điểm chạm KH)
- Đối lập: Agency Marketing thuần (chỉ vòng ngoài, không chịu trách nhiệm doanh số)
- Khách hàng: SMEs Hải Phòng (hoa, spa, F&B, salon...), chủ đi lên từ chuyên môn`

    const userPrompt = `Viết 1 bài Facebook về chủ đề: "${topic}"
Pillar: ${pillar}
Dạng bài: ${postType}
Hook pattern: ${hookPattern}

Hãy viết bài theo đúng cấu trúc và giọng văn của Vân Anh.`

    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error }, { status: response.status })
    }

    const data = await response.json()
    const draftContent = data.content[0]?.text || ""

    return NextResponse.json({ draft: draftContent })
  } catch (error) {
    console.error("AI generate error:", error)
    return NextResponse.json(
      { error: "Failed to generate draft" },
      { status: 500 }
    )
  }
}
