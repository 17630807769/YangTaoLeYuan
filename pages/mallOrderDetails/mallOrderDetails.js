// pages/mallOrderDetails/mallOrderDetails.js
const HTTP = require('../../utils/httputils');
const Util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "",
    addressName: "",
    addressPhone: "",
    createTime: "",
    firstImg: "",
    goodsAmount: 0,
    goodsOneMoney: 0,
    id: 0,
    name: "",
    orangeMoney: 0,
    goodsType:1,
    orderNumber: "",
    status: -1,
    statusText:'',
    createTimeText:'',
    trackingNumber:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderDetail(options.orderId);
  },
  getOrderDetail(id){
    HTTP.get('/api/v1/user/order/get/detail/'+id,{},(data)=>{
      if(data.code == 200){
        let statusText='';
        switch (data.data.status) {
          case 1:
            statusText = '待发货'
            break;
          case 2:
            statusText = '已发货'
            break;
          case 3:
            statusText = '已完成'
            break;
          case -1:
            statusText = '已取消'
            break;
        }
        let createTimeText = Util.timeFuc2(data.data.createTime);
        this.setData({
          address: data.data.address,
          addressName:  data.data.addressName,
          addressPhone:  data.data.addressPhone,
          createTime:  data.data.createTime,
          firstImg:  data.data.firstImg,
          goodsAmount: data.data.goodsAmount,
          goodsOneMoney:  data.data.goodsOneMoney,
          id:  data.data.id,
          name:  data.data.name,
          orangeMoney:  data.data.totalMoney,
          goodsType:data.data.goodsType,
          orderNumber:  data.data.orderNumber,
          trackingNumber: data.data.trackingNumber,
          status: data.data.status,
          statusText:statusText,
          createTimeText:createTimeText,
        })
      } else {
        wx.showToast({
          icon:"none",
          title: data.message,
          duration: 2000
        })
      }
    })
  },
  clickLook(){
    wx.navigateTo({
      url: "/pages/mallLookExpress/mallLookExpress?orderId="+this.data.id
    })
  },
  clickConfirm(){
    HTTP.put('/api/v1/user/order/confirm/order/'+this.data.id,{},(data)=>{
      if(data.code == 200){
        wx.showToast({
          icon:"none",
          title: '确认收货成功',
          duration: 2000
        });
        // 0全部 1待发货 2已发货 3已完成 -1已取消
        this.setData({
          status:3,
          statusText:'已完成'
        })
      } else {
        wx.showToast({
          icon:"none",
          title: data.message,
          duration: 2000
        })
      }
    })
  },
  clickCancel(){
    HTTP.put('/api/v1/user/order/cancle/order/'+this.data.id,{},(data)=>{
      if(data.code == 200){
        wx.showToast({
          icon:"none",
          title: '取消订单成功',
          duration: 2000
        });
        // 0全部 1待发货 2已发货 3已完成 -1已取消
        this.setData({
          status:-1,
          statusText:'已取消'
        })
      } else {
        wx.showToast({
          icon:"none",
          title: data.message,
          duration: 2000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
