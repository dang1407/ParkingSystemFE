# Hướng dẫn chạy code dự án

## Frotend

- Để chạy dự án Frontend thì cần cài đặt **pnpm** và Visual Studio Code (VS Code)
- Đưa file zip Frontend vào một thư mục mới, sau đó giải nén tại đây. Mở thư mục vừa tạo mới đó bằng VS Code, sau đó sử dụng terminal của VS Code cài đặt tất cả các thư viện bằng câu lệnh:

```code
pnpm install
```

- Sau đó chạy chương trình bằng lệnh:

```code
pnpm start
```

- Chương trình Frotend sẽ chạy ở localhost:5173

## Backend C# Web API

- Cài đặt Visual Studio (đảm bảo cài đặt môi trường C# run time)
- Giải nén file WebAPI.zip, mở file WebAPI.csproj bằng cách click đúp vào file. Sau đó project sẽ được mở lên bằng Visual Studio
- Nhấn Ctrl F5 để chạy chương trình. Chương trình sẽ chạy ở localhost:7027

## Cơ sở dữ liệu

- Cài đặt phần mềm MySQL Workbench vào tạo một cơ sở dữ liệu parkingsystem.
- Mở phần mềm MySQL Workbench và tạo một kết nối đến địa chỉ localhost:3306
- Tạo một cơ sở dữ liệu tên là parkingsystem. Vào server chọn Data Import, chọn Default Database là parkingsystem và chọn đường dẫn file import là đường dẫn đến file parkingsystem_v2.sql thu được khi giải nén file zip báo cáo. Nhấn Start Import là hoàn thành việc thiết lập cơ sở dữ liệu.

## Mô hình nhận diện biển số xe

- Cài đặt Pycharm Community
- Giải nén file License-Plate-Recognition.zip và thu được code dự án, mở dự án bằng Pycharm.
- Cài đặt các thư viện cần thiết bằng lệnh:

```code
pip install -r requirement.txt
```

- Download model nhận diện biển số xe tại: [Model](https://drive.google.com/file/d/1_gbnwjc5wFpQxeY7MdEwp3mGcl1c05k2/view?usp=sharing) và đưa phần model đã giải nén vào thư mục model trong dự án
- Download mô hình yolov5 tại link: [Yolov5](https://drive.google.com/file/d/1g1u7M4NmWDsMGOppHocgBKjbwtDA-uIu/view) và đưa vào thư mục yolov5

- Chạy dự án bằng giao diện hoặc bằng lệnh:

```code
python app.py
```

## Raspberry Pi

- Cài đặt phần mềm Raspberry Pi Imager, chuẩn bị một thẻ nhớ SD Card và kết nối với máy tính.
- Nạp hệ điều hành 32 bit full cho Raspberry Pi, cấu hình lại wifi sẽ kết nối đến.
- Cài đặt Bonjour Printer tại [Link](https://support.apple.com/en-us/106380)
- Chạy Bonjour Printer
- Đảm bảo máy tính và Raspberry Pi cùng kết nối đến một mạng LAN (Wifi or Ethernet)
- Tìm kiếm địa chỉ của Pi bằng lệnh

```code
ping raspberrypi
```

- Thực hiện kết nối đến pi bằng lệnh ssh thông qua CMD:

```cmd
ssh pi@<ip_cua_pi>
```

hoặc nhập ip vào phần mềm Putty

- Xem địa chỉ ip của máy tính trong mạng và sửa vào file raspberrypi.py ở mục url
- Nạp file code raspberrypi.py vào Raspberry Pi bằng lệnh pscp

- Cài thư viện requests trên Raspberry Pi bằng lệnh:

```code
pip install requests --break-system-packages
```

- Chạy code bằng lệnh:

```python
python raspberrypi.py
```

- Thực hiện chụp ảnh bằng nút bấm.


   (i) Nhúng Vue vào trang HTML thuần
    (ii) Xây dựng ứng dụng Single-Page Application (SPA)
    (iii) Fullstack / Server-Side Rendering (SSR)
    (iv) Jamstack / Static Site Generation (SSG)
    (v) Targeting desktop, mobile, WebGL, and even the terminal