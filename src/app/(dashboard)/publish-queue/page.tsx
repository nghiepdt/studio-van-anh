import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, CheckCircle, Clock } from "lucide-react"

export default function PublishQueuePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Xuất Bản</h2>
          <p className="text-muted-foreground">Quản lý bài đăng Facebook</p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Đăng Bài Ngay
        </Button>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Bài đã lên lịch</CardTitle>
              <CardDescription>10/05/2026 - 20:00</CardDescription>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">Sai lầm lớn của chủ doanh nghiệp khi giảm giá...</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Bài đã đăng</CardTitle>
              <CardDescription>08/05/2026</CardDescription>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">Cái giá của &quot;khách của tôi là tất cả mọi người&quot;...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
