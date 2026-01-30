import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Điều khoản dịch vụ - Những ngày còn lại</CardTitle>
          <p className="text-sm text-muted-foreground">Cập nhật lần cuối: 30/01/2026</p>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none space-y-4">
          <p>
            Chào mừng bạn đến với <strong>Những ngày còn lại</strong>. Bằng cách tải xuống, truy cập hoặc sử dụng ứng dụng di động của chúng tôi,
            bạn đồng ý tuân thủ các Điều khoản dịch vụ này. Vui lòng đọc chúng một cách cẩn thận.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. Chấp nhận điều khoản</h2>
          <p>
            Bằng việc tạo tài khoản và sử dụng ứng dụng "Những ngày còn lại", bạn xác nhận rằng bạn đồng ý với các Điều khoản này
            và Chính sách quyền riêng tư của chúng tôi. Nếu bạn không đồng ý, vui lòng không sử dụng ứng dụng.
          </p>

          <h2 className="text-xl font-semibold mt-6">2. Tài khoản người dùng</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Bạn phải cung cấp thông tin chính xác và đầy đủ khi đăng ký (bao gồm email và thông tin cá nhân).</li>
            <li>Bạn chịu trách nhiệm bảo mật mật khẩu tài khoản của mình.</li>
            <li>Bạn chịu trách nhiệm cho tất cả các hoạt động diễn ra dưới tài khoản của bạn.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">3. Sử dụng dịch vụ</h2>
          <p>"Những ngày còn lại" được thiết kế để giúp bạn theo dõi sự hiện diện hàng ngày và gửi thông báo cho người thân trong trường hợp khẩn cấp.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Điểm danh:</strong> Bạn cam kết thực hiện điểm danh trung thực để tính năng hoạt động hiệu quả.</li>
            <li>
              <strong>Liên hệ khẩn cấp:</strong> Bạn xác nhận rằng bạn đã có sự đồng ý của những người bạn thêm vào làm liên hệ khẩn cấp
              để chúng tôi có thể gửi email cảnh báo cho họ khi cần thiết.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">4. Tuyên bố miễn trừ trách nhiệm y tế</h2>
          <p>
            Ứng dụng này <strong>không phải là thiết bị y tế</strong> và không nhằm mục đích chẩn đoán, điều trị, chữa bệnh hoặc ngăn ngừa bất kỳ bệnh nào.
            Tính năng "Cảnh báo khẩn cấp" chỉ là một công cụ hỗ trợ và không nên được coi là giải pháp thay thế cho các dịch vụ khẩn cấp chuyên nghiệp
            (như 113, 115). Chúng tôi không chịu trách nhiệm nếu thông báo không được gửi đi do lỗi kỹ thuật, mất kết nối mạng hoặc các lý do bất khả kháng khác.
          </p>

          <h2 className="text-xl font-semibold mt-6">5. Hành vi bị cấm</h2>
          <p>Bạn đồng ý không:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Sử dụng ứng dụng cho mục đích bất hợp pháp.</li>
            <li>Cố gắng truy cập trái phép vào hệ thống của chúng tôi.</li>
            <li>Spam hoặc quấy rối người dùng khác.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">6. Chấm dứt</h2>
          <p>
            Chúng tôi có quyền tạm ngừng hoặc khóa tài khoản của bạn vĩnh viễn nếu bạn vi phạm các Điều khoản này mà không cần báo trước.
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Giới hạn trách nhiệm</h2>
          <p>
            Trong giới hạn tối đa cho phép của pháp luật, "Những ngày còn lại" và đội ngũ phát triển sẽ không chịu trách nhiệm cho bất kỳ
            thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả nào phát sinh từ việc bạn sử dụng hoặc không thể sử dụng ứng dụng.
          </p>

          <h2 className="text-xl font-semibold mt-6">8. Thay đổi điều khoản</h2>
          <p>
            Chúng tôi có thể sửa đổi các Điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên ứng dụng.
            Việc bạn tiếp tục sử dụng ứng dụng sau các thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
          </p>

          <h2 className="text-xl font-semibold mt-6">9. Liên hệ</h2>
          <p>
            Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ với chúng tôi tại: 
            <a href="mailto:support@dieorlive.com" className="text-blue-500 hover:underline ml-1">support@dieorlive.com</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
