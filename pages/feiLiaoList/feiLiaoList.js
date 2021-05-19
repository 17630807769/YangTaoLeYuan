// pages/feiLiaoList/feiLiaoList.js
const HTTP = require('../../utils/httputils');
const Util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    pageSize:10,
    pageNum:1,
    pages:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取肥料流水
    this.gitList()
    let that = this;
    wx.onSocketMessage(function (res) {//收到消息
      HTTP.onSocketMessage(res,function (result) {
        if (result.info === '100013'){
          that.gitListBack(result.data)
        }
      })
    })
  },
  gitList() {
    if (this.data.pageNum>this.data.pages){
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let param = {pageNum:this.data.pageNum,pageSize:this.data.pageSize};
    HTTP.sendMessage('100013',param)
  },
  gitListBack(data){
    let arr = data.list;
    if (arr.length===0){
      wx.showToast({
        title: '目前没有任何记录',
        icon: 'none',
        duration: 2000
      })
    }
    for (let i = 0; i < arr.length; i++) {
      switch (arr[i].muckType) {
        case 1:
          arr[i].muckTypeText = '观看视频'
          break;
        case 2:
          arr[i].muckTypeText = '被好友偷走'
          break;
        case 3:
          arr[i].muckTypeText = '领取到我的肥料'
          break;
        case 4:
          arr[i].muckTypeText = 'APP兑换'
          break;
        case 5:
          arr[i].muckTypeText = '兑换码兑换'
          break;
        case 6:
          arr[i].muckTypeText = '肥料红包'
          break;
        case 7:
          arr[i].muckTypeText = '充电获得'
          break;
        case 8:
          arr[i].muckTypeText = '分享朋友圈获得'
          break;
        case 9:
          arr[i].muckTypeText = '分享好友获得'
          break;
        case 10:
          arr[i].muckTypeText = '邀请好友注册获得'
          break;
        case 11:
          arr[i].muckTypeText = '每日首次登陆获得'
          break;
      }
      arr[i].createTimeText = Util.timeFuc2(arr[i].createTime);
      this.data.list.push(arr[i]);
    }
    this.setData({
      pageNum:this.data.pageNum+=1,
      pages:data.pages,
      list:this.data.list
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
        if (result.info === '100013'){
          that.gitListBack(result.data)
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
    this.gitList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})