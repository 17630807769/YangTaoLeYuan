// pages/phoneBind/phoneBind.js
const HTTP = require('../../utils/httputils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:null,
    code:null,
    second:60,
    time:null
  },
  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindCodeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode:function(){
    if(this.data.phone==null||this.data.phone.length!=11){
      wx.showToast({
        icon:"none",
        title: "请输入正确的手机号",
        duration: 2000
      })
      return
    }
    if(this.data.second>=60){
      HTTP.post('/api/v1/user/user/info/send/code',{phone:this.data.phone},(data)=>{
        if(data.code == 200){
          clearInterval(this.data.time);
          wx.showToast({
            icon:"none",
            title: "验证码发送成功",
            duration: 2000
          })
          this.data.second-=1;
          this.setData({
            second: this.data.second
          })
          this.data.time=setInterval(()=>{
            this.data.second-=1;
            this.setData({
              second: this.data.second
            })
            if(this.data.second<=0){
              clearInterval(this.data.time);
              this.setData({
                second: 60
              })
            }
          },1000)
        } else {
          wx.showToast({
            icon:"none",
            title: data.message,
            duration: 2000
          })
        }
      })
    }
  },
  clickBind(){
    if(this.data.phone==null||this.data.phone.length!=11){
      wx.showToast({
        icon:"none",
        title: "请输入正确的手机号",
        duration: 2000
      })
      return
    }
    if(this.data.code==null){
      wx.showToast({
        icon:"none",
        title: "请输入验证码",
        duration: 2000
      })
      return
    }
    HTTP.post('/api/v1/user/user/info/set/phone',{phone:this.data.phone,code:this.data.code},(data)=>{
      if(data.code == 200){
        wx.showToast({
          icon:"none",
          title: "绑定成功",
          duration: 2000
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },1500)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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