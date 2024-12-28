import { Restaurant } from '../models/Restaurant.js'
import { Menu } from '../models/Menu.js'

// Lấy tất cả quán ăn
export const findAll = async ( req, res, next ) => {
  const restaurants = await Restaurant.find()
  res.json({
    success: true,
    restaurants: restaurants
  })
}

// Tạo quán ăn mới
export const create = async ( req, res, next ) => {
  // Lấy thông tin từ request body
  const { name, state, speciality, address, phone } = req.body;
  const image = req.file.path;

  // Kiểm tra xem quán ăn đã tồn tại chưa
  await Restaurant.find({
    name:name, // Tên quán ăn
    state:state, // Tỉnh/thành phố
    speciality:speciality, // Món đặc trưng/chuyên môn
    address:address, // Địa chỉ
    phone:phone // Số điện thoại
  })
  .then(result => {
    // Nếu tìm thấy quán ăn đã tồn tại
    if(result.length >=1) {
      res.json({
        success: false,
        message: "quán ăn này đã tồn tại!"
      });
    } else {
      // Tạo đối tượng quán ăn mới
      let restaurant = new Restaurant({
        name:name,
        state:state,
        image:image,
        speciality:speciality,
        address:address,
        phone:phone
      })
      // Lưu vào database
      restaurant.save().then(()=> {
        res.json({
          success: true,
          message: "Thêm quán ăn mới thành công."
        });
      }).catch(err => {
        res.json({
          success: false,
          message: `Không thể thêm quán ăn này.`
        });
      })
    }
  })
}

// Cập nhật thông tin quán ăn
export const update = async ( req, res, next ) => {
  const id = req.params.id;
  const { name, state, speciality, address, phone } = req.body;
  const image = req.file.path;

  // Tìm và cập nhật quán ăn theo ID
  await Restaurant.findByIdAndUpdate(
    {_id:id},
    {
      $set:{
        name:name,
        state:state,
        image:image,
        speciality:speciality,
        address:address,
        phone:phone
      }
    },
    { new:true } // Trả về document đã được cập nhật
  )
  .then(() => {
    res.json({
      success: true,
      message: "Cập nhật thông tin quán ăn thành công."
    });
  })
  .catch(err => {
    res.json({
      success: false,
      message: `Không thể cập nhật quán ăn có id=${id}.`
    });
  });
}

// Xóa quán ăn
export const remove = async ( req, res, next ) => {
  const id = req.params.id;
  // Xóa quán ăn theo ID
  await Restaurant.deleteOne({_id:id})
  .then(() => {
    // Sau khi xóa quán ăn, xóa tất cả menu của quán ăn đó
    Menu.deleteMany({restaurantId:id})
    .then(() => {
      res.json({
        success: true,
        message: "Xóa quán ăn thành công!"
      });
    })
  })
  .catch(err => {
    res.json({
      success: false,
      message: `Không thể xóa quán ăn có id=${id}.`
    });
  });
}