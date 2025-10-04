# Hướng Dẫn Sử dụng AI để tự động hóa công việc

## Công cụ chuẩn bị
- Cursor: `[https://code.visualstudio.com/](https://cursor.com/download)` 
- Claude AI: `https://claude.ai/chat/`


## Chuẩn bị prompt
### Yêu cầu Prompt:
- Hãy giới thiệu bản thân là 1 người không biết gì về coding, đang cần 1 ứng dụng hỗ trợ cho công việc của mình.
- Dễ hiểu, ưu tiên các ngôn ngữ phổ biến và ít lỗi.
- Ưu tiên viết prompt bằng tiếng Anh, nếu cần hiểu tiếng Việt thì yêu cầu thêm.
- Hãy để AI tạo file README.md để hướng dẫn cài đặt.

### Prompt mẫu
#### Prompt đưa vào ChatGPT để viết lại
```
Viết lại prompt sau cho tôi bằng tiếng Anh
"Tôi là 1 người không biết gì về code, hãy viết 1 extension, sử dụng tiếng Việt, sử dụng ngôn ngữ phổ biến, ít lỗi, ổn định, với yêu cầu như sau:
- Tạo giao diện gồm phần nhập API Key của ChatGPT, ô nhập thời gian chờ giữa mỗi lần quét (đơn vị giây), nút on/off và nút lưu cấu hình.
- Mỗi x giây, quét url và tác vụ hiện tại của tôi để gửi lên ChatGPT phân tích, phân loại gồm học tập, làm việc, giải trí, sử dụng mạng xã hội và theo dõi tin tức.
+ Nếu là học tập và làm việc, hãy tạo ra câu động viên tôi.
+ Nếu là giải trí và sử dụng mạng xã hội, hãy nhắc nhở tôi tập trung vào công việc.
+ Nếu là theo dõi tin tức, hãy phân tích url và title của trang để tóm tắt tin tức ngắn gọn nhất có thể cho  tôi
- Khi hiện thông báo, hãy cho chạy ảnh gif bên góc phải màn hình để không ảnh hưởng đến tác vụ tôi đang làm.
- Câu trả lời được ChatGPT trả về sẽ được gen âm thành bằng google translate API và đọc ra ngoài màn hình cho tôi
- Viết file README.md để tôi có thể làm theo để cài đặt."
```

#### Prompt mẫu đã được tối ưu
```
I am someone who doesn’t know anything about coding. Please write an extension, in Vietnamese, using a popular, stable, and low-error programming language, with the following requirements:

Create an interface that includes:

An input field for the ChatGPT API Key

An input field for the time interval between each scan (in seconds)

An on/off toggle button

A save configuration button

Every x seconds, scan my current URL and activity, then send them to ChatGPT to analyze and classify into one of the following categories: studying, working, entertainment, social media usage, and news tracking.

If it’s studying or working, generate a motivational message for me.

If it’s entertainment or social media usage, remind me to stay focused on work.

If it’s news tracking, analyze the URL and page title to create the shortest possible news summary for me.

When displaying a notification, show an animated GIF in the bottom-right corner of the screen so it doesn’t interfere with what I’m doing.

The response returned by ChatGPT should be converted into speech using the Google Translate API and played aloud to me.

Write a README.md file with clear instructions so I can follow it to install the extension.
```
### Đưa lên Claude AI
<img width="1919" height="829" alt="image" src="https://github.com/user-attachments/assets/571e3ab0-1db9-4ff8-8ea6-3fc5b19d718d" />

#### Sau khi đã generate code xong, download hết các file về cùng 1 thư mục
<img width="922" height="824" alt="image" src="https://github.com/user-attachments/assets/19497218-5276-4d44-873c-db01af69fabf" />
<img width="915" height="825" alt="image" src="https://github.com/user-attachments/assets/865bb015-16e3-487e-8647-8eacbebc093c" />
<img width="1129" height="881" alt="image" src="https://github.com/user-attachments/assets/7b54460c-c910-42c7-9396-8bba5b80f625" />
#### Đặt lại tên file cho chuẩn
<img width="1136" height="875" alt="image" src="https://github.com/user-attachments/assets/9301004d-d023-4d82-b14f-d57f86574569" />



#### Import thử vào chrome
##### Nếu báo lỗi icons, hãy thêm ảnh vào, nhân bản lên và đặt tên icon16.png, icon48.png và icon128.png
<img width="1120" height="871" alt="image" src="https://github.com/user-attachments/assets/f569f022-873a-4977-896b-b6fa6e1faaa5" />

##### Cài thành công
<img width="600" height="735" alt="image" src="https://github.com/user-attachments/assets/4cc91b1c-0916-4d35-bc05-3ba9576c69bb" />

#### Kiểm thử
* Lưu ý: Sau khi import extension xong, cần F5 lại trang đang chạy để extension có thể thao tác vào được *
- Bấm vào nút service worker
<img width="601" height="302" alt="image" src="https://github.com/user-attachments/assets/b8307718-72b2-45d0-a83f-dd84b353d133" />


- Logs sạch, không có lỗi
<img width="1095" height="927" alt="image" src="https://github.com/user-attachments/assets/7396cb8f-3470-458d-9fc3-676ef2698887" />


- Check chức năng
<img width="1918" height="820" alt="image" src="https://github.com/user-attachments/assets/a4002197-7885-4d21-997f-d540def0e17e" />
-> Đã hiện thông báo nhưng chưa có âm thanh

#### Sửa lỗi bằng Cursor
##### Mở Cursor và import dự án
- Bấm File -> Open Folder
<img width="627" height="829" alt="image" src="https://github.com/user-attachments/assets/83390055-055e-4c64-94b5-159a2ba819d7" />

- Chọn folder extension và Select Folder
<img width="935" height="704" alt="image" src="https://github.com/user-attachments/assets/020c7b7b-18e5-43e0-addc-67a8656d6400" />

- Nhập Ctrl + L để mở ô chat bên trái, giải thích vấn đề đang gặp
- Prompt mẫu:
``` Hãy kiểm tra và sửa lỗi giúp tôi xem tại sao extension này lại không có âm thanh mặc dù pop up thông báo đã hiện ra sau mỗi lần quét thành công ```
<img width="411" height="322" alt="image" src="https://github.com/user-attachments/assets/63d6b969-4a54-48b9-8d85-04482da72961" />

- Làm theo hướng dẫn của AI
- <img width="407" height="507" alt="image" src="https://github.com/user-attachments/assets/d4fa9c29-089e-4a08-9149-2e445a4c664f" />

#### Kiểm tra lại, và hoàn thiện, mở rộng tính năng






