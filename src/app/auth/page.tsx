import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Studio Vân Anh</CardTitle>
          <CardDescription>Đăng nhập để quản lý content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="vananh@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mật khẩu</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Đăng Nhập</Button>
          <p className="text-center text-sm text-muted-foreground">
            Hoặc đăng nhập bằng Magic Link
          </p>
          <Button variant="outline" className="w-full">
            Gửi Link Đăng Nhập
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
