export const resources = {
  vi: {
    Toast: {
      ForgotLoginData: {
        severity: "info",
        summary: "Tài khoản hoặc mật khẩu không đúng",
        detail: "Vui lòng kiểm tra lại.",
        life: 5000,
      },
      Unauthorized: {
        summary: "Phiên đăng nhập hết hạn",
        detail: "Tự động chuyển sang trang đăng nhập trong 3 giây.",
      },
      LoginSuccess: {
        severity: "success",
        summary: "Đăng nhập thành công",
        detail: "Tự động chuyển sang trang chủ.",
        life: 500,
      },
      NetworkError: {
        severity: "error",
        summary: "Không nhận được phản hồi từ máy chủ",
        detail: "Có thể máy chủ bị lỗi hoặc bạn không có kết nối mạng.",
        life: 5000,
      },
      UnKnowError: {
        severity: "error",
        summary: "Lỗi",
        detail: "Hệ thống bị lỗi, vui lòng thử lại sau.",
        life: 5000,
      },
    },
  },
  en: {
    Toast: {
      ForgotLoginData: {
        severity: "info",
        summary: "Username or password is incorrect",
        detail: "Please check again.",
        life: 5000,
      },
      Unauthorized: {
        summary: "Login session expired",
        detail: "Automatically switch to the login page in 3 seconds.",
      },
      LoginSuccess: {
        severity: "success",
        summary: "Successful login",
        detail: "Automatically switch to the home page.",
        life: 500,
      },
      NetworkError: {
        severity: "error",
        summary: "Cannot receive server's response",
        detail:
          "Maybe the server is down or you don't have a network connection.",
        life: 5000,
      },
      UnKnowError: {
        severity: "error",
        summary: "Error",
        detail: "System error, please try again later.",
        life: 5000,
      },
    },
  },
};
