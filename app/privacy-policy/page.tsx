import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Chính sách Quyền riêng tư - Những ngày còn lại</CardTitle>
          <p className="text-sm text-muted-foreground">Cập nhật lần cuối: 30/01/2026</p>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none space-y-4">
          <p>
            Chào mừng bạn đến với <strong>"Những ngày còn lại"</strong> (sau đây gọi tắt là "Ứng dụng").
            Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. Chính sách quyền riêng tư này giải thích
            cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin của bạn khi bạn sử dụng ứng dụng di động của chúng tôi.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. Giới thiệu</h2>
          <p>
            "Những ngày còn lại" là một ứng dụng di động được thiết kế để theo dõi sự hiện diện của người dùng và gửi cảnh báo
            khẩn cấp cho người thân nếu người dùng không điểm danh trong một khoảng thời gian nhất định. Để cung cấp dịch vụ này,
            chúng tôi cần thu thập và xử lý một số thông tin cá nhân nhất định.
          </p>

          <h2 className="text-xl font-semibold mt-6">2. Thông tin chúng tôi thu thập</h2>
          
          <h3 className="text-lg font-medium mt-4">a. Thông tin bạn cung cấp cho chúng tôi</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Thông tin tài khoản:</strong> Khi bạn đăng ký tài khoản, chúng tôi thu thập địa chỉ email và mật khẩu của bạn.
            </li>
            <li>
              <strong>Thông tin hồ sơ:</strong> Bạn có thể cung cấp thêm thông tin cá nhân như Link Facebook/Mạng xã hội khác, lời nhắn...
            </li>
            <li>
              <strong>Thông tin liên hệ khẩn cấp:</strong> Để tính năng cảnh báo hoạt động, bạn cần cung cấp tên và địa chỉ email
              của những người bạn muốn chúng tôi liên hệ trong trường hợp khẩn cấp (Người thân). Bạn cam kết rằng bạn đã có sự đồng ý
              của những người này để chia sẻ thông tin của họ với chúng tôi.
            </li>
          </ul>

          <h3 className="text-lg font-medium mt-4">b. Thông tin tự động thu thập</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Dữ liệu điểm danh:</strong> Chúng tôi ghi lại thời gian bạn thực hiện hành động "Điểm danh" trên ứng dụng.
            </li>
            <li>
              <strong>Thông tin thiết bị:</strong> Chúng tôi có thể thu thập thông tin về thiết bị di động của bạn, bao gồm kiểu máy,
              hệ điều hành và các mã định danh thiết bị duy nhất.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">3. Cách chúng tôi sử dụng thông tin của bạn</h2>
          <p>Chúng tôi sử dụng thông tin thu thập được cho các mục đích sau:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Cung cấp và duy trì Dịch vụ:</strong> Để kích hoạt tài khoản của bạn, cho phép bạn điểm danh và quản lý danh bạ khẩn cấp.
            </li>
            <li>
              <strong>Gửi cảnh báo khẩn cấp:</strong> Đây là tính năng cốt lõi. Nếu bạn không điểm danh trong thời gian quy định (ví dụ: 2 ngày),
              hệ thống sẽ tự động gửi email đến danh sách liên hệ khẩn cấp mà bạn đã thiết lập.
            </li>
            <li>
              <strong>Thông báo cho bạn:</strong> Gửi thông báo nhắc nhở bạn điểm danh hàng ngày.
            </li>
            <li><strong>Hỗ trợ khách hàng:</strong> Giải quyết các vấn đề kỹ thuật hoặc thắc mắc của bạn.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">4. Chia sẻ thông tin của bạn</h2>
          <p>Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Với Người liên hệ khẩn cấp của bạn:</strong> Trong trường hợp kích hoạt cảnh báo, chúng tôi sẽ chia sẻ trạng thái vắng mặt
              của bạn và thông tin liên lạc (nếu có trong nội dung email cảnh báo) cho những người bạn đã chỉ định.
            </li>
            <li>
              <strong>Nhà cung cấp dịch vụ:</strong> Chúng tôi có thể sử dụng các bên thứ ba để hỗ trợ vận hành dịch vụ (ví dụ: dịch vụ gửi email,
              lưu trữ máy chủ). Các bên này chỉ có quyền truy cập thông tin cần thiết để thực hiện nhiệm vụ của họ và phải tuân thủ nghiêm ngặt
              các quy định bảo mật.
            </li>
            <li>
              <strong>Yêu cầu pháp lý:</strong> Chúng tôi có thể tiết lộ thông tin của bạn nếu pháp luật yêu cầu hoặc để bảo vệ quyền lợi,
              tài sản hoặc sự an toàn của chúng tôi hoặc người khác.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">5. Dịch vụ bên thứ ba</h2>
          <p>Ứng dụng sử dụng các dịch vụ bên thứ ba sau đây, có thể thu thập thông tin để nhận dạng bạn:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Supabase:</strong> Được sử dụng để xác thực người dùng và lưu trữ dữ liệu.</li>
            <li><strong>PostgreSQL:</strong> Được sử dụng làm cơ sở dữ liệu chính để lưu trữ hồ sơ người dùng, danh bạ và lịch sử điểm danh.</li>
          </ul>
          <p className="mt-2">
            Các bên thứ ba này chỉ có quyền truy cập vào Thông tin cá nhân của bạn để thực hiện các nhiệm vụ này thay mặt chúng tôi
            và có nghĩa vụ không tiết lộ hoặc sử dụng nó cho bất kỳ mục đích nào khác.
          </p>

          <h2 className="text-xl font-semibold mt-6">6. Bảo mật thông tin của bạn</h2>
          <p>
            Chúng tôi sử dụng các biện pháp bảo mật hành chính, kỹ thuật và vật lý để giúp bảo vệ thông tin cá nhân của bạn.
            Mặc dù chúng tôi đã thực hiện các bước hợp lý để bảo mật thông tin cá nhân bạn cung cấp cho chúng tôi, xin lưu ý rằng
            bất chấp nỗ lực của chúng tôi, không có biện pháp bảo mật nào là hoàn hảo hoặc không thể xuyên thủng, và không có phương thức
            truyền dữ liệu nào có thể được đảm bảo chống lại mọi sự chặn hoặc lạm dụng khác.
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Quản lý thông tin của bạn</h2>
          <p>
            Bạn có thể xem và thay đổi thông tin cá nhân của mình bằng cách đăng nhập vào Ứng dụng và truy cập phần "Hồ sơ" hoặc "Liên hệ khẩn cấp".
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Để cập nhật hồ sơ của bạn:</strong> Truy cập màn hình Hồ sơ.</li>
            <li><strong>Để quản lý danh bạ:</strong> Truy cập màn hình Liên hệ khẩn cấp để thêm, cập nhật hoặc xóa danh bạ.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">8. Quyền riêng tư của trẻ em</h2>
          <p>
            Ứng dụng của chúng tôi không dành cho trẻ em dưới 13 tuổi. Chúng tôi không cố ý thu thập thông tin nhận dạng cá nhân từ trẻ em dưới 13 tuổi.
            Nếu bạn là cha mẹ hoặc người giám hộ và bạn biết rằng con bạn đã cung cấp cho chúng tôi Dữ liệu cá nhân, vui lòng liên hệ với chúng tôi.
          </p>

          <h2 className="text-xl font-semibold mt-6">9. Thay đổi Chính sách quyền riêng tư này</h2>
          <p>
            Chúng tôi có thể cập nhật Chính sách quyền riêng tư của mình theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào
            bằng cách đăng Chính sách quyền riêng tư mới trên trang này. Bạn nên xem lại Chính sách quyền riêng tư này định kỳ để biết bất kỳ thay đổi nào.
          </p>

          <h2 className="text-xl font-semibold mt-6">10. Liên hệ với chúng tôi</h2>
          <p>
            Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào về Chính sách quyền riêng tư của chúng tôi, đừng ngần ngại liên hệ với chúng tôi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
