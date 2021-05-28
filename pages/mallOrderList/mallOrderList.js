// pages/mallOrderList/mallOrderList.js
const HTTP = require('../../utils/httputils');
const Util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList:[{text:'全部',type:0},{text:'待发货',type:1},{text:'已发货',type:2},{text:'已完成',type:3},{text:'已取消',type:-1}],
    nowType:0,
    orderList:[
      // {
      //   createTime: "20201215171126"
      //   firstImg: "https://img.alicdn.com/imgextra/i2/1714128138/O1CN01bR8ins29zFnbfROKt_!!1714128138.jpg_430x430q90.jpg"
      //   goodsAmount: 4
      //   goodsOneMoney: 13
      //   id: 65
      //   name: "13商品名称"
      //   orangeMoney: 52
      //   orderNumber: "LYSHOP-1338773650735763456"
      //   status: 1
      // }
    ],
    pageSize:10,
    pageNum:1,
    pages:1,
  },
  bindTab(e){
    this.setData({
      nowType:e.currentTarget.dataset.type,
      pageNum:1,
      pages:1,
      orderList:[]
    })
    this.getList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getList();
  },
  getList(){
    if (this.data.pageNum>this.data.pages){
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
      return
    }
    HTTP.get('/api/v1/user/order/get/all/'+this.data.nowType+'/'+this.data.pageNum+'/'+this.data.pageSize,{},(data)=>{
      if(data.code == 200){
        this.data.pageNum+=1
        let arr = data.data.list;
        for (let i = 0; i < arr.length; i++) {
          arr[i].createTimeText = Util.timeFuc2(arr[i].createTime);
          switch (arr[i].status) {
            case 1:
              arr[i].statusText = '待发货'
              break;
            case 2:
              arr[i].statusText = '已发货'
              break;
            case 3:
              arr[i].statusText = '已完成'
              break;
            case -1:
              arr[i].statusText = '已取消'
              break;
          }
          this.data.orderList.push(arr[i]);
        }
        this.setData({
          orderList:this.data.orderList,
          pageNum:this.data.pageNum,
          pages:data.data.pages,
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
  goToOrderDetails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/mallOrderDetails/mallOrderDetails?orderId="+id
    })
  },
  clickLook(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/mallLookExpress/mallLookExpress?orderId="+id
    })
  },
  clickConfirm(e){
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.i;
    HTTP.put('/api/v1/user/order/confirm/order/'+id,{},(data)=>{
      if(data.code == 200){
        wx.showToast({
          icon:"none",
          title: '确认收货成功',
          duration: 2000
        });
        // 0全部 1待发货 2已发货 3已完成 -1已取消
        if (this.data.nowType===0){
          this.data.orderList[index].status = 3;
          this.data.orderList[index].statusText = '已完成';
        } else {
          this.data.orderList.splice(index,1)
        }
        this.setData({
          orderList:this.data.orderList
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
  clickCancel(e){
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.i;
    HTTP.put('/api/v1/user/order/cancle/order/'+id,{},(data)=>{
      if(data.code == 200){
        wx.showToast({
          icon:"none",
          title: '取消订单成功',
          duration: 2000
        });
        // 0全部 1待发货 2已发货 3已完成 -1已取消
        if (this.data.nowType===0){
          this.data.orderList[index].status = -1;
          this.data.orderList[index].statusText = '已取消';
        } else {
          this.data.orderList.splice(index,1)
        }
        this.setData({
          orderList:this.data.orderList
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
    this.setData({
      pageNum:1,
      pages:1,
      orderList:[]
    })
    this.getList();
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
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
