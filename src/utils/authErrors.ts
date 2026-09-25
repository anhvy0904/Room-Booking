export const getAuthErrorMessage = (error: unknown): string => {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
    case 'SIGN_IN_CANCELLED': return '';
    case 'auth/invalid-email': return 'Địa chỉ email không đúng định dạng.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'Email hoặc mật khẩu không chính xác.';
    case 'auth/email-already-in-use': return 'Email này đã được đăng ký tài khoản. Vui lòng đăng nhập.';
    case 'auth/weak-password': return 'Mật khẩu phải có ít nhất 6 ký tự.';
    case 'auth/network-request-failed': return 'Không thể kết nối. Hãy kiểm tra mạng và thử lại.';
    case 'auth/popup-blocked': return 'Trình duyệt đã chặn cửa sổ Google. Hãy cho phép cửa sổ bật lên rồi thử lại.';
    case 'auth/unauthorized-domain': return 'Địa chỉ web này chưa được cho phép đăng nhập. Vui lòng liên hệ quản trị viên.';
    case 'auth/operation-not-allowed': return 'Phương thức đăng nhập này chưa được kích hoạt.';
    case 'auth/account-exists-with-different-credential': return 'Email này đã dùng một phương thức đăng nhập khác. Vui lòng liên hệ quản trị viên.';
    case 'auth/too-many-requests': return 'Bạn đã thử nhiều lần. Hãy chờ một chút rồi thử lại.';
    case 'auth/user-disabled': return 'Tài khoản này đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.';
    case 'google/expo-go': return 'Đăng nhập Google trên điện thoại cần development build. Hãy dùng Email/Mật khẩu hoặc bản web.';
    case 'google/missing-config':
    case 'DEVELOPER_ERROR':
    case '10': return 'Cấu hình đăng nhập Google chưa hoàn tất. Vui lòng liên hệ quản trị viên.';
    case 'PLAY_SERVICES_NOT_AVAILABLE': return 'Vui lòng cài đặt hoặc cập nhật Google Play Services trên thiết bị.';
    case 'IN_PROGRESS': return 'Một yêu cầu đăng nhập đang được xử lý.';
    default: return typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : 'Thao tác chưa thành công. Vui lòng thử lại.';
  }
};

export const isGoogleUser = (user: { isAnonymous: boolean; providerData: { providerId: string }[] } | null): boolean =>
  !!user && !user.isAnonymous && user.providerData.some(provider => provider.providerId === 'google.com');

export const isValidAuthenticatedUser = (user: { isAnonymous: boolean; uid?: string } | null): boolean =>
  !!user && !user.isAnonymous && !!user.uid;
