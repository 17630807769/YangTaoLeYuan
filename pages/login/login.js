// pages/login/login.js
const HTTP = require('../../utils/httputils');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    hasInfo:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo){
      this.setData({
        userInfo:app.globalData.userInfo,
        hasInfo:true,
      })
    }
  },
  getUserInfo(e){
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo:e.detail.userInfo,
    })
  },
  getLogin: function(e) {
    if (!e.detail.encryptedData){
      return
    }
    let that = this;
    wx.login({
      success: function (res) {
        // console.log(res)
        HTTP.get('/api/v1/user/user/info/outer/get/openid/'+res.code,{},(data)=>{
          // console.log(data)
          if(data.code == 200){
            wx.setStorage({
              key:"openId",
              data:data.data
            })
            wx.login({
              success: function (res1) {
                let params={};
                params.avatar = that.data.userInfo.avatarUrl;
                params.nickName = that.data.userInfo.nickName;
                params.openid = data.data;
                params.jsCode = res1.code;
                params.encryptedData = e.detail.encryptedData;
                params.iv = e.detail.iv;
                HTTP.post('/api/v1/user/user/info/outer/wx/login',params,(data)=>{
                  if(data.code == 200){
                    //写入token
                    wx.setStorage({
                      key:"token",
                      data:data.data.token
                    })
                    wx.setStorage({
                      key:"phone",
                      data:data.data.phone
                    })
                    wx.setStorage({
                      key:"nickName",
                      data:data.data.nickName
                    })
                    wx.showToast({
                      icon:"success",
                      title: '微信登录成功',
                      duration: 2000
                    })
                    setTimeout(()=>{
                      HTTP.initSocket();
                      wx.redirectTo({url:'/pages/index/index'});
                    },500)
                  }
                })
              }
            })

          } else {
            wx.showToast({
              icon:"none",
              title: data.message,
              duration: 2000
            })
          }
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