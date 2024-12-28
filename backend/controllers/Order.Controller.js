import { Order } from '../models/Order.js'
import { Employe } from '../models/Employe.js'
import { Client } from '../models/Client.js'
import { sendMail } from '../helpers/email.helper.js'

export const findAll = async ( req, res, next ) => {
  const orders = await Order.find()
  res.json({
    success: true,
    orders: orders
  })
}

export const getHistory = async ( req, res, next ) => {
  const id = req.params.id;
  const orders = await Order.find({ clientId: id })
  res.json({
    success: true,
    orders: orders
  })
}

export const create = async ( req, res, next ) => {
  const { clientId, items, restaurantId, totalPrice, paymentType, paid, state } = req.body;
  let order = new Order({
    clientId:clientId, 
    items:items, 
    restaurantId:restaurantId, 
    totalPrice:totalPrice, 
    paymentType:paymentType, 
    paid:paid,
    state:state, 
  });
  order.save().then(()=> {
    res.json({
      success: true,
      message: "Đơn hàng của bạn đã được tạo thành công"
    });
  }).catch(err => {
    res.json({
      success: false,
      message: `Không thể tạo đơn hàng này!`
    });
  })
}

export const handleStatus = async ( req, res, next ) => {
  const id = req.params.id;
  const status = req.body.status
  await Order.findByIdAndUpdate(
    {_id: id},
    {$set:{status:status}}, 
    { new: true}
  )
  .then(() => {
    res.json({
      success: true,
      message: "Đơn hàng đã được cập nhật thành công"
    });
  })
  .catch(err => {
    res.json({
      success: false,
      message: `Không thể cập nhật đơn hàng có id=${id}.`
    });
  });
}

export const affect = async ( req, res, next ) => {
  const id = req.params.id;
  const {employeId} = req.body

  const employe = await Employe.findOne({ _id:employeId })

  await Order.findByIdAndUpdate(
    {_id: id},
    {employeId:employeId}, 
    {new: true}
  )
  .then((docs) => {
    Client.findOne({_id: docs.clientId}).then((client) => {
      var message = {
        from: "shopeefood@application.com",
        to: employe.email,
        subject: "Có đơn tới nè ",
        html: "<p> Hé lô <strong>"+employe.name+' '+employe.surname+"</strong> Có người đặt đơn tới rồi nè :D </p> <br>"+
              "Họ và tên khách hàng: "+client.name+' '+client.surname+ "<br>"+
              "Thông tin liên hệ: "+client.phone+" || "+ client.email+ "<br>"+
              "Địa chỉ nhận hàng:"+client.adresse+"<br>"+
              "Mã đơn hàng:"+docs._id+"<br>"+
              "Món: <br>"+
              docs.items.map((item, index) => (
                "<strong>"+item.name+"</strong><br>"
              ))
              +
              "Tổng tiền: "+ docs.totalPrice+"<br>"+
              "Hình thức thanh toán: "+docs.paymentType+"<br>"+
              "Tiền công: "+docs.paid+"<br>"
      }
      let mail = sendMail(message);
      res.json({
        success: true,
        message: "Đơn hàng đã được xử lý thành công!",
        commande: docs
      });
    })

  })
  .catch(err => {
    res.json({
      success: false,
      message: `Không thể cập nhật đơn hàng có id=${id}.`
    });
  });
}

export const remove = async ( req, res, next ) => {
  const id = req.params.id;
  await Order.deleteOne({_id: id})
  .then(() => {
    res.json({
      success: true,
      message: "Đã xóa đơn hàng thành công!"
    });
  })
  .catch(err => {
    res.json({
      success: false,
      message: `Không thể xóa đơn hàng có id=${id}.`
    });
  });
}

