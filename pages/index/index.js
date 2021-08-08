//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    progressWidth:20,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isJcc:false,
  },

  onShow(){
    this.setData({
      progressWidth:20
    })
    setTimeout(()=>{
      this.setData({
        progressWidth:30
      })
      setTimeout(()=>{
        this.setData({
          progressWidth:60
        })
        setTimeout(()=>{
          this.setData({
            progressWidth:100
          })
        },500)
      },500)
    },500)
    setTimeout(()=>{
      this.goToYouzi();
    },2200)
  },
  onLoad: function (options) {
    if(options.fphone){
      getApp().globalData.yaoQingpeople = options.fphone;
    }
    console.log(options.fphone,getApp().globalData.yaoQingpeople)
    console.log(options.miniProgram)
    if (options.miniProgram){
      this.setData({
        isJcc: true
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goToYouzi: function (e) {
    let that = this;
    if(this.data.isJcc){
      wx.redirectTo({
        url: `/pages/chengzi/chengzi?isJcc=${that.data.isJcc}`,
      });
    } else {
      wx.redirectTo({
        url: '/pages/chengzi/chengzi',
      });
    }

  },
  onHide: function () {
    setTimeout(()=>{
      this.setData({
        progressWidth:0
      })
    },1000)
  },
})
