import { Restaurant } from '../models/Restaurant.js'
import { Menu } from '../models/Menu.js'

export const findAll = async ( req, res, next ) => {
  const restaurants = await Restaurant.find()
  res.json({
    success: true,
    restaurants: restaurants
  })
}

export const create = async ( req, res, next ) => {
  const { name, state, speciality, address, phone } = req.body;
  const image = req.file.path;

  await Restaurant.find({
    name:name,
    state:state,
    speciality:speciality,
    address:address,
    phone:phone
  })
  .then(result => {
    if(result.length >=1) {
      res.json({
        success: false,
        message: "thể loại này đã tồn tại!"
      });
    } else {
      let restaurant = new Restaurant({
        name:name,
        state:state,
        image:image,
        speciality:speciality,
        address:address,
        phone:phone
      })
      restaurant.save().then(()=> {
        res.json({
          success: true,
          message: "Thêm thể loại mới thành công."
        });
      }).catch(err => {
        res.json({
          success: false,
          message: `Không thể thêm thể loại này.`
        });
      })
    }
  })
}

export const update = async ( req, res, next ) => {
  const id = req.params.id;
  const { name, state, speciality, address, phone } = req.body;
  const image = req.file.path;

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
    { new:true }
  )
  .then(() => {
    res.json({
      success: true,
      message: "Cập nhật thông tin thể loại thành công."
    });
  })
  .catch(err => {
    res.json({
      success: false,
      message: `Không thể cập nhật thể loại có id=${id}.`
    });
  });
}

export const remove = async ( req, res, next ) => {
  const id = req.params.id;
  await Restaurant.deleteOne({_id:id})
  .then(() => {
    Menu.deleteMany({restaurantId:id})
    .then(() => {
      res.json({
        success: true,
        message: "Xóa thể loại thành công!"
      });
    })
  })
  .catch(err => {
    res.json({
      success: false,
      message: `Không thể xóa thể loại có id=${id}.`
    });
  });
}