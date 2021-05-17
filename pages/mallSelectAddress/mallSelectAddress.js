// pages/mallSelectAddress/mallSelectAddress.js
const HTTP = require("../../utils/httputils");

const app = getApp()
Page({
  data: {
    addressList: [
// {
//   id:null,
//       name:'',
//       phone:'',
//       pro:'',
//       city:'',
//       area:'',
//       detailAddress:'',
//       isDefault:true,
// },
    ],
    type:'',
    pageSize:10,
    pageNum:1,
    pages:1,
  },

  selectTap: function(e) {
    if(this.data.type != 'select'){
      return
    }
    let index = e.currentTarget.dataset.i;
    getApp().globalData.address = this.data.addressList[index];
    wx.navigateBack();
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
    HTTP.get('/api/v1/user/address/get/all/'+this.data.pageNum+'/'+this.data.pageSize,{},(data)=>{
      if(data.code == 200){
        this.data.pageNum+=1
        let arr = data.data.list;
        for (let i = 0; i < arr.length; i++) {
          this.data.addressList.push(arr[i]);
        }
        this.setData({
          addressList:this.data.addressList,
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
  addAddess: function() {
    wx.navigateTo({
      url: "/pages/mallAddAddress/mallAddAddress"
    })
  },
  editAddess: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/mallAddAddress/mallAddAddress?id=" + id
    })
  },
  onLoad: function(e) {
    this.setData({
      type:e.type
    })
  },
  onShow: function() {
    this.setData({
      addressList:[],
      pageNum:1,
      pages:1,
    })
    this.getList();
  },
  onReachBottom: function () {
    this.getList();
  },
  initShippingAddress: function() {
  }


})