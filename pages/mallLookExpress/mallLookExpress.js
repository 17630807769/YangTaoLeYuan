// pages/mallLookExpress/mallLookExpress.js
const HTTP = require('../../utils/httputils');
const Util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "浙江省杭州市上城区否端啥都发阿斯蒂",
    addressName: "韩先生",
    addressPhone: "13523442344",
    createTime: "20201215170815",
    firstImg: "https://img.alicdn.com/imgextra/i2/1714128138/O1CN01bR8ins29zFnbfROKt_!!1714128138.jpg_430x430q90.jpg",
    goodsAmount: 2,
    goodsOneMoney: 99,
    id: 64,
    name: "99商品名称",
    orangeMoney: 198,
    orderNumber: "LYSHOP-1338772850940710912",
    trackingNumber:'',
    trackingCompany:'',
    status: -1,
    statusText:'',
    createTimeText:'',
    traces:[
    // {
    //   "AcceptTime": "2014/06/25 04:01:28",
    //   "AcceptStation": "快件在 深圳集散中心 ,准备送往下一站 深圳 [深圳市]",
    //   "Remark": null
    // },{
    //   "AcceptTime": "2014/06/25 04:01:28",
    //   "AcceptStation": "快件在 深圳集散中心 ,准备送往下一站 深圳 [深圳市]",
    //   "Remark": null
    // },
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderDetail(options.orderId);
    this.getLookExpress(options.orderId);
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
          orangeMoney:  data.data.orangeMoney,
          orderNumber:  data.data.orderNumber,
          status: data.data.status,
          trackingNumber: data.data.trackingNumber,
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
  getLookExpress(id){
    HTTP.get('/api/v1/user/order/get/express/'+id,{},(data)=>{
      if(data.code == 200){
        let result = data.data;
        this.setData({
          traces: result.Traces,
          trackingNumber: result.trackingNumber,
          trackingCompany: result.trackingCompany
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