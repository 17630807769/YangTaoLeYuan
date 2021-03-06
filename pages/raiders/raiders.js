// pages/raiders/raiders.js
const HTTP = require('../../utils/httputils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取攻略或者海报
    HTTP.sendMessage('100018',{type:1});
    let that = this;
    wx.onSocketMessage(function (res) {//收到消息
      HTTP.onSocketMessage(res,function (result) {
        if (result.info === '100018'){
          that.setData({
            imgUrl:result.data
          })
        }
      })
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
    let that = this;
    wx.onSocketMessage(function (res) {//收到消息
      HTTP.onSocketMessage(res,function (result) {
        if (result.info === '100018'){
          that.setData({
            imgUrl:result.data
          })
        }
      })
    })
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