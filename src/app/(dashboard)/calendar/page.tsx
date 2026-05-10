import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon } from "lucide-react"

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Lịch Đăng</h2>
        <p className="text-muted-foreground">Lập lịch và quản lý nội dung đăng tải</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Tháng 5 / 2026
          </CardTitle>
          <CardDescription>Giờ vàng: T2-T6 7:00-8:30, 11:00-13:00, 19:00-21:00</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
              <div key={day} className="font-medium text-muted-foreground py-2">{day}</div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
              <div
                key={date}
                className="aspect-square rounded-lg border p-2 hover:bg-accent cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="font-medium">{date}</span>
                {date === 10 && (
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
