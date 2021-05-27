// pages/mallConfirmOrder/mallConfirmOrder.js
const HTTP = require('../../utils/httputils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //控制设置密码框的展示类型  0关闭  1设置密码  2输入密码 3忘记密码输入验证码  4重置密码
    setPasswordType:0,
    tipsPasswordShow:false,
    // 输入框参数设置
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "88rpx",//输入框高度
      width: "100%",//输入框宽度
      see: false,//是否明文展示
      interval: false,//是否显示间隔格子
    },
    inputData1: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: false,//输入框的聚焦状态
      focus_class: false,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "88rpx",//输入框高度
      width: "100%",//输入框宽度
      see: false,//是否明文展示
      interval: false,//是否显示间隔格子
    },
    inputValue:null,
    inputValue1:null,
    time1:null,//发送验证码的计时器
    second:60,
    goodsId:null,//商品id
    firstImg: "",//首图
    name: "",//商品名称
    orangeValue: 0,//价格
    buyCount:1,//购买数量
    address:{
      id:null,
      name:'',
      phone:'',
      pro:'',
      city:'',
      area:'',
      detailAddress:'',
      isDefault:true,
    },
    orderKey:null,
    time2:null,
    payWay:1,// 1 杨桃支付  2微信支付
  },

  // 当组件输入数字6位数时的自定义函数
  valueSix(e) {
    console.log(e.detail);
    this.data.inputValue=e.detail;
    this.setData({
      inputData1:{
        input_value: "",//输入框的初始内容
        value_length: 0,//输入框密码位数
        isNext: false,//是否有下一步的按钮
        get_focus: true,//输入框的聚焦状态
        focus_class: true,//输入框聚焦样式
        value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
        height: "88rpx",//输入框高度
        width: "100%",//输入框宽度
        see: false,//是否明文展示
        interval: false,//是否显示间隔格子
      }
    })
  },
  valueSix1(e) {
    console.log(e.detail);
    this.data.inputValue1=e.detail;
  },
  getOrderkey(){
    HTTP.get('/api/v1/user/pay/gen/orderkey',{},(data)=>{
      if(data.code == 200){
        this.setData({
          orderKey: data.data,
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
  changePayWay(e){
    this.setData({
      payWay:e.currentTarget.dataset.payway
    })
  },
//控制设置密码框的展示类型  0关闭  1设置密码  2输入密码 3忘记密码输入验证码  4重置密码
  openSetPassword1() {
    this.resetInput();
    this.setData({
      setPasswordType: 1,
    })
  },
  openSetPassword2() {
    this.resetInput();
    this.setData({
      setPasswordType: 2,
    })
  },
  openSetPassword3() {
    this.resetInput();
    this.setData({
      setPasswordType: 3,
    })
  },
  openSetPassword4() {
    this.resetInput();
    this.setData({
      setPasswordType: 4,
    })
  },
  closeSetPassword(){
    this.resetInput();
    this.setData({
      setPasswordType: 0,
    })
  },
  resetInput(){
    this.setData({
      inputValue:null,
      inputValue1:null,
      inputData: {
        input_value: "",//输入框的初始内容
        value_length: 0,//输入框密码位数
        isNext: false,//是否有下一步的按钮
        get_focus: true,//输入框的聚焦状态
        focus_class: true,//输入框聚焦样式
        value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
        height: "88rpx",//输入框高度
        width: "100%",//输入框宽度
        see: false,//是否明文展示
        interval: false,//是否显示间隔格子
      },
      inputData1: {
        input_value: "",//输入框的初始内容
        value_length: 0,//输入框密码位数
        isNext: false,//是否有下一步的按钮
        get_focus: false,//输入框的聚焦状态
        focus_class: false,//输入框聚焦样式
        value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
        height: "88rpx",//输入框高度
        width: "100%",//输入框宽度
        see: false,//是否明文展示
        interval: false,//是否显示间隔格子
      },
    })
  },
  openTipsPassword() {
    this.setData({
      tipsPasswordShow: true,
    })
  },
  closeTipsPassword() {
    this.setData({
      tipsPasswordShow: false,
    })
  },
  goToSetPassword(){
    this.closeTipsPassword();
    this.openSetPassword1();
  },
  clickSetPassword(){
    if (this.data.inputValue.length!==6){
      wx.showToast({
        icon:"none",
        title: "密码长度为6",
        duration: 2000
      })
      return
    }
    if (this.data.inputValue!==this.data.inputValue1){
      wx.showToast({
        icon:"none",
        title: "两次密码输入不一致",
        duration: 2000
      })
      return
    }
    let data={phone:17638172927,payPassword:this.data.inputValue1};
    if(this.setPasswordType===4){//此时为重置密码
      data.code = this.data.code;
    }
    HTTP.post('/api/v1/user/user/info/set/password',data,(data)=>{
      if(data.code == 200){
        wx.showToast({
          icon:"none",
          title: '密码设置成功',
          duration: 2000
        })
        this.closeSetPassword();
      } else {
        wx.showToast({
          icon:"none",
          title: data.message,
          duration: 2000
        })
      }
    })
  },
  clickSendCode(){
    HTTP.post('/api/v1/user/user/info/send/code',{phone:17638172927},(data)=>{
      if(data.code == 200){
        clearInterval(this.data.time1)
        this.data.time1 = setInterval(()=>{
          this.data.second-=1;
          this.setData({
            second:this.data.second
          })
          if (this.data.second<=0){
            this.setData({
              second:60
            })
            clearInterval(this.data.time1)
          }
        },1000)
        wx.showToast({
          icon:"none",
          title: '验证码发送成功',
          duration: 2000
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
  clickCheckCode(){
    if(this.data.inputValue===null){
      wx.showToast({
        icon:"none",
        title: '请输入验证码',
        duration: 2000
      })
      return
    }
    if(this.data.inputValue.length!==6){
      wx.showToast({
        icon:"none",
        title: '请输入正确的验证码',
        duration: 2000
      })
      return
    }
    HTTP.post('/api/v1/user/user/info/check/code',{phone:17638172927,code:this.data.inputValue},(data)=>{
      if(data.code == 200){
        this.data.code = this.data.inputValue;
        this.openSetPassword4();
      } else {
        wx.showToast({
          icon:"none",
          title: data.message,
          duration: 2000
        })
      }
    })
  },
  //提交订单

  openPay(){
    //1.是否已经设置密码
    HTTP.get('/api/v1/user/user/info/is/have/password',{},(data)=>{
      console.log(data)
      if(data.code == 200){
        if(data.data){//有密码
          this.openSetPassword2();
        } else {
          this.openTipsPassword();
          wx.showToast({
            title: '请先设置杨桃密码',
            icon: 'none'
          })
        }
      } else {
        wx.hideLoading();
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      let res = JSON.parse(options.value);
      this.setData({
        goodsId:res.goodsId,//商品id
        firstImg: res.firstImg,//首图
        name: res.name,//商品名称
        orangeValue: res.orangeValue,//价格
        buyCount:res.buyCount,//购买数量
      })
    }
    this.getAddress();
    this.getOrderkey();
  },
  getAddress(){
    HTTP.get('/api/v1/user/address/get/default/address', {},(data)=>{
      if(data.code == 200){
        let address = {};
        address.id = data.data.id;
        address.name = data.data.name;
        address.phone = data.data.phone;
        address.pro = data.data.pro;
        address.city = data.data.city;
        address.area = data.data.area;
        address.detailAddress = data.data.detailAddress;
        address.isDefault = data.data.isDefault;
        this.setData({
          address:address
        })
        getApp().globalData.address = address;
      } else {
        wx.showToast({
          icon:"none",
          title: data.message,
          duration: 2000
        })
      }
    })
  },
  bindAddress(){
    wx.navigateTo({
      url: "/pages/mallSelectAddress/mallSelectAddress?type=select"
    })
  },
  goPay(){
    if (this.data.address.id==null){
      wx.showToast({
        icon:"none",
        title: '请填写地址',
        duration: 2000
      })
      return;
    }
    if (this.data.inputValue.length<6){
      wx.showToast({
        icon:"none",
        title: '请填写密码',
        duration: 2000
      })
      return;
    }
    let params={
      type:2,
      buyAmount:this.data.buyCount,
      buyGoodsId:this.data.goodsId,
      addressId:this.data.address.id,
      payPassword:this.data.inputValue,
      orderKey:this.data.orderKey
    }
    if (this.data.payWay == 2){
      params.wxType = 1
    }
    //如果选择了微信支付 还要加一个参数 wxType:1;
    HTTP.post('/api/v1/user/pay/minipay',params,(data)=>{
      if(data.code == 200){
        wx.showLoading({
          mask:true,
        });
        this.data.time2 = setInterval(()=>{
          this.getOrderStatus();
        },1000)
        console.log(this.data.time2)
      } else {
        wx.showToast({
          icon:"none",
          title: data.message,
          duration: 2000
        })
      }
    })
  },
  getOrderStatus(){
    HTTP.get('/api/v1/user/pay/get/order/status',{orderKey:this.data.orderKey},(data)=>{
      if(data.code == 422){
      } else {
        clearInterval(this.data.time2)
        wx.showToast({
          icon:"none",
          title: data.data,
          duration: 2000
        })
        setTimeout(()=>{
          wx.hideLoading();
          wx.navigateBack();
        },1000)
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
    if(getApp().globalData.address){
      this.setData({
        address:getApp().globalData.address
      })
    }
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
