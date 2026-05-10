"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    console.log("SUPABASE_URL:", SUPABASE_URL)
    console.log("SUPABASE_KEY length:", SUPABASE_KEY?.length)

    try {
      if (mode === "signup") {
        const url = `${SUPABASE_URL}/auth/v1/signup`
        console.log("Fetching:", url)
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "apikey": SUPABASE_KEY!,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
        const text = await res.text()
        let data
        try { data = JSON.parse(text) } catch { data = { msg: text.slice(0, 100) } }
        if (!res.ok) {
          setMessage("Lỗi: " + (data.msg || data.message || "Đăng ký thất bại"))
        } else {
          setMessage("Đăng ký thành công! Kiểm tra email để xác nhận.")
        }
      } else {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers: {
            "apikey": SUPABASE_KEY!,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
        const text = await res.text()
        let data
        try { data = JSON.parse(text) } catch { data = { error_description: text.slice(0, 100) } }
        if (!res.ok) {
          setMessage("Lỗi: " + (data.error_description || data.message || "Đăng nhập thất bại"))
        } else {
          localStorage.setItem("supabase_auth_token", JSON.stringify(data))
          window.location.href = "/idea-bank"
        }
      }
    } catch (err: any) {
      setMessage("Lỗi kết nối: " + err.message)
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Studio Vân Anh</CardTitle>
          <CardDescription>
            {mode === "login" ? "Đăng nhập để quản lý content" : "Tạo tài khoản mới"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vananh@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {message && (
              <div className={`rounded-lg p-3 text-sm ${
                message.includes("thành công") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}>
                {message}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang xử lý..." : mode === "login" ? "Đăng Nhập" : "Đăng Ký"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login")
                setMessage("")
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              {mode === "login" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
