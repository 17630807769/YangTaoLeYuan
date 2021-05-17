// pages/mallShopDetails/mallShopDetails.js
const HTTP = require('../../utils/httputils');
const Util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId:null,//商品id
    goodsImgs: [],
    detailsImgs:[],
    firstImg: "",//首图
    goodsDesc: "2商品描述描述描述",//描述
    limitBuyAmount: 0,//限制每个用户购买的数量
    name: "",//商品名称
    orangeValue: 0,//价格
    sellAmount: 0,//已兑换
    stock: 0,//库存
    buyCount:1,//购买数量
    chooseAmountShow:false,
    allMoney:0,//总价
  },
  openDialog(){
    this.setData({
      chooseAmountShow: true,
    })
  },
  closeDialog(){
    this.setData({
      chooseAmountShow: false,
    })
  },
  addBuyCount: function () {
    let num = this.data.buyCount;
    if (num>=this.data.limitBuyAmount){
      wx.showToast({
        title: '此商品限购'+this.data.limitBuyAmount+'件',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    num+=1;
    this.data.allMoney = Util.floatFour(this.data.orangeValue*num)
    this.setData({
      buyCount: num,
      allMoney:this.data.allMoney
    })
  },
  lessBuyCount: function () {
    let num = this.data.buyCount;
    if (num<=1){
      wx.showToast({
        title: '最小购买数量为1',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    num-=1;
    this.data.allMoney = Util.floatFour(this.data.orangeValue*num)
    this.setData({
      buyCount: num,
      allMoney:this.data.allMoney
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      goodsId:options.id,
    })
    this.getDetails(options.id)
  },
  getDetails(id){
    HTTP.get('/api/v1/user/shop/goods/detail/'+id, {},(data)=>{
      if(data.code == 200){
        let arr = data.data.shopGoodsImgs;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].imgType===0){
            this.data.goodsImgs.push(arr[i]);
          } else {
            this.data.detailsImgs.push(arr[i]);
          }
        }
        this.setData({
          goodsImgs: this.data.goodsImgs,
          detailsImgs:this.data.detailsImgs,
          goodsId:data.data.id,//商品id
          firstImg: data.data.firstImg,//首图
          goodsDesc: data.data.goodsDesc,//描述
          limitBuyAmount: data.data.limitBuyAmount,//限制每个用户购买的数量
          name: data.data.name,//商品名称
          orangeValue: data.data.orangeValue,//价格
          sellAmount: data.data.sellAmount,//已兑换
          stock: data.data.stock,//库存
          allMoney:data.data.orangeValue
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
  goToConfirmOrder(){
    if (this.data.buyCount>this.data.stock){
      wx.showToast({
        icon:"none",
        title: '库存不足',
        duration: 2000
      })
      return
    }
    this.closeDialog();
    let value = {
      goodsId:this.data.goodsId,//商品id
      firstImg: this.data.firstImg,//首图
      name: this.data.name,//商品名称
      orangeValue: this.data.orangeValue,//价格
      buyCount:this.data.buyCount,//购买数量
    }
    value = JSON.stringify(value);
    wx.navigateTo({
      url: "/pages/mallConfirmOrder/mallConfirmOrder?value="+value
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