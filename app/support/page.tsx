import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Link2, Mail } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="container mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-6">
      <Card className="mb-6 min-w-0 overflow-hidden sm:mb-8">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl font-bold sm:text-2xl">Hỗ trợ & Trợ giúp - Những ngày còn lại</CardTitle>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn để có trải nghiệm tốt nhất với ứng dụng.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 px-4 pb-6 sm:px-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            <div className="flex flex-col items-center p-4 border rounded-lg bg-muted/30">
              <Mail className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Email</h3>
              <a href="mailto:support@dieorlive.com" className="text-sm text-blue-500 hover:underline">
                support@dieorlive.com
              </a>
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg bg-muted/30">
              <Link2 className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Website</h3>
              <a href="https://dieorlive.com/support" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                dieorlive.com/support
              </a>
            </div>

            <div className="flex flex-col items-center p-4 border rounded-lg bg-muted/30">
              <Clock className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Thời gian làm việc</h3>
              <p className="text-sm text-center text-muted-foreground">
                Thứ 2 - Thứ 6<br />8:00 - 17:00 (Giờ Việt Nam)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">Câu hỏi thường gặp (FAQ)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-4 pb-6 sm:px-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-base sm:text-lg">1. Làm sao để tôi điểm danh?</h3>
            <p className="text-muted-foreground">
              Bạn có thể điểm danh bằng cách nhấn vào nút "Điểm danh" lớn trên màn hình chính của ứng dụng. 
              Nút này sẽ kích hoạt mỗi ngày mới.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-base sm:text-lg">2. Khi nào người thân của tôi sẽ nhận được cảnh báo?</h3>
            <p className="text-muted-foreground">
              Nếu bạn không thực hiện điểm danh trong <strong>2 ngày liên tiếp</strong>, hệ thống của chúng tôi 
              sẽ tự động gửi email cảnh báo đến danh sách Liên hệ khẩn cấp mà bạn đã cài đặt.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-base sm:text-lg">3. Tôi quên mật khẩu thì phải làm sao?</h3>
            <p className="text-muted-foreground">
              Tại màn hình Đăng nhập, bạn hãy chọn "Quên mật khẩu?", nhập email đã đăng ký và làm theo 
              hướng dẫn trong email để đặt lại mật khẩu mới.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">4. Tại sao tôi không nhận được thông báo nhắc nhở?</h3>
            <div className="text-muted-foreground">
              <p className="mb-1">Vui lòng kiểm tra:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Bạn đã cấp quyền nhận thông báo cho ứng dụng trong Cài đặt điện thoại chưa.</li>
                <li>Kết nối internet của bạn có ổn định không.</li>
              </ol>
              <p className="mt-1">
                Thông báo nhắc nhở thường được gửi vào lúc 8:00 sáng và 11:00 sáng hàng ngày nếu bạn chưa điểm danh.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-base sm:text-lg">5. Làm thế nào để thêm/xóa người liên hệ khẩn cấp?</h3>
            <p className="text-muted-foreground">
              Truy cập vào mục "Liên hệ khẩn cấp" trong menu chính hoặc hồ sơ cá nhân. 
              Tại đó bạn có thể thêm mới hoặc vuốt để xóa các liên hệ cũ.
            </p>
          </div>

          <div className="pt-4 border-t mt-6">
            <p className="text-center italic text-muted-foreground">
              Cảm ơn bạn đã tin tưởng và sử dụng Những ngày còn lại.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
