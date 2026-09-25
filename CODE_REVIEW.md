# Rà soát mã nguồn

## Đã sửa

- Dùng ngày địa phương nhất quán cho bộ chọn ngày, truy vấn và trạng thái phòng; chặn lịch quá hạn ở lớp API.
- Không để trạng thái đang chọn che mất khung giờ đã đặt hoặc đã qua; cập nhật trạng thái theo thời gian và khi ứng dụng trở lại foreground.
- Hủy lịch và rollback chỉ giải phóng khóa thuộc đúng lịch đó, tránh xóa khóa của người đặt tiếp theo. Kiểm tra người dùng và bản ghi gốc trước khi hủy.
- Bỏ tài khoản mẫu và bản sao phiên đăng nhập trong Zustand; Firebase lưu phiên native bằng AsyncStorage. Chờ xác thực và cho phép thử lại khi đăng nhập lỗi.
- Chặn gửi đặt phòng lặp trong lúc đang xử lý, hiển thị lỗi tải lịch và chặn xác nhận khi chưa tải được tình trạng phòng.
- Dùng trigger thông báo có kiểu, đặt mã lời nhắc theo booking và hủy lời nhắc sau khi hủy lịch; bỏ gọi API thông báo native trên web.
- Hộp thoại đặt/hủy hoạt động trên web; dùng safe-area-context và giữ các tùy chỉnh chữ của Button.
- Dọn các cảnh báo lint và bảo đảm ID lấy từ khóa Firebase không bị trường ID cũ ghi đè.

## Kiểm tra

- `npx expo lint`
- `npx tsc --noEmit`
- `node --test --test-isolation=none tests/booking-regressions.test.cjs`: 10 kiểm tra, chạy với `TZ=Asia/Ho_Chi_Minh` và `TZ=America/Los_Angeles`.
- Các test Firebase dùng SDK giả lập tại biên API; không ghi dữ liệu lên Firebase thật và không thay thế kiểm thử emulator/rules.
- `npx expo export --platform all --no-bytecode`: đóng gói JavaScript thành công cho Android, iOS và web. Tạo Hermes bytecode bị sandbox chặn (`spawn EPERM`), chưa xác minh bản native chạy thực tế.
- Kiểm tra dependency ngoại tuyến đạt theo dữ liệu SDK tại máy; truy vấn trực tuyến bị lỗi kết nối.

## Giới hạn cần kiểm tra với backend và thiết bị

- Repository không có Realtime Database Security Rules. Các kiểm tra phía client không thay thế phân quyền phía server; chưa xác minh rules/index đang triển khai (`bookings.userId`, `bookings.date`).
- Dữ liệu `bookings` và `roomSlots` nằm ở hai nhánh. Quy trình client vẫn có khoảng gián đoạn giữa các lần ghi: ứng dụng bị đóng sau khi giữ khóa, hoặc lỗi giải phóng khóa sau khi hủy, có thể để lại khóa mồ côi. Cần giao dịch phía server hoặc thiết kế dữ liệu nguyên tử để bảo đảm cả khi tiến trình chết; không nên đổi schema dữ liệu đang chạy mà chưa có kế hoạch chuyển đổi.
- Chưa kiểm thử đăng nhập, tranh chấp giữa hai thiết bị và thông báo trên thiết bị thật. Không triển khai hay thay đổi dữ liệu cloud trong lần rà soát này.
- `dataconnect/` là mẫu ứng dụng phim; mã ứng dụng hiện dùng Realtime Database, không dùng connector này.
