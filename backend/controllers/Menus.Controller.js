import { Item } from '../models/Item.js'
import { Menu } from './../models/Menu.js'

// Tìm tất cả các menu
export const findAll = async ( req, res, next ) => {
  const menus = await Menu.find()
  res.json({
    success: true,
    menus: menus
  })
}

// Tìm menu theo nhà hàng
export const findByRestaurent = async ( req, res, next ) => {
  const id = req.params.id; // Lấy ID nhà hàng từ params
  const menus = await Menu.find({
    restaurantId:id,
  });
  res.json({
    success: true,
    menus: menus
  })
}

// Tìm các món ăn trong menu
export const findMenuItems = async ( req, res, next ) => {
  const id = req.params.id;

  // Lấy ngày tháng năm hiện tại
  const dd = new Date().getDate();
  const mm = new Date().getMonth() + 1;
  const yyyy = new Date().getFullYear();

  //await Menu.findOne({
    await Menu.find({
    restaurentId:id,
  }).sort({createdAt:-1}) // Sắp xếp theo thời gian tạo mới nhất
  .then((menu) => {
    console.log(menu)
    // Tìm tất cả các món ăn thuộc menu này
    Item.find({menuId: menu._id})
    .then((items) => {
      res.json({
        success: true,
        menu:menu,
        items:items
      })
    })
   //Kiểm tra menu theo ngày
    menus.forEach((menu) => {
      if(menu.jour.getDate() == dd && menu.jour.getMonth() + 1 == mm){
        Item.find({menuId: menu._id})
        .then((items) => {
          res.json({
            success: true,
            menu:menu,
            items:items
          })
        })
      }
    })

  }).catch(err => {
    res.send(err)
  })
}

// Tạo menu mới
export const create = async ( req, res, next ) => {
  const { day, name, restaurantId } = req.body;
  // Kiểm tra xem menu đã tồn tại chưa
  await Menu.find({name:name, day:day, restaurantId:restaurantId})
  .then(result => {
    if(result.length >=1) {
      res.json({
        success: false,
        message: "Menu này đã tồn tại!"
      });
    }else {
      // Tạo menu mới
      let menu = new Menu ({
        day:day, 
        name:name, 
        restaurantId:restaurantId, 
      })
      menu.save().then(()=> {
        res.json({
          success: true,
          message: "Tạo menu thành công."
        });
      }).catch(err => {
        res.json({
          success: false,
          message: `Không thể tạo menu này.`
        });
      })
    }
  })
}

// Cập nhật menu
export const update = async ( req, res, next ) => {
  const id = req.params.id;
  const { day, name } = req.body;
  await Menu.findByIdAndUpdate(
    {_id: id},
    {
      $set:{
        name:name, 
        day:day
      }
    }, 
    {new: true } // Trả về document đã được cập nhật
  )
  .then(() => {
    res.json({
      success: true,
      message: "Cập nhật menu thành công."
    });
  })
  .catch(err => {
    res.json({
      success: false,
      message: `Không thể cập nhật menu với id=${id}.`
    });
  });
}

// Xóa menu
export const remove = async ( req, res, next ) => {
  const id = req.params.id;
  await Menu.deleteOne({ _id:id })
  .then(() => {
    // Xóa tất cả các món ăn thuộc menu này
    Item.deleteMany({menuId:id})
    .then(() => {
      res.json({
        success: true,
        message: "Xóa menu thành công!"
      });
    })
  })
  .catch(err => {
    res.json({
      success: false,
      message: `Không thể xóa menu với id=${id}.`
    });
  });
}