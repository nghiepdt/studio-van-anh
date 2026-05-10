import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImagePlus, Download } from "lucide-react"

export default function DesignLabPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Thiết Kế</h2>
          <p className="text-muted-foreground">Tạo ảnh quote card và AI-generated</p>
        </div>
        <Button>
          <ImagePlus className="mr-2 h-4 w-4" />
          Tạo Ảnh Mới
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quote Card Template</CardTitle>
            <CardDescription>Ảnh quote từ bài viết</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white p-6 text-center">
              <p className="font-medium">"Khách quen mới là nguồn nuôi sống doanh nghiệp..."</p>
            </div>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Tải Xuống
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
