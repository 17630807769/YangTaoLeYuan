// pages/chengzi/chengzi.js
const Util = require('../../utils/util');
const HTTP = require('../../utils/httputils');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //进度条宽度
    progressWidth:10,
    //控制 领取肥料时 没有可领取的肥料 弹框
    noCanLingQuShow:false,
    //控制 施肥时 肥料不足 弹框
    noFeiLiaoShow:false,
    //控制施肥动图展示
    shiFeiGifShow:false,
    //控制 偷肥料
    touFeiLiaoShow:false,
    //控制 道具
    daoJuShow:false,
    //道具 title tab
    daoJuTab:[{text:'道具',type:0},{text:'我的道具',type:1},{text:'道具订单',type:2}],
    daoJuNowType:0,
    //控制购买道具弹窗
    buyDaoJuShow:false,
    //购买数量
    buyCount:1,
    //控制 集肥料
    jiFeiLiaoShow:false,
    //控制 收获
    shouhuoShow:false,
    songChengZiShow:false,
    tipsPasswordShow:false,
    //送橙子 好友账号
    friendPhone:null,
    //送橙子 数量
    friendNumber:null,
    friendList:[
    ],
    //控制设置密码框的展示类型  0关闭  1设置密码  2输入密码 3忘记密码输入验证码  4重置密码
    setPasswordType:0,
    // 输入框参数设置
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "88rpx",//输入框高度
      width: "100%",//输入框宽度
      see: false,//是否明文展示
      interval: false,//是否显示间隔格子
    },
    inputData1: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: false,//输入框的聚焦状态
      focus_class: false,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "88rpx",//输入框高度
      width: "100%",//输入框宽度
      see: false,//是否明文展示
      interval: false,//是否显示间隔格子
    },
    inputValue:null,
    inputValue1:null,
    //收自己肥料动画控制
    feiLiaoDaiClass:'',//肥料袋class名 shou-fei-liao播放领取肥料动画
    shiFeiBtnClass:'',//施肥按钮是否开始动 shou-fei-liao播放领取肥料动画
    feiLiaoBing:[],//肥料饼开始飞 fei-liao-kuai
    //控制树的动画class名
    shuClassName:'shu-hu-xi',
    //首页数据
    todayNumber:0,//今日橙子数量
    lastFertilizeAmount:0,//最少施肥数
    muckAmount:0,//到下一个等级需要的肥料数量
    notChargeMuckAmount:0,//未收取肥料数量
    notChargeOrangeAmount:0,//未收取橙子数
    notFertilizeAmount:0,//未施肥数量
    todayFertilizeAmount:0,//当日施肥数量
    treeRank:0,//树的等级
    shouHuoList:[],
    shouHuoBtnClass:'',//收获按钮的class名
    //收获数据
    nowOrange:0,//当前剩余橙子
    incomeOrange:0,//累计收入
    expendOrange:0,//累计支出
    chengZiList:[],
    pageSize:10,
    pageNum:1,
    pages:1,
    time1:null,//发送验证码的计时器
    second:60,
    code:'',//修改密码时,暂时存放验证码
    //偷能量
    canStealList:[],//可以偷的列表
    //道具
    allPropsList:[],//所有道具
    myPropsList:[],//我的道具
    myPropsOrderList:[],//我的道具订单
    nowShowPropsIndex:0,//当前弹筐里展示的道具下标
    //集肥料
    watchAmount:0,
    maxAmount:0,
  },
  getInfo(){//获取所有分类
    HTTP.get('/api/v2/user/user/muck/get/index/muck', {},(data)=>{
      if(data.code == 200){
        console.log(data)
      } else {
        wx.showToast({
          icon:"none",
          title: data.message,
          duration: 2000
        })
      }
    })
  },
  //点击树的动画
  clickShu(){
    if (this.data.shuClassName==='shu-q-tan'){
      return
    }
    this.setData({
      shuClassName:'shu-q-tan'
    })
    setTimeout(()=>{
      this.setData({
        shuClassName:'shu-hu-xi'
      })
    },1000)
  },
  //收肥料的动画
  playShouFeiLiao(){
    if (this.data.shiFeiBtnClass==='shou-fei-liao'||this.data.feiLiaoDaiClass==='shou-fei-liao'){
      return
    }
    this.setData({
      feiLiaoDaiClass:'shou-fei-liao',
      feiLiaoBing:['fei-liao-kuai','fei-liao-kuai1','fei-liao-kuai2','fei-liao-kuai3','fei-liao-kuai4']
    })
    setTimeout(()=>{
      this.setData({
        shiFeiBtnClass:'shou-fei-liao',
        feiLiaoDaiClass:'',
      })
    },900)
    setTimeout(()=>{
      this.setData({
        shiFeiBtnClass:'',
        feiLiaoBing:[]
      })
    },2000)
  },
  //收获的动画
  playShouHuo(){
    if (this.data.shuClassName==='shu-shou-huo'||this.data.shouHuoBtnClass==='shou-fei-liao'){
      return
    }
    this.setData({
      shuClassName:'shu-shou-huo',
      shouHuoList:['shou-cheng-zi','shou-cheng-zi1','shou-cheng-zi2','shou-cheng-zi3','shou-cheng-zi4']
    })
    setTimeout(()=>{
      this.setData({
        shouHuoBtnClass:'shou-fei-liao',
      })
    },200)
    setTimeout(()=>{
      this.setData({
        shuClassName:'shu-hu-xi',
        shouHuoBtnClass:'',
        shouHuoList:[]
      })
    },2000)
  },
  clickShiFeiBtn(){
    this.setData({
      shiFeiGifShow:true
    })
    setTimeout(()=>{
      this.setData({
        shiFeiGifShow:false
      })
    },2500)
  },
  // 当组件输入数字6位数时的自定义函数
  valueSix(e) {
    console.log(e.detail);
    this.data.inputValue=e.detail;
    this.setData({
      inputData1:{
        input_value: "",//输入框的初始内容
        value_length: 0,//输入框密码位数
        isNext: false,//是否有下一步的按钮
        get_focus: true,//输入框的聚焦状态
        focus_class: true,//输入框聚焦样式
        value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
        height: "88rpx",//输入框高度
        width: "100%",//输入框宽度
        see: false,//是否明文展示
        interval: false,//是否显示间隔格子
      }
    })
  },
  valueSix1(e) {
    console.log(e.detail);
    this.data.inputValue1=e.detail;
  },
  /*** 领取肥料 ***/
  clickFeiLiaoList() {
    this.closeNoCanLingQu();
    this.goToFeiLiaoList();
  },
  clickShiFeiList() {
    this.closeNoFeiLiaoShow();
    this.goToShiFeiList();
  },
  clickJiFeiLiao() {
    this.closeNoFeiLiaoShow();
    this.closeNoCanLingQu();
    this.openJiFeiLiao();
  },
  //打开没有可以领取的肥料弹窗
  openNoCanLingQu() {
    this.setData({
      noCanLingQuShow:true
    })
  },
  closeNoCanLingQu() {
    this.setData({
      noCanLingQuShow:false
    })
  },
  //打开 肥料不足弹框
  openNoFeiLiaoShow() {
    this.setData({
      noFeiLiaoShow:true
    })
  },
  closeNoFeiLiaoShow() {
    this.setData({
      noFeiLiaoShow:false
    })
  },
  /*** 收获部分 ***/
  openShouHuo(){
    this.setData({
      shouhuoShow:true,
    })
    this.getUserCount();
    this.setData({
      pageNum:1,
      pages:1,
      chengZiList:[]
    })
    this.getChengZiList();
  },
  closeShouHuo(){
    this.setData({
      shouhuoShow:false,
    })
  },
  //打开送橙子
  openSongChengZi(){
    //1.是否已经设置密码
    HTTP.get('/api/v1/leyuan/user/info/is/have/password',{},(data)=>{
      console.log(data)
      if(data.code == 200){
        if(data.data){//有密码
          if (this.data.nowOrange>0){//有余额
            this.setData({
              songChengZiShow: true,
            })
            this.getFriendList();
          } else {
            wx.showToast({
              title: '当前余额不足',
              icon: 'none'
            })
          }
        } else {
          this.openTipsPassword();
          wx.showToast({
            title: '请先设置橙子密码',
            icon: 'none'
          })
        }
      } else {
        wx.hideLoading();
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  closeSongChengZi() {
    this.setData({
      songChengZiShow: false,
    })
  },
  //送橙子弹框 点击下一步
  clickNext(){
    if (this.data.friendPhone === null){
      wx.showToast({
        title: '请输入好友橙子账号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.friendNumber === null){
      wx.showToast({
        title: '请输入橙子数量',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.friendNumber > this.data.nowOrange){
      wx.showToast({
        title: '当前橙子余额不足',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //1.发送请求验证手机号是否正确
    this.findPhone();
  },
  //送橙子点击好友列表
  clickFriendList(e){
    this.setData({
      friendPhone:e.currentTarget.dataset.phone
    })
  },
  //控制设置密码框的展示类型  0关闭  1设置密码  2输入密码 3忘记密码输入验证码  4重置密码
  openSetPassword1() {
    this.resetInput();
    this.setData({
      setPasswordType: 1,
    })
  },
  openSetPassword2() {
    this.resetInput();
    this.setData({
      setPasswordType: 2,
    })
  },
  openSetPassword3() {
    this.resetInput();
    this.setData({
      setPasswordType: 3,
    })
  },
  openSetPassword4() {
    this.resetInput();
    this.setData({
      setPasswordType: 4,
    })
  },
  closeSetPassword(){
    this.resetInput();
    this.setData({
      setPasswordType: 0,
    })
  },
  resetInput(){
    this.setData({
      inputValue:null,
      inputValue1:null,
      inputData: {
        input_value: "",//输入框的初始内容
        value_length: 0,//输入框密码位数
        isNext: false,//是否有下一步的按钮
        get_focus: true,//输入框的聚焦状态
        focus_class: true,//输入框聚焦样式
        value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
        height: "88rpx",//输入框高度
        width: "100%",//输入框宽度
        see: false,//是否明文展示
        interval: false,//是否显示间隔格子
      },
      inputData1: {
        input_value: "",//输入框的初始内容
        value_length: 0,//输入框密码位数
        isNext: false,//是否有下一步的按钮
        get_focus: false,//输入框的聚焦状态
        focus_class: false,//输入框聚焦样式
        value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
        height: "88rpx",//输入框高度
        width: "100%",//输入框宽度
        see: false,//是否明文展示
        interval: false,//是否显示间隔格子
      },
    })
  },
  openTipsPassword() {
    this.setData({
      tipsPasswordShow: true,
    })
  },
  closeTipsPassword() {
    this.setData({
      tipsPasswordShow: false,
    })
  },
  goToSetPassword(){
    this.closeTipsPassword();
    this.openSetPassword1();
  },
  clickSetPassword(){
    if (this.data.inputValue.length!==6){
      wx.showToast({
        icon:"none",
        title: "密码长度为6",
        duration: 2000
      })
      return
    }
    if (this.data.inputValue!==this.data.inputValue1){
      wx.showToast({
        icon:"none",
        title: "两次密码输入不一致",
        duration: 2000
      })
      return
    }
    let data={phone:17638172927,payPassword:this.data.inputValue1};
    if(this.setPasswordType===4){//此时为重置密码
      data.code = this.data.code;
    }
    HTTP.post('/api/v1/leyuan/user/info/set/password',data,(data)=>{
      if(data.code == 200){
        wx.showToast({
          icon:"none",
          title: '密码设置成功',
          duration: 2000
        })
        this.closeSetPassword();
      } else {
        wx.showToast({
          icon:"none",
          title: data.message,
          duration: 2000
        })
      }
    })
  },
  clickSendCode(){
    HTTP.post('/api/v1/leyuan/user/info/send/code',{phone:17638172927},(data)=>{
      if(data.code == 200){
        clearInterval(this.data.time1)
        this.data.time1 = setInterval(()=>{
          this.data.second-=1;
          this.setData({
            second:this.data.second
          })
          if (this.data.second<=0){
            this.setData({
              second:60
            })
            clearInterval(this.data.time1)
          }
        },1000)
        wx.showToast({
          icon:"none",
          title: '验证码发送成功',
          duration: 2000
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
  clickCheckCode(){
    if(this.data.inputValue===null){
      wx.showToast({
        icon:"none",
        title: '请输入验证码',
        duration: 2000
      })
      return
    }
    if(this.data.inputValue.length!==6){
      wx.showToast({
        icon:"none",
        title: '请输入正确的验证码',
        duration: 2000
      })
      return
    }
    HTTP.post('/api/v1/leyuan/user/info/check/code',{phone:17638172927,code:this.data.inputValue},(data)=>{
      if(data.code == 200){
        this.data.code = this.data.inputValue;
        this.openSetPassword4();
      } else {
        wx.showToast({
          icon:"none",
          title: data.message,
          duration: 2000
        })
      }
    })
  },
  /*** 偷肥料 ***/
  openTouFeiLiao() {
    this.setData({
      touFeiLiaoShow: true,
      pageNum:1,
      pages:1,
      canStealList:[],
    })
  },
  closeTouFeiLiao() {
    this.setData({
      touFeiLiaoShow: false,
    })
  },
  clickGoBuy(){
    this.closeTouFeiLiao();
    this.openDaoJu();
  },
  /*** 道具 ***/
  openDaoJu(){
    this.setData({
      daoJuNowType:0,
      daoJuShow: true
    })
    this.getAllPropsList();
  },
  closeDaoJu(){
    this.setData({
      daoJuShow: false
    })
  },
  clickDaoJuTab(e){
    this.setData({
      daoJuNowType: e.currentTarget.dataset.type
    })
    if (e.currentTarget.dataset.type===0){
      this.getAllPropsList()
    }
    if (e.currentTarget.dataset.type===1){
      this.setData({
        myPropsList:[]
      })
      this.getMyPropsList()
    }
    if (e.currentTarget.dataset.type===2){
      this.setData({
        pageNum:1,
        pages:1,
        myPropsOrderList:[],
      })
      this.getMyPropsOrderList()
    }
  },
  openBuyDaoJu(e){
    this.setData({
      buyDaoJuShow: true,
      nowShowPropsIndex:e.currentTarget.dataset.index,
    })
  },
  closeBuyDaoJu(){
    this.setData({
      buyDaoJuShow: false
    })
  },
  addBuyCount: function () {
    let num = this.data.buyCount;
    num+=1;
    this.setData({
      buyCount: num
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
    this.setData({
      buyCount: num
    })
  },
  /*** 集肥料 ***/
  openJiFeiLiao(){
    this.setData({
      jiFeiLiaoShow: true
    })
  },
  closeJiFeiLiao(){
    this.setData({
      jiFeiLiaoShow: false
    })
  },
  /*** 路由跳转 ***/
  goToRaiders: function (e) {
    wx.navigateTo({
      url: '/pages/raiders/raiders',
    });
  },
  goToMall: function (e) {
    wx.navigateTo({
      url: '/pages/mall/mall',
    });
  },
  goToFeiLiaoList: function (e) {
    wx.navigateTo({
      url: '/pages/feiLiaoList/feiLiaoList',
    });
  },
  goToShiFeiList: function (e) {
    wx.navigateTo({
      url: '/pages/shiFeiList/shiFeiList',
    });
  },
  /*** 其他 ***/
  //控制进度条
  testProgress: function(){
    let num = this.data.progressWidth;
    num += 50;
    console.log(num)
    this.setData({
      progressWidth:num
    });
  },
  //input输入框
  bindFriendPhoneInput: function (e) {
    this.setData({
      friendPhone: e.detail.value
    })
  },
  //input输入框
  bindFriendNumberInput: function (e) {
    this.setData({
      friendNumber: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
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

  },


})