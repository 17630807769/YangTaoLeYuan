// pages/mall/mall.js
const HTTP = require('../../utils/httputils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabAll:true,//tab全部按钮 0是未选中,1是选中
    tabPrice:1,//tab价格按钮 1未选中 2是升序 3是降序
    tabClass:'',//
    tabClassListShow:false,
    tabClassList:[
        // {id: 1
        //   name: "1类别"
        //   version: 0,bool:false}
        ],
    shopList:[],
    thisWeekShopList:[],
    nextWeekShopList:[],
    pageSize:10,
    pageNum:1,
    pages:1,
  },
  clickTabAll(){
    this.data.tabAll = true;
    for (let i = 0; i < this.data.tabClassList.length; i++) {
      if (this.data.tabClassList[i].bool){
        this.data.tabClassList[i].bool = false;
      }
    }
    this.setData({
      tabClassList:this.data.tabClassList,
      tabClass:'',
      tabAll:this.data.tabAll,
    })
  },
  clickTabPrice(){
    if(this.data.tabPrice<3){
      this.data.tabPrice+=1;
    } else {
      this.data.tabPrice = 1;
    }
    this.setData({
      tabPrice:this.data.tabPrice,
      pageNum:1,
      pages:1,
      shopList:[]
    })
    this.getList();
  },
  clickTabClass(){
    this.setData({
      tabClassListShow:!this.data.tabClassListShow,
    })
  },
  clickTabClassList(e){
    let index = e.currentTarget.dataset.index;
    this.data.tabClassList[index].bool = !this.data.tabClassList[index].bool;
    this.data.tabClass = '';
    this.data.tabAll = true;
    for (let i = 0; i < this.data.tabClassList.length; i++) {
      if (this.data.tabClassList[i].bool){
        if (this.data.tabClass===''){
          this.data.tabClass = '' + this.data.tabClassList[i].id;
        } else {
          this.data.tabClass = this.data.tabClass + ',' + this.data.tabClassList[i].id;
        }
        this.data.tabAll = false;
      }
    }
    this.setData({
      tabClassList:this.data.tabClassList,
      tabClass:this.data.tabClass,
      tabAll:this.data.tabAll,
      tabClassListShow:false,
      pageNum:1,
      pages:1,
      shopList:[]
    })
    this.getList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getType();
    this.getList();
    this.getTeHuiList();
  },
  goToDetails: function(e) {
    wx.navigateTo({
      url: "/pages/mallShopDetails/mallShopDetails?id=" + e.currentTarget.dataset.id
    })
  },
  getType(){//获取所有分类
    HTTP.get('/api/v1/user/shop/get/type', {},(data)=>{
      if(data.code == 200){
        let arr = data.data;
        for (let i = 0; i < arr.length; i++) {
          arr.bool = false;
        }
        this.data.tabClassList = arr;
        this.setData({
          tabClassList:this.data.tabClassList
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
  getTeHuiList(){
    HTTP.get('/api/v1/user/shop/get/panic/buying/goods',{},(data)=>{
      if(data.code == 200){
        this.data.pageNum+=1
        let arr = data.data.thisWeek;
        let arr1 = data.data.nextWeek;
        for (let i = 0; i < arr.length; i++) {
          this.data.thisWeekShopList.push(arr[i]);
        }
        for (let j = 0; j < arr1.length; j++) {
          this.data.nextWeekShopList.push(arr1[j]);
        }
        this.setData({
          thisWeekShopList:this.data.thisWeekShopList,
          nextWeekShopList:this.data.nextWeekShopList,
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
  getList(){
    if (this.data.pageNum>this.data.pages){
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let params={};
    if (this.data.tabPrice===2){
      params.money = 1
    }
    if (this.data.tabPrice===3){
      params.money = 0
    }
    if (this.data.tabClass!==''){
      params.types = this.data.tabClass;
    }
    HTTP.get('/api/v1/user/shop/get/goods/'+this.data.pageNum+'/'+this.data.pageSize,params,(data)=>{
      if(data.code == 200){
        this.data.pageNum+=1
        let arr = data.data.list;
        for (let i = 0; i < arr.length; i++) {
          this.data.shopList.push(arr[i]);
        }
        this.setData({
          shopList:this.data.shopList,
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.navigateTo({
    //   url: "/pages/mallOrderList/mallOrderList"
    // })

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
