import { Employe } from './../models/Employe.js';
import bcrypt from 'bcrypt'; // module mã hóa mật khẩu
import validator from 'validator'; // module xác thực email
import { sendMail } from './../helpers/email.helper.js'; // module gửi email

// lấy danh sách tất cả nhân viên
const findAll = async (req, res, next) => {
  try {
    const employes = await Employe.find();
    res.json({
      success: true,
      employes: employes, // trả về danh sách nhân viên
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Lỗi khi lấy danh sách nhân viên.",
      error: error.message,
    });
  }
};

// tìm nhân viên theo trạng thái và có sẵn
const findByState = async (req, res, next) => {
  const state = req.params.state; // trạng thái được truyền từ URL
  try {
    const employes = await Employe.find({ state: state, available: true });
    res.json({
      success: true,
      employes: employes,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Lỗi khi tìm nhân viên theo trạng thái.",
      error: error.message,
    });
  }
};

// tạo mới nhân viên
const create = async (req, res, next) => {
  const { name, surname, phone, email, password, state, restaurantId } = req.body;

  try {
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Định dạng email không hợp lệ!",
      });
    }

    const existingEmployee = await Employe.findOne({ email });
    if (existingEmployee) {
      return res.json({
        success: false,
        message: "Email đã tồn tại!",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const employe = new Employe({
      name,
      surname,
      phone,
      email,
      password: hash,
      state,
      restaurantId,
    });

    const message = {
      from: "shopeefood@application.com",
      to: email,
      subject: "Tài khoản nhân viên mới",
      html: `<p>Xin chào, <strong>${name} ${surname}</strong></p> 
             <br> <p>Email và mật khẩu tài khoản của bạn là: 
             <strong>${email}</strong> ****** Mật khẩu: <strong>${password}</strong></p>`,
    };

    await employe.save();
    await sendMail(message);

    return res.json({
      success: true,
      message: "Đã tạo nhân viên thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi tạo nhân viên:", error);
    return res.json({
      success: false,
      message: "Không thể tạo nhân viên này.",
      error: error.message,
    });
  }
};

// cập nhật trạng thái khả dụng của nhân viên
const available = async (req, res, next) => {
  const id = req.params.id; // lấy ID từ URL
  const available = req.body.available; // lấy trạng thái khả dụng từ body
  try {
    await Employe.findByIdAndUpdate(
      { _id: id },
      { $set: { available } },
      { new: true }
    );
    res.json({
      success: true,
      message: "Trạng thái nhân viên đã được cập nhật thành công.",
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Không thể cập nhật trạng thái của nhân viên có id=${id}.`,
      error: error.message,
    });
  }
};

// cập nhật thông tin nhân viên
const update = async (req, res, next) => {
  const id = req.params.id;
  const { name, surname, phone, email, password, state, restaurantId } = req.body;

  try {
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Định dạng email không hợp lệ!",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const updatedEmploye = await Employe.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          surname,
          phone,
          email,
          password: hash,
          state,
          restaurantId,
        },
      },
      { new: true }
    );

    if (!updatedEmploye) {
      return res.json({
        success: false,
        message: `Không tìm thấy nhân viên có id=${id}.`,
      });
    }

    const message = {
      from: "shopeefood@application.com",
      to: email,
      subject: "Cập nhật tài khoản nhân viên",
      html: `<p>Xin chào, <strong>${name} ${surname}</strong></p> 
             <br> <p>Email và mật khẩu tài khoản của bạn là: 
             <strong>${email}</strong> ****** Mật khẩu: <strong>${password}</strong></p>`,
    };

    await sendMail(message);

    res.json({
      success: true,
      message: "Thông tin nhân viên đã được cập nhật thành công.",
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Không thể cập nhật nhân viên có id=${id}.`,
      error: error.message,
    });
  }
};

// xóa nhân viên
const remove = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Employe.deleteOne({ _id: id });
    res.json({
      success: true,
      message: "Đã xóa nhân viên thành công!",
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Không thể xóa nhân viên có id=${id}.`,
      error: error.message,
    });
  }
};

// xuất các hàm để sử dụng ở nơi khác
export { findAll, findByState, create, available, update, remove };