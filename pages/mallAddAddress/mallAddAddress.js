// pages/mallAddAddress/mallAddAddress.js
const HTTP = require("../../utils/httputils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    name:null,
    phone:null,
    details:null,
    region: [],
    status:true,
  },
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindDetailsInput: function (e) {
    this.setData({
      details: e.detail.value
    })
  },
  bindStatus:function (e) {
    this.data.status = !this.data.status;
    this.setData({
      status:this.data.status
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.getAddress(options.id);
    }
  },
  getAddress(id){
    HTTP.get('/api/v1/user/address/get/detail/'+id, {},(data)=>{
      if(data.code == 200){
        let res = data.data;
        let arr=[res.pro,res.city,res.area];
        this.setData({
          id:res.id,
          name:res.name,
          phone:res.phone,
          details:res.detailAddress,
          status:res.isDefault,
          region:arr,
        })
        getApp().globalData.address = res;
      } else {
        wx.showToast({
          icon:"none",
          title: data.message,
          duration: 2000
        })
      }
    })
  },
  clickSave(){
    if (this.data.name===null){
      wx.showToast({
        icon:"none",
        title: '请填写收件人姓名',
        duration: 2000
      });
      return
    }
    if (this.data.phone===null){
      wx.showToast({
        icon:"none",
        title: '请填写收件人电话',
        duration: 2000
      });
      return
    }
    if (this.data.details===null){
      wx.showToast({
        icon:"none",
        title: '请填写详细地址',
        duration: 2000
      });
      return
    }
    if (this.data.region.length!==3){
      wx.showToast({
        icon:"none",
        title: '请选择所在地区',
        duration: 2000
      });
      return
    }
    let params = {};
    params.name = this.data.name;
    params.phone = this.data.phone;
    params.pro = this.data.region[0];
    params.city = this.data.region[1];
    params.area = this.data.region[2];
    params.detailAddress = this.data.details;
    params.isDefault = this.data.status;
    if (this.data.id===null){
      //新增
      HTTP.post('/api/v1/user/address/add',params,(data)=>{
        if(data.code == 200){
          wx.showToast({
            icon:"none",
            title: '添加成功',
            duration: 2000
          });
          wx.navigateBack();
        } else {
          wx.showToast({
            icon:"none",
            title: data.message,
            duration: 2000
          })
        }
      })
    } else {
      params.id = this.data.id;
      //更新
      HTTP.put('/api/v1/user/address/update',params,(data)=>{
        if(data.code == 200){
          wx.showToast({
            icon:"none",
            title: '保存成功',
            duration: 2000
          });
          wx.navigateBack();
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
  deleteAddress: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          HTTP.delete('/api/v1/user/address/delete/'+id,{},(data)=>{
            if(data.code == 200){
              wx.navigateBack()
              wx.showToast({
                title: '删除成功！',
                icon: 'none'
              })
            } else {
              wx.hideLoading();
              wx.showToast({
                title: data.message,
                icon: 'none'
              })
              return;
            }
          })
        } else {
          console.log('用户点击取消')
        }
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