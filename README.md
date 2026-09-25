<p align="center">
  <img src="assets/bookroom-logo.png" width="140" alt="Logo VKU Bookroom">
</p>

<h1 align="center">VKU Bookroom</h1>

<p align="center"><strong>Hãy đặt lịch để có người iu</strong><br>
Ứng dụng tìm kiếm và đặt phòng học nhóm, phòng máy thông minh dành cho sinh viên VKU.</p>

<p align="center">React Native · Expo SDK 57 · TypeScript · Firebase Realtime Database & Auth<br>
Android / iOS / Web · Giao diện tiếng Việt · Giờ Việt Nam UTC+7</p>

---

<p align="center">
  <img src="docs/screenshots/01-desktop.png" width="92%" alt="Giao diện Web Desktop VKU Bookroom">
</p>

VKU Bookroom giúp sinh viên Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (VKU) dễ dàng tra cứu không gian học tập phù hợp, kiểm tra tình trạng phòng theo thời gian thực, xem khung giờ trống, đặt phòng và quản lý buổi học tiện lợi. Dự án sử dụng chung một mã nguồn (Universal App) tối ưu mượt mà cho cả điện thoại di động và giao diện màn hình lớn trên Web Desktop.

**Dữ liệu ứng dụng:** 20 phòng học & phòng máy chuyên biệt trải rộng trên 4 tòa nhà A, B, C, V; mỗi phòng đều có bộ ảnh thực tế chất lượng cao, thông tin sức chứa, tầng, tòa và tiện nghi chi tiết.

**Mục lục:** [1. Sản phẩm & Tính năng](#1-san-pham-va-tinh-nang) · [2. Ảnh màn hình sản phẩm](#2-anh-man-hinh-san-pham) · [3. Luồng nghiệp vụ](#3-luong-nghiep-vu) · [4. Công nghệ & Kiến trúc](#4-cong-nghe-va-kien-truc) · [5. Mô hình dữ liệu](#5-mo-hinh-du-lieu) · [6. Cài đặt & Chạy cục bộ](#6-cai-dat-va-chay-cuc-bo) · [7. Cấu hình Firebase](#7-cau-hinh-firebase) · [8. Build APK & Phân phối](#8-build-va-phan-phoi) · [9. Kiểm thử](#9-kiem-thu-va-chat-luong) · [10. Kịch bản Demo](#10-kich-ban-demo) · [11. Cấu trúc thư mục](#11-cau-truc-thu-muc) · [12. Hướng phát triển](#12-gioi-han-va-huong-phat-trien)

---

<a id="1-san-pham-va-tinh-nang"></a>

## 1. Sản phẩm và tính năng

### Bài toán

Sinh viên VKU thường xuyên cần không gian để thảo luận bài tập lớn, làm việc nhóm, ôn thi hoặc thực hành lập trình/đồ họa/AI nhưng gặp khó khăn khi tìm kiếm phòng trống, thiếu thông tin về máy chiếu, điều hòa, dàn PC và dễ xảy ra tình trạng trùng phòng. VKU Bookroom giải quyết bài toán này bằng quy trình tập trung, trực quan, tức thời và minh bạch.

### Bảng nhóm chức năng

| Nhóm chức năng | Người dùng có thể làm gì? |
| --- | --- |
| **Tài khoản** | Đăng ký, đăng nhập bằng Email/Mật khẩu với Firebase Auth; tích hợp đăng nhập Google; đăng xuất an toàn có xác nhận. |
| **Khám phá** | Xem danh sách 20 phòng học nhóm/phòng máy, tên phòng, tòa (A, B, C, V), tầng, sức chứa và danh sách tiện nghi thực tế. |
| **Tìm kiếm** | Tìm kiếm không dấu tiếng Việt theo tên phòng, tòa nhà, mô tả chi tiết và thiết bị; ví dụ: `phong hoc`, `may chieu`, `toa a`, `tang 2`. |
| **Bộ lọc** | Kết hợp đa tiêu chí: Tòa nhà, Sức chứa tối thiểu (6+, 10+, 20+, 30+), Loại phòng (Học nhóm / Phòng máy), và nhiều tiện nghi (AND condition); nút **Xóa lọc** tiện lợi. |
| **Ảnh phòng** | **Mỗi phòng một bộ ảnh chất lượng cao riêng biệt**; xem ảnh bìa, danh sách thumbnail, vuốt carousel; trình xem ảnh toàn màn hình phóng to trực quan. |
| **Đặt phòng** | Chọn ngày trong 7 ngày tới, xem khung giờ trống/đã đặt, kiểm tra tóm tắt thông tin, xác nhận và nhận vé QR tức thì. |
| **Lịch của tôi** | Phân tab **Sắp tới** và **Lịch sử** (đã hoàn thành/đã hủy/đã qua); hỗ trợ mở lại vé QR mọi lúc. |
| **Check-in** | Nút **Nhận phòng (Check-in)** kích hoạt trong khoảng thời gian cho phép (từ 30 phút trước giờ bắt đầu đến khi kết thúc ca). |
| **Trả phòng** | **Hủy lịch** trước giờ bắt đầu hoặc **Trả phòng sớm** sau khi check-in; lập tức giải phóng khóa phòng (`roomSlots`) để sinh viên khác có thể đặt. |
| **Yêu thích** | Thêm/bỏ phòng yêu thích bằng biểu tượng trái tim, lưu trữ cục bộ và xem nhanh trong tab **Yêu thích**. |
| **Nhắc lịch** | Lên lịch thông báo cục bộ trước buổi học 15 phút trên điện thoại; bật/tắt trong mục Tài khoản. |
| **Thử thông báo** | Nút **Thử thông báo sau 5 giây** trong Tài khoản để kiểm tra quyền và trải nghiệm hiển thị thông báo. |
| **Kết nối** | Banner hiển thị trạng thái kết nối mạng, phát hiện offline, nút thử lại, dữ liệu cache và trạng thái trống (empty state) thân thiện. |
| **Đa nền tảng** | Bottom Navigation Bar trên mobile; Responsive Sidebar cố định và lưới đa cột trên màn hình rộng / máy tính. |

---

<a id="2-anh-man-hinh-san-pham"></a>

## 2. Ảnh màn hình sản phẩm

Dưới đây là hình ảnh thực tế ghi lại các bước trải nghiệm chính trên cả hai nền tảng Web Desktop và Mobile của **VKU Bookroom**:

### 🖥️ 1. Giao diện Desktop
Bố cục hiển thị tối ưu trên màn hình lớn với thanh **Desktop Sidebar** bên trái (Logo, Slogan *"Hãy đặt lịch để có người iu"*, menu điều hướng), thanh tìm kiếm không dấu, bộ lọc đa tiêu chí và danh sách phòng 2 cột trực quan.

<p align="center">
  <img src="docs/screenshots/01-desktop.png" width="95%" alt="1. Giao diện Desktop VKU Bookroom">
</p>

---

### 📱 2. Giao diện Mobile & Luồng Đặt Phòng Thực Tế

<table>
  <tr>
    <th width="25%">2. Giao diện Mobile</th>
    <th width="25%">3. Chọn phòng</th>
    <th width="25%">4. Đặt phòng</th>
    <th width="25%">5. Đặt phòng thành công</th>
  </tr>
  <tr>
    <td align="center" valign="top">
      <img src="docs/screenshots/02-mobile.png" width="100%" alt="2. Giao diện Mobile">
      <br><strong>Giao diện Mobile</strong>
      <br><em>Thẻ phòng 1 cột & Bottom Tabs</em>
    </td>
    <td align="center" valign="top">
      <img src="docs/screenshots/03-room-detail.png" width="100%" alt="3. Chọn phòng">
      <br><strong>Chọn phòng & Chi tiết</strong>
      <br><em>Ảnh Carousel, Fullscreen & Tiện nghi</em>
    </td>
    <td align="center" valign="top">
      <img src="docs/screenshots/04-booking.png" width="100%" alt="4. Đặt phòng">
      <br><strong>Đặt phòng & Ca học</strong>
      <br><em>Chọn ngày 7 ngày tới & Xem trước</em>
    </td>
    <td align="center" valign="top">
      <img src="docs/screenshots/05-booking-success.png" width="100%" alt="5. Đặt phòng thành công">
      <br><strong>Đặt phòng thành công</strong>
      <br><em>Lịch của tôi, Vé QR & Check-in</em>
    </td>
  </tr>
</table>

### 📝 Chi tiết các màn hình:
1. **Ảnh 1 — Giao diện Desktop:** Màn hình lớn với thanh Sidebar bên trái hiển thị thương hiệu, bộ lọc nâng cao theo tòa/chỗ ngồi/thiết bị, và danh sách 20 phòng dạng lưới 2 cột.
2. **Ảnh 2 — Giao diện Mobile:** Giao diện tối ưu cho điện thoại với thanh tìm kiếm thông minh, các thẻ phòng bo tròn thanh lịch và thanh điều hướng Bottom Navigation Bar 4 tabs.
3. **Ảnh 3 — Chọn phòng (Chi tiết):** Hiển thị bộ ảnh chất lượng cao của từng phòng với carousel lướt ảnh, thumbnail, nút xem toàn màn hình (fullscreen gallery), badge loại phòng, sức chứa, tầng, tòa, mô tả chi tiết và tiện nghi trang bị.
4. **Ảnh 4 — Đặt phòng (Chọn ngày & ca học):** Chọn ngày trong vòng 7 ngày tới, hệ thống hiển thị trạng thái khung giờ theo thời gian thực (Trống, Đang chọn, Đã đặt, Đã qua), hiển thị hộp tóm tắt thông tin đặt phòng và nút xác nhận.
5. **Ảnh 5 — Đặt phòng thành công (Lịch của tôi):** Quản lý lịch học sắp tới, hiển thị nút xem vé QR, thông tin đếm ngược giờ check-in phòng học và tùy chọn hủy lịch linh hoạt trước giờ bắt đầu.

---

<a id="3-luong-nghiep-vu"></a>

## 3. Luồng nghiệp vụ

### Từ tìm phòng đến nhận vé QR

~~~mermaid
flowchart LR
    A["Đăng nhập / Đăng ký"] --> B["Khám phá & Yêu thích"]
    B --> C["Tìm kiếm & Lọc AND"]
    C --> D["Chi tiết phòng & Thư viện ảnh"]
    D --> E["Chọn ngày & Ca học trống"]
    E --> F["Kiểm tra thông tin"]
    F --> G{"Xác nhận đặt phòng"}
    G -->|Thành công| H["Tạo vé QR + Lưu Lịch của tôi"]
    G -->|Trùng slot / Quá hạn| E
    H --> I["Nhắc lịch học 15 phút"]
    H --> J["Check-in / Trả sớm / Hủy lịch"]
~~~

1. Sinh viên đăng nhập vào hệ thống (Email hoặc Google).
2. Tra cứu phòng học theo từ khóa không dấu hoặc kết hợp bộ lọc (Tòa, Sức chứa, Tiện nghi).
3. Xem chi tiết thông tin phòng, tiện nghi và lướt thư viện ảnh chất lượng cao.
4. Chọn ngày học (trong vòng 7 ngày tới) và chọn khung giờ còn trống.
5. Xem lại tóm tắt thông tin đặt phòng (Phòng, Tòa, Ngày, Giờ) trước khi xác nhận.
6. Hệ thống thực hiện transaction ghi nhận lịch và khóa slot phòng; hiển thị vé QR với mã đối chiếu.
7. Lịch đặt được quản lý trong tab **Lịch của tôi**, hỗ trợ check-in khi đến giờ học hoặc hủy/trả phòng sớm.

### Vòng đời lịch đặt phòng

~~~mermaid
stateDiagram-v2
    [*] --> active: Đặt phòng thành công
    active --> cancelled: Hủy lịch (Trước giờ bắt đầu)
    active --> checked_in: Check-in (Từ 30p trước giờ học)
    checked_in --> completed: Trả phòng sớm / Hoàn tất ca học
    cancelled --> [*]: Mở lại khung giờ phòng
    completed --> [*]: Giải phóng khóa phòng
~~~

- **Hủy lịch:** Chỉ khả dụng trước giờ bắt đầu ca học; cập nhật trạng thái `cancelled` và tự động mở lại slot phòng cho người khác.
- **Nhận phòng (Check-in):** Khả dụng từ 30 phút trước giờ bắt đầu đến khi kết thúc ca; chuyển trạng thái sang `checked_in`.
- **Trả phòng sớm:** Cho phép kết thúc sớm sau khi đã check-in; chuyển sang `completed` và giải phóng khóa phòng ngay lập tức trong `roomSlots`.

### Quy tắc nghiệp vụ

| Quy tắc | Chi tiết thực thi |
| --- | --- |
| **Múi giờ chuẩn** | Chuẩn múi giờ Việt Nam UTC+7 cho toàn bộ lịch và ca học. |
| **Khoảng thời gian đặt** | Đặt trước trong ngày hôm nay và 6 ngày tiếp theo (tổng 7 ngày). |
| **Khung giờ học cố định** | 4 ca học 2 tiếng chuẩn: **07:30–09:30**, **09:30–11:30**, **13:30–15:30**, **15:30–17:30**. |
| **Chống trùng phòng (Concurrency Lock)** | Sử dụng atomic transaction trên nút `roomSlots/{roomId}/{date}/{slotId}` để đảm bảo không bao giờ bị trùng lịch giữa 2 người dùng. |
| **Bảo vệ slot đã qua** | Tự động vô hiệu hóa các khung giờ đã bắt đầu hoặc đã qua trong quá khứ. |
| **Nhắc lịch học** | Lên lịch thông báo cục bộ trước giờ bắt đầu **15 phút** trên thiết bị di động. |

---

<a id="4-cong-nghe-va-kien-truc"></a>

## 4. Công nghệ và kiến trúc

### Stack công nghệ

| Thành phần | Công nghệ | Phiên bản | Vai trò |
| --- | --- | --- | --- |
| **Nền tảng** | React Native, Expo | Expo SDK ~57.0.25 | Ứng dụng di động đa nền tảng Android, iOS và Web |
| **Core React** | React, React DOM | 19.2.3 | Thư viện UI thành phần |
| **Ngôn ngữ** | TypeScript | ~6.0.3 (`strict: true`) | An toàn kiểu dữ liệu và bắt lỗi tĩnh |
| **Điều hướng** | Expo Router | ~57.0.23 | Định tuyến dựa trên tập tin (File-based routing) |
| **Dữ liệu & Cache** | TanStack Query | ^5.103.2 | Quản lý server state, realtime subscription và bộ đệm |
| **Trạng thái Client** | Zustand | ^5.0.15 | Quản lý bộ lọc, phòng yêu thích, cài đặt thông báo |
| **Lưu trữ Cục bộ** | AsyncStorage | 2.2.0 | Lưu trữ phiên người dùng và danh sách yêu thích |
| **Backend & Cloud** | Firebase JS SDK | ^12.19.0 | Firebase Authentication & Realtime Database |
| **Thông báo** | Expo Notifications | ~57.0.21 | Nhắc lịch học 15 phút & kiểm thử thông báo 5 giây |
| **Mã QR** | react-native-qrcode-svg | ^6.3.26 | Tạo vé mã QR cho mỗi lượt đặt phòng |
| **Bộ Icon** | Lucide React Native | ^1.47.0 | Hệ thống biểu tượng giao diện hiện đại |
| **Kiểm thử** | Node Test Runner | Node.js Built-in | Bộ kiểm thử chống hồi quy (Regression tests) |

### Sơ đồ luồng dữ liệu

~~~mermaid
flowchart TD
    UI["React Native Web / Mobile UI"] --> ROUTER["Expo Router (src/app)"]
    ROUTER --> COMPONENTS["Components (RoomCard, BookingCard, GalleryModal...)"]
    COMPONENTS --> STORE["Zustand Store (useBookingStore)"]
    STORE --> STORAGE["AsyncStorage (Favorites & Preferences)"]
    COMPONENTS --> HOOKS["Custom Hooks (useRoomsQuery, useBookingSlots...)"]
    HOOKS --> QUERY["TanStack Query (useRealtimeQuery)"]
    QUERY --> API["API Layer (src/api/rooms, src/api/bookings)"]
    API --> AUTH["Firebase Authentication"]
    API --> RTDB["Firebase Realtime Database (rooms, bookings, roomSlots)"]
    COMPONENTS --> NOTIFY["Expo Notifications (Local reminders)"]
~~~

### Điều hướng màn hình (Expo Router)

| Tuyến đường (Route) | Màn hình | Chức năng |
| --- | --- | --- |
| `/(tabs)` | Khám phá (Discover) | Danh sách 20 phòng, tìm kiếm không dấu, bộ lọc AND, tab ca học |
| `/(tabs)/favorites` | Yêu thích | Danh sách phòng đã lưu, trạng thái đang trống / bận hiện tại |
| `/(tabs)/bookings` | Lịch của tôi | Quản lý lịch sắp tới, lịch sử, check-in, trả phòng sớm, xem vé QR |
| `/(tabs)/account` | Tài khoản | Thông tin cá nhân, bật/tắt nhắc lịch, nút Thử thông báo 5s, đăng xuất |
| `/room/[id]` | Chi tiết phòng | Thư viện ảnh đa dạng, fullscreen viewer, chọn ngày/ca học, xác nhận đặt |
| `/sign-in` | Đăng nhập / Đăng ký | Đăng nhập/Đăng ký email, đăng nhập Google, điền nhanh tài khoản |

---

<a id="5-mo-hinh-du-lieu"></a>

## 5. Mô hình dữ liệu

### Cấu trúc Firebase Realtime Database

~~~text
root/
├── rooms/
│   └── {roomId}/
│       ├── name: string
│       ├── building: "A" | "B" | "C" | "V"
│       ├── floor: number
│       ├── capacity: number
│       ├── type: "study" | "lab"
│       ├── equipment: ["projector", "whiteboard", "high_spec_pc", "ac"]
│       ├── description: string
│       ├── image: string (cover URL)
│       └── images: string[] (gallery URLs)
├── bookings/
│   └── {bookingId}/
│       ├── id: string
│       ├── userId: string
│       ├── roomId: string
│       ├── date: "YYYY-MM-DD"
│       ├── slotId: "slot_1" | "slot_2" | "slot_3" | "slot_4"
│       ├── startTime: "07:30"
│       ├── endTime: "09:30"
│       ├── status: "active" | "checked_in" | "completed" | "cancelled"
│       ├── createdAt: ISO timestamp
│       ├── checkedInAt?: ISO timestamp
│       └── completedAt?: ISO timestamp
└── roomSlots/
    └── {roomId}/
        └── {date}/
            └── {slotId}/
                ├── bookingId: string
                └── userId: string
~~~

### TypeScript Models chính

~~~ts
export type Building = 'A' | 'B' | 'C' | 'V';
export type RoomType = 'study' | 'lab';

export enum Equipment {
  PROJECTOR = 'projector',
  WHITEBOARD = 'whiteboard',
  HIGH_SPEC_PC = 'high_spec_pc',
  AC = 'ac'
}

export interface Room {
  id: string;
  name: string;
  type?: RoomType;
  building: Building;
  floor: number;
  capacity: number;
  equipment: Equipment[];
  description?: string;
  image?: string;
  images?: string[];
}

export type BookingStatus = 'active' | 'cancelled' | 'checked_in' | 'completed';

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  date: string;
  slotId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  status: BookingStatus;
  checkedInAt?: string;
  completedAt?: string;
}
~~~

---

<a id="6-cai-dat-va-chay-cuc-bo"></a>

## 6. Cài đặt và chạy cục bộ

### Yêu cầu tiên quyết

- **Node.js**: Phiên bản 20.x hoặc 22.x LTS.
- **npm** hoặc **yarn/bun**.
- Điện thoại có cài ứng dụng **Expo Go** (nếu chạy thử trên thiết bị di động).
- Trình duyệt Web (Chrome, Edge, Firefox, Safari).

### Các bước cài đặt

1. **Clone repository và cài đặt thư viện:**
   ```bash
   git clone <URL_REPO>
   cd VKU_bookroom
   npm install
   ```

2. **Cấu hình file môi trường `.env`:**
   Tạo file `.env` ở thư mục gốc (hoặc sao chép từ `.env.example`):
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id
   ```

3. **Khởi chạy ứng dụng:**
   ```bash
   # Chạy máy chủ Metro (hỗ trợ cả Web, Android và iOS)
   npx expo start

   # Hoặc mở trực tiếp trên trình duyệt Web (khuyến nghị để kiểm tra nhanh)
   npx expo start --web
   ```
   Ứng dụng sẽ hoạt động tại địa chỉ: `http://localhost:8081`.

4. **Trải nghiệm trên điện thoại:**
   - Quét mã QR hiển thị ở terminal bằng camera (iOS) hoặc ứng dụng **Expo Go** (Android).

---

<a id="7-cau-hinh-firebase"></a>

## 7. Cấu hình Firebase

Dự án sử dụng dịch vụ của Google Firebase:
1. **Firebase Authentication:** Bật phương thức đăng nhập bằng **Email/Password** và **Google**.
2. **Firebase Realtime Database:** Khởi tạo Realtime Database (location bất kỳ, ví dụ `asia-southeast1` hoặc `us-central1`).
3. Cấu hình Security Rules an toàn cho Realtime Database:
   ```json
   {
     "rules": {
       "rooms": {
         ".read": true,
         ".write": "auth != null"
       },
       "bookings": {
         ".read": "auth != null",
         ".write": "auth != null",
         ".indexOn": ["userId", "date"]
       },
       "roomSlots": {
         ".read": "auth != null",
         ".write": "auth != null"
       }
     }
   }
   ```

---

<a id="8-build-va-phan-phoi"></a>

## 8. Build và phân phối

| Môi trường | Lệnh thực hiện | Kết quả đầu ra |
| :--- | :--- | :--- |
| **Web Production** | `npx expo export -p web` | Thư mục `dist/` sẵn sàng deploy lên Vercel, Netlify hoặc Firebase Hosting |
| **Android APK (EAS)** | `npx eas-cli build -p android --profile preview` | File `.apk` cài trực tiếp cho điện thoại Android qua link EAS Cloud |
| **Android App Bundle** | `npx eas-cli build -p android --profile production` | File `.aab` phát hành lên Google Play Store |
| **iOS Development** | `npx eas-cli build -p ios --profile development` | Bản build phát triển cài qua TestFlight |

---

<a id="9-kiem-thu-va-chat-luong"></a>

## 9. Kiểm thử và chất lượng mã nguồn

Dự án áp dụng quy trình kiểm thử nghiêm ngặt trước khi bàn giao:

```bash
# 1. Kiểm tra an toàn kiểu dữ liệu TypeScript (Strict Mode)
npx tsc --noEmit

# 2. Kiểm tra quy chuẩn mã nguồn Expo Linter
npx expo lint

# 3. Chạy toàn bộ bộ kiểm thử hồi quy (Regression Test Suite)
node --test tests/booking-regressions.test.cjs
```

### Kết quả kiểm định thực tế

| Hạng mục kiểm tra | Công cụ | Trạng thái | Ghi chú |
| :--- | :--- | :---: | :--- |
| **TypeScript Typecheck** | `tsc --noEmit` | **PASS (0 errors)** | Đạt 100% không lỗi kiểu dữ liệu |
| **ESLint Expo Config** | `expo lint` | **PASS (0 warnings)** | Mã nguồn tuân thủ tiêu chuẩn Expo SDK 57 |
| **Xung đột đặt phòng** | Node Test Runner | **10/10 PASS** | Kiểm tra atomic concurrency, hoàn tác khi lỗi, giải phóng lock |
| **Biên dịch Web Bundle** | Metro Bundler | **HTTP 200 OK** | 2.900+ modules được bundle trơn tru |

---

<a id="10-kich-ban-demo"></a>

## 10. Kịch bản Demo

Để trải nghiệm toàn bộ tính năng của ứng dụng theo luồng chuẩn:

1. **Đăng nhập:** Mở ứng dụng, sử dụng tính năng *Điền tài khoản mẫu* hoặc đăng ký tài khoản mới bằng Email/Mật khẩu.
2. **Khám phá 20 phòng:** Lướt danh sách phòng, xem badge phân loại *Phòng học nhóm* và *Phòng máy*, cùng ảnh bìa độc nhất cho từng phòng.
3. **Tìm kiếm & Lọc:**
   - Gõ tìm kiếm không dấu: `phong may`, `game`, `do hoa`, `hoi thao`, `toa v`...
   - Kết hợp lọc tòa nhà (A, B, C, V), chọn số chỗ (6+, 10+, 20+, 30+) và tích chọn Máy chiếu / Điều hòa / Dàn PC.
4. **Xem chi tiết & Thư viện ảnh:** Mở phòng `B101` hoặc `V401`, vuốt xem ảnh carousel, bấm vào ảnh để mở trình xem ảnh phóng to toàn màn hình.
5. **Yêu thích:** Bấm vào biểu tượng trái tim để lưu phòng vào tab **Yêu thích**.
6. **Đặt phòng:** Chọn ngày học trong 7 ngày tới, chọn khung giờ còn trống (màu xanh lá) và bấm **Xác nhận đặt phòng & Nhận vé QR**.
7. **Nhận vé QR:** Xem vé QR vừa tạo với đầy đủ thông tin phòng, ngày giờ và mã đối chiếu.
8. **Quản lý lịch học:**
   - Vào tab **Lịch của tôi**, kiểm tra mục **Sắp tới**.
   - Thử tính năng **Nhận phòng (Check-in)** hoặc **Trả phòng sớm** (giải phóng slot ngay lập tức).
   - Kiểm tra tab **Lịch sử** để xem các lịch đã hoàn tất hoặc đã hủy.
9. **Cài đặt & Thử thông báo:** Vào tab **Tài khoản**, bấm nút **Thử thông báo sau 5 giây** để kiểm tra quyền và hiển thị thông báo nhắc lịch học.

---

<a id="11-cau-truc-thu-muc"></a>

## 11. Cấu trúc thư mục

```text
VKU_bookroom/
├── assets/                          # Logo, icon, hình ảnh ứng dụng
│   ├── bookroom-logo.png            # Logo chính thức VKU Bookroom
│   └── favicon.png
├── src/
│   ├── api/                         # Tầng kết nối Firebase (Auth, Bookings, Rooms)
│   │   ├── auth.ts                  # Đăng ký, đăng nhập email, đăng xuất
│   │   ├── bookings.ts              # Đặt phòng, check-in, trả phòng, transaction
│   │   ├── googleAuth.ts            # Tích hợp Google Sign-In
│   │   └── rooms.ts                 # Realtime listeners cho danh sách phòng
│   ├── app/                         # Tuyến đường Expo Router (Screens)
│   │   ├── (tabs)/                  # Nhóm điều hướng chính (Bottom Tabs / Sidebar)
│   │   │   ├── _layout.tsx          # Bố cục Tab bar và Desktop Sidebar
│   │   │   ├── index.tsx            # Màn hình Khám phá & Tìm kiếm
│   │   │   ├── favorites.tsx        # Màn hình Phòng yêu thích
│   │   │   ├── bookings.tsx         # Màn hình Lịch của tôi (Sắp tới & Lịch sử)
│   │   │   └── account.tsx          # Màn hình Tài khoản, Nhắc lịch, Thử thông báo
│   │   ├── room/[id].tsx            # Màn hình Chi tiết phòng, Gallery & Đặt lịch
│   │   ├── sign-in.tsx              # Màn hình Đăng nhập & Đăng ký
│   │   └── _layout.tsx              # Root Layout, Auth Guard & Providers
│   ├── components/                  # Thư viện UI components tái sử dụng
│   │   ├── BookingCard.tsx          # Thẻ lịch đặt với các nút Check-in, Hủy, Trả phòng
│   │   ├── BrandLogo.tsx            # Logo và slogan "Hãy đặt lịch để có người iu"
│   │   ├── ConnectionBanner.tsx     # Banner trạng thái mất mạng & thử lại
│   │   ├── DateSelector.tsx         # Bộ chọn ngày 7 ngày tới
│   │   ├── DesktopSidebar.tsx       # Thanh điều hướng sidebar cố định trên desktop
│   │   ├── ImageGalleryModal.tsx    # Trình xem ảnh phóng to toàn màn hình
│   │   ├── QRCodeModal.tsx          # Vé đặt phòng QR code
│   │   ├── RoomCard.tsx             # Thẻ phòng khám phá với ảnh độc nhất & nút tim
│   │   ├── RoomImageCarousel.tsx    # Carousel ảnh lướt kèm thumbnail
│   │   ├── SearchBar.tsx            # Ô tìm kiếm không dấu
│   │   └── TimeSlot.tsx             # Nút chọn ca học với trạng thái trực quan
│   ├── constants/                   # Hằng số giao diện, ca học, bảng màu theme
│   ├── data/
│   │   └── rooms.ts                 # Danh mục 20 phòng học & bộ ảnh Unsplash
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useAuth.ts               # Hook quản lý phiên đăng nhập
│   │   ├── useBookingActions.ts     # Hook xử lý logic đặt phòng
│   │   ├── useBookingSlots.ts       # Hook tính toán trạng thái slot theo ngày
│   │   ├── useRealtimeQuery.ts      # Hook kết nối realtime TanStack Query
│   │   └── useRoomFilters.ts        # Hook tìm kiếm không dấu & lọc đa tiêu chí
│   ├── store/
│   │   └── useBookingStore.ts       # Zustand store (User, Filters, Favorites, Settings)
│   ├── types/                       # Khai báo TypeScript types (Room, Booking...)
│   └── utils/                       # Hàm tiện ích (Xử lý ngày giờ, Chuẩn hóa chuỗi)
├── tests/
│   └── booking-regressions.test.cjs # Bộ kiểm thử tự động chống xung đột đặt phòng
├── app.json                         # Cấu hình dự án Expo & Native Plugins
├── package.json                     # Danh sách dependencies & scripts
├── tsconfig.json                    # Cấu hình TypeScript
└── README.md                        # Tài liệu hướng dẫn dự án
```

---

<a id="12-gioi-han-va-huong-phat-trien"></a>

## 12. Hướng phát triển

- [ ] Tích hợp tính năng Quét mã QR trực tiếp tại cửa phòng học để sinh viên check-in tức thời qua camera.
- [ ] Bổ sung bảng điều khiển dành riêng cho Quản trị viên (Admin Dashboard) để duyệt phòng học đặc biệt hoặc đánh dấu phòng bảo trì.
- [ ] Tích hợp thông báo đẩy từ xa (Remote Push Notifications qua Firebase Cloud Messaging).
- [ ] Liên kết đồng bộ lịch học với Google Calendar của sinh viên.
