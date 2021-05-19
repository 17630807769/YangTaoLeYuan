// pages/shiFeiList/shiFeiList.js
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
    historyFertilize:0,//历史总施肥
    historyOrange:0,//历史总橙子
    yesterdayFertilize:0,//昨天施肥
    yesterdayOrange:0,//昨天橙子数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取施肥流水
    this.gitList();
    //获取昨日施肥数，昨日橙子数，历史总施肥，历史总分配
    this.getHistory();
    let that = this;
    wx.onSocketMessage(function (res) {//收到消息
      HTTP.onSocketMessage(res,function (result) {
        if (result.info === '100014'){
          that.gitListBack(result.data)
        }
        if (result.info === '100015'){
          that.getHistoryBack(result.data)
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
    HTTP.sendMessage('100014',param)
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
      switch (arr[i].type) {
        case 1:
          arr[i].typeText = '领取肥料'
          break;
        case 2:
          arr[i].typeText = '施肥肥料'
          break;
        case 3:
          arr[i].typeText = '偷好友肥料'
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
  getHistory(){
    HTTP.sendMessage('100015')
  },
  getHistoryBack(data){
    this.setData({
      historyFertilize:data.historyFertilize,//历史总施肥
      historyOrange:data.historyOrange,//历史总橙子
      yesterdayFertilize:data.yesterdayFertilize,//昨天施肥
      yesterdayOrange:data.yesterdayOrange,//昨天橙子数
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
        if (result.info === '100014'){
          that.gitListBack(result.data)
        }
        if (result.info === '100015'){
          that.getHistoryBack(result.data)
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