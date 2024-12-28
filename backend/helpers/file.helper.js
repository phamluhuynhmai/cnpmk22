import multer from 'multer';

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  // Định nghĩa thư mục lưu file upload
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  // Định nghĩa tên file khi lưu
  filename: (req, file, cb) => {
    // Tạo tên file bằng thời gian hiện tại + tên gốc của file
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  },
});

// Kiểm tra loại file được phép upload
const filefilter = (req, file, cb) => {
  // Chỉ cho phép upload các file ảnh có định dạng png, jpg, jpeg
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ) {
    cb(null, true);
  } else {
    // Từ chối các file không phải ảnh
    cb(null, false);
  }
};

// Tạo middleware upload với cấu hình đã định nghĩa
const upload = multer({storage: storage, fileFilter: filefilter});

export { upload };