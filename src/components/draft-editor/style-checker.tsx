"use client"

import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface StyleCheckerProps {
  content: string
}

interface CheckItem {
  label: string
  check: (text: string) => boolean
  hint: string
}

const checks: CheckItem[] = [
  {
    label: "Có hook mở bài",
    check: (text) => /(Không phải|Bạn có|Tại sao|Sự thật là|Nếu bạn|Đừng)/i.test(text.slice(0, 200)),
    hint: "Hook nên có trong 200 ký tự đầu: 'Không phải...', 'Bạn có...', 'Tại sao...'",
  },
  {
    label: "Có ít nhất 2 scene 🫧",
    check: (text) => (text.match(/🫧/g) || []).length >= 2,
    hint: "Thêm ít nhất 2 scene với emoji 🫧",
  },
  {
    label: "Có bold unicode keyword",
    check: (text) => /𝐚|�|𝐜|𝐝|𝐞|𝐟|𝐠|𝐡|𝐢|𝐣|𝐤|𝐥|𝐦|𝐧|𝐨|𝐩|𝐪|𝐫|𝐬|𝐭|𝐮|𝐯|𝐰|𝐱|𝐲|�𝐳|𝐀|𝐁|𝐂|𝐃|𝐄|𝐅|𝐆|𝐇|𝐈|𝐉|𝐊|𝐋|𝐌|𝐍|𝐎|𝐏|𝐐|𝐑|𝐒|𝐓|𝐔|𝐕|𝐖|𝐗|𝐘|𝐙/.test(text),
    hint: "Thêm bold unicode cho 2-3 keyword quan trọng (VD: 𝐭𝐞𝐱𝐭)",
  },
  {
    label: "Có divider ——————",
    check: (text) => /——————/.test(text),
    hint: "Thêm '——————' để ngăn cách các phần",
  },
  {
    label: "Có closing scenario hoặc ký VAB",
    check: (text) => /(Năm sau|Một ngày|Khi bạn|—VA|VAB\.)/i.test(text.slice(-300)),
    hint: "Kết bài bằng scenario tương lai hoặc ký '—VA' hoặc 'VAB.'",
  },
  {
    label: "Emoji đúng quy tắc (≤12)",
    check: (text) => {
      const emojis = text.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu)
      return (emojis?.length || 0) <= 12 && (emojis?.length || 0) > 0
    },
    hint: "Dùng 1-12 emoji: 🫧 🔥 ➖ ✧ 👉 📣 🚩 ☑️ 🗝️ 🤎 〰️ 🫣",
  },
]

export function StyleChecker({ content }: StyleCheckerProps) {
  if (!content) {
    return (
      <div className="rounded-lg border bg-muted/50 p-4">
        <h3 className="mb-3 font-semibold">Style Checker</h3>
        <p className="text-sm text-muted-foreground">Nhập nội dung bài viết để kiểm tra...</p>
      </div>
    )
  }

  const passed = checks.filter((c) => c.check(content)).length

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Style Checker</h3>
        <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
          {passed}/{checks.length} ✓
        </span>
      </div>

      <div className="space-y-2">
        {checks.map((item, index) => {
          const isPass = item.check(content)
          return (
            <div
              key={index}
              className={`flex items-start gap-2 rounded-md p-2 text-sm ${
                isPass ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"
              }`}
            >
              {isPass ? (
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              )}
              <div>
                <span className="font-medium">{item.label}</span>
                {!isPass && <p className="mt-0.5 text-xs opacity-80">{item.hint}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
