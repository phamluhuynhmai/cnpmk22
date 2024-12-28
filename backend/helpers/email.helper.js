import nodemailer from 'nodemailer'

export const sendMail = async (message) => {

  // Tạo tài khoản test để gửi email
  let testAccount = await nodemailer.createTestAccount();

  // Tạo đối tượng transporter sử dụng SMTP transport mặc định
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true cho port 465, false cho các port khác
    auth: {
      user: testAccount.user, // tài khoản ethereal được tạo tự động
      pass: testAccount.pass, // mật khẩu ethereal được tạo tự động
    },
  });

  // Gửi email với đối tượng transport đã định nghĩa
  let info = await transporter.sendMail(message);
  console.log("Đã gửi email: %s", info.messageId);
  // Ví dụ ID email đã gửi: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // URL xem trước chỉ khả dụng khi gửi qua tài khoản Ethereal
  console.log("URL xem trước: %s", nodemailer.getTestMessageUrl(info));
  // URL xem trước: https://ethereal.email/message/WaQKMgKddxQDoou...
  const previewUrl = nodemailer.getTestMessageUrl(info)
  return previewUrl;

}