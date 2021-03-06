// pages/chengzi/chengzi.js
const Util = require('../../utils/util');
const HTTP = require('../../utils/httputils');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    isMyTree:true,//true是自己的树 false是偷肥料
    treeId:'',//当前要偷好友的id
    signName:'自己',//***的杨桃乐园
    //进度条宽度
    progressWidth:0,
    //控制 领取肥料时 没有可领取的肥料 弹框
    noCanLingQuShow:false,
    //控制 施肥时 肥料不足 弹框
    noFeiLiaoShow:false,
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
    //送杨桃 好友账号
    friendPhone:null,
    //送杨桃 数量
    friendNumber:null,
    friendList:[
    ],
    friendListShow:true,
    friendInfo:{
      // phone:'143341234',
      // avatar:'',
      // nickName:'fgfgsdg',
    },
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
    todayNumber:0,//今日杨桃数量
    lastFertilizeAmount:0,//最少施肥数
    muckAmount:0,//到下一个等级需要的肥料数量
    notChargeMuckAmount:0,//未收取肥料数量
    notChargeOrangeAmount:0,//未收取杨桃数
    notFertilizeAmount:0,//未施肥数量
    todayFertilizeAmount:0,//当日施肥数量
    treeRank:1,//树的下一个等级
    treeName:'',
    shouHuoList:[],
    shouHuoBtnClass:'',//收获按钮的class名
    shiFeiGifShow:false,//控制施肥动图展示
    //收获数据
    nowOrange:0,//当前剩余杨桃
    incomeOrange:0,//累计收入
    expendOrange:0,//累计支出
    pickerStart:'2020-01-01',
    pickerEnd:'2023-01-01',
    timeShow:false,
    timeStart:null,//时间筛选开始时间
    timeEnd:null,//时间筛选结束时间
    chengZiList:[],
    chengZiListDetailsShow:0,//0 关闭 1获得杨桃，2收到好友赠送，3送给好友杨桃，4商城兑换 5商城取消订单
    chengZiListDetails:{
      //nickName 好友昵称
      // orangeAmount杨桃数量
      // createTimeText创建时间
      //fertilizeAmount当天总施肥量
      // orangeAmount总杨桃数量
      // userFertilizeAmount用户总施肥量
      // userFertilizeRatio用户占比
      // userOrangeAmount用户获得的杨桃数量
    },
    pageSize:10,
    pageNum:1,
    pages:1,
    time1:null,//发送验证码的计时器
    second:60,
    code:'',//修改密码时,暂时存放验证码
    //偷能量
    canStealList:[],//可以偷的列表
    canStealCount:0,//可以偷的数量
    //道具
    allPropsList:[],//所有道具
    myPropsList:[],//我的道具
    myPropsOrderList:[],//我的道具订单
    nowShowPropsIndex:0,//当前弹筐里展示的道具下标
    //集肥料
    /*登录领取肥料*/
    oneDayLoginReceiveMuck: "101",//展示奖励数量
    oneDayLogin: "1",//任务有无完成 1为完成
    oneDayLoginMuckAmount: "101",//可领取数量 0为已领取
    /*分享好友*/
    shareFriend: "1",
    shareFriendMax: "3",
    shareFriendMuck: 0,
    shareFriendReceiveMuck: "50",
    /*分享朋友圈*/
    shareFriendCircle: "0",
    shareFriendCircleMax: "1",
    shareFriendCircleMuck: 0,
    shareFriendCircleReceiveMuck: "50",
    /*好友注册*/
    inviteRegister: "0",
    inviteRegisterMax: "3",
    inviteRegisterMuck: 0,
    inviteRegisterReceiveMuck: "100",
    /*购买道具*/
    buyPropsIsReceive: "0",
    buyPropsMuckAmount: "0",
    buyPropsReceiveMuck: "100",
    /*抢购商品*/
    buyGoodsIsReceive: "0",
    buyGoodsMuckAmount: "0",
    buyGoodsReceiveMuck: "100",
    /*租赁充电宝*/
    chongdianMuckAmount: "0",
    chongdianReceive: "0",
    chongdianReceiveMuck: "100",


    downImgShow:false,
    downImgUrl:'',
    exchangeShow:false,
    exchangeCode:'',//兑换码
    showHongbao1:false,
    showHongbao2:false,
    hongbaoCount:0,
    //红包领完的提示
    hongbaoTips:null,
    //控制道具购买成功弹框
    showPropsBuySuccess:false,
    //分享类型,1是分享微信好友需要调用请求 2是好友注册成功分享不用调用
    shareType:1,
    //是否由Jcc拉起
    isJcc:false,
  },
  clickShareBtn(e){
    console.log(e)
    this.setData({
      shareType:e.currentTarget.dataset.type
    })
  },
  closePropsBuySuccess(){
    this.setData({
      showPropsBuySuccess:false,
    })
  },
  goToJiChongChong(){
    wx.navigateToMiniProgram({
      appId: 'wx54e1af9976662192',
      path: '/pages/indexWX/indexWX',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  //红包部分
  havePhone(){
    HTTP.get('/api/v1/user/user/info/get/user/have/phone',{},(data)=>{
      if(data.code == 200){
        if(data.data){
          this.havereceive();
        } else {
          wx.navigateTo({
            url: "/pages/phoneBind/phoneBind"
          })
        }
      }
    })
  },
  havereceive(){
    HTTP.get('/api/v1/user/coupon/query/have/receive',{},(data)=>{
      if(data.code == 200){
        this.setData({
          hongbaoCount:data.data,
          showHongbao1:true
        })
      }
    })
  },
  closeHongbao1(){
    this.setData({
      showHongbao1:false
    })
  },
  clickHongbao1(){
    if (wx.getStorageSync("token")){
      // 点击立即领取是老用户应当再次调用 /api/v1/user/coupon/query/have/receive 查询此时红包状态
      HTTP.get('/api/v1/user/coupon/query/have/receive',{},(data)=>{
        if(data.code == 200){//已领取的话code=402001    没有的话 code=402002
          this.setData({
            hongbaoCount:data.data,
            showHongbao1:false,
            showHongbao2:true,
          })
        } else if(data.code==402001){
          this.setData({
            hongbaoTips:data.message,
            showHongbao1:false,
            showHongbao2:true,
          })
        } else if(data.code==402002){
          this.setData({
            hongbaoTips:data.message,
            showHongbao1:false,
            showHongbao2:true,
          })
        }
      })
    } else {
      wx.clearStorage();
      wx.navigateTo({url: '/pages/login/login'});
    }
  },
  openJiChong(){

  },
  closeHongbao2(){
    this.setData({
      showHongbao2:false
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
  /***点击摘取杨桃气泡***/
  clickZaiQu(){
    this.lingChengZi(2);
  },
  /***点击领取肥料***/
  clickFeiLiaoBao(){
    if (this.data.notChargeMuckAmount){
      this.lingChengZi(1);
    } else {
      this.openNoCanLingQu();
    }
  },
  /***点击施肥***/
  clickShiFeiBtn(){
    // if (this.data.notChargeOrangeAmount>0){
    //   //杨桃没有收 ,不可以施肥
    //   return
    // }
    if (this.data.shiFeiGifShow){
      return
    }
    if (this.data.notFertilizeAmount>=this.data.lastFertilizeAmount){
      this.lingChengZi(3);
    } else {
      this.openNoFeiLiaoShow();
    }
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
  openChengZiListDetails(e){//打开流水详情
    let index = e.currentTarget.dataset.i;
    let obj = this.data.chengZiList[index];
    console.log(obj)
    if(obj.useType===1){
      //获得杨桃 类型 发送请求
      let time = obj.createTime.substring(0,8);
      this.data.chengZiListDetails = obj;
      this.getChengZiListDetails(time);
    } else {
      this.setData({
        chengZiListDetails:obj,
        chengZiListDetailsShow:obj.useType
      })
    }
  },
  closeChengZiListDetails(){
    this.setData({
      chengZiListDetailsShow:0
    })
  },
  goToOrderDetails(e){
    let id = this.data.chengZiListDetails.orderId;
    if (id){
      wx.navigateTo({
        url: "/pages/mallOrderDetails/mallOrderDetails?orderId="+id
      })
    }
  },
  timePickerShow(){
    this.data.timeShow = !this.data.timeShow;
    this.setData({
      timeShow:this.data.timeShow
    })
  },
  pickerChange1(e){
    if (this.data.timeEnd){
      this.setData({
        timeStart: e.detail.value,
        pageNum:1,
        pages:1,
        chengZiList:[],
        timeShow:false
      })
      this.getChengZiList();
    } else {
      this.setData({
        timeStart: e.detail.value,
      })
    }
  },
  pickerChange2(e){
    if (this.data.timeStart){
      this.setData({
        timeEnd: e.detail.value,
        pageNum:1,
        pages:1,
        chengZiList:[],
        timeShow:false
      })
      this.getChengZiList();
    } else {
      this.setData({
        timeEnd: e.detail.value,
      })
    }
  },
  pickerRefresh(){
    this.setData({
      timeStart: null,
      timeEnd: null,
      pageNum:1,
      pages:1,
      chengZiList:[],
      timeShow:false
    })
    this.getChengZiList();
  },
  //打开送杨桃
  openSongChengZi(){
    //1.是否已经设置密码
    HTTP.get('/api/v1/user/user/info/is/have/password',{},(data)=>{
      if(data.code == 200){
        if(data.data){//有密码
          if (this.data.nowOrange>0){//有余额
            this.setData({
              songChengZiShow: true,
              friendListShow:true
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
            title: '请先设置杨桃密码',
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
  //送杨桃弹框 点击下一步
  clickNext(){
    if (this.data.friendPhone === null){
      wx.showToast({
        title: '请输入好友杨桃账号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.friendNumber === null){
      wx.showToast({
        title: '请输入杨桃数量',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.friendNumber > this.data.nowOrange){
      wx.showToast({
        title: '当前杨桃余额不足',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.openSetPassword2();
  },
  //送杨桃点击好友列表
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
    let data={phone:getApp().globalData.userPhone,payPassword:this.data.inputValue1};
    if(this.setPasswordType===4){//此时为重置密码
      data.code = this.data.code;
    }
    HTTP.post('/api/v1/user/user/info/set/password',data,(data)=>{
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
    HTTP.post('/api/v1/user/user/info/send/code',{phone:getApp().globalData.userPhone},(data)=>{
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
    HTTP.post('/api/v1/user/user/info/check/code',{phone:getApp().globalData.userPhone,code:this.data.inputValue},(data)=>{
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
    this.getCanStealList();
  },
  closeTouFeiLiao() {
    this.setData({
      touFeiLiaoShow: false,
    })
  },
  clickGoBuy(){
    this.closeTouFeiLiao();
    this.setData({
      jiFeiLiaoShow:false
    })
    this.getAllPropsList();
  },
  goToSteal(e){
    let index = e.currentTarget.dataset.i;
    let stealDetail = this.data.canStealList[index];
    this.setData({
      touFeiLiaoShow: false,
      isMyTree:false,
      signName:stealDetail.nickName,
      canStealCount:stealDetail.muckAmount,
      treeId:stealDetail.id
    })
  },
  clickTou(){
    this.stealFriend(this.data.treeId);
  },
  goToMyTree(){
    let that = this;
    this.setData({
      isMyTree:true,
    })
    wx.getStorage({
      key:'nickName',
      success(res) {
        that.setData({
          signName:res.data
        })
      }
    })
  },
  /*** 道具 ***/
  openDaoJu(){
    this.setData({
      daoJuNowType:0,
      daoJuShow: true
    })
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
  wxPay(){
    let that = this;
    let params = {
      type:1,
      buyAmount:this.data.buyCount,
      buyGoodsId:this.data.allPropsList[this.data.nowShowPropsIndex].id,
      wxType:1
    }
    HTTP.post('/api/v1/user/pay/minipay',params,(data)=>{
      if(data.code == 200){
        let payData = data.data;
        payData = JSON.parse(payData);
        wx.requestPayment({
          timeStamp: payData.timeStamp,
          nonceStr: payData.nonceStr,
          package: payData.package,
          signType: payData.signType,
          paySign: payData.paySign,
          success (res) {
            console.log('支付成功')
            that.setData({
              showPropsBuySuccess:true
            })
            wx.showToast({
              icon:"none",
              title: "支付成功",
              duration: 2000
            })
          },
          fail (res) {
            console.log('支付失败')
            wx.showToast({
              icon:"none",
              title: "支付失败",
              duration: 2000
            })
          }
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
  /*** 集肥料 ***/
  openJiFeiLiao(){
    HTTP.get('/api/v1/user/user/info/get/user/have/phone',{},(data)=>{
      if(data.code == 200){
        if(data.data){
          this.setData({
            jiFeiLiaoShow: true
          })
          this.getVideoAmount();
        } else {
          wx.navigateTo({
            url: "/pages/phoneBind/phoneBind"
          })
        }
      }
    })

  },
  closeJiFeiLiao(){
    this.setData({
      jiFeiLiaoShow: false
    })
  },
  closeDownImg(){
    this.setData({
      downImgShow:false
    })
  },
  clickSaveImg(){
    let imgUrl;
    if (this.data.downImgUrl){
      imgUrl = this.data.downImgUrl
    } else {
      return
    }
    wx.downloadFile({
      url: imgUrl,　　　　　　　//需要下载的图片url
      success: function (res) {　　　　　　　　　　　　//成功后的回调函数
        wx.saveImageToPhotosAlbum({　　　　　　　　　//保存到本地
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    });
  },
  closeExchange(){
    this.setData({
      exchangeShow:false
    })
  },
  openExchange(){
    this.setData({
      exchangeShow:true
    })
  },
  clickExchange(){
    this.getExchange();
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
    if (e.detail.value.length === 11){
      //1.发送请求验证手机号是否正确
      this.findPhone();
    }
    if (e.detail.value.length === 0){
      this.setData({
        friendListShow:true,
        friendInfo:{},
      })
    }
  },
  //input输入框
  bindFriendNumberInput: function (e) {
    this.setData({
      friendNumber: e.detail.value
    })
  },
  //input输入框 兑换码
  bindExchangeCodeInput: function (e) {
    this.setData({
      exchangeCode: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if(wx.getStorageSync("token")){
      HTTP.initSocket();
      this.getChengZiNumber();
      this.getChengZiInfo();
      //获取可以偷列表,判断可偷按钮是否展示
      this.getCanStealList();
    }
    if(app.globalData.userInfo){
      this.setData({
        signName:app.globalData.userInfo.nickName,
      })
    }
    this.getChengzi();
    if(options.isJcc){
      this.setData({
        hongbaoCount:0,
        showHongbao1:true
      })
    } else {
      wx.getStorage({
        key:'phone',
        success(res) {
          getApp().globalData.userPhone = res.data;
          that.havePhone();
        }
      })
    }
  },
  getChengzi(){//http获取杨桃数量 没登陆就进入首页；
    HTTP.get('/api/v1/user/user/info/outer/get/today/amount',{},(data)=>{
      if(data.code == 200){
        this.setData({
          todayNumber:data.data
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
/***请求发送与处理***/
  /**发送请求**/
  //获取今日杨桃数
  getChengZiNumber() {
    HTTP.sendMessage('100001')
  },
  //获取用户主页肥料记录 进度条,剩余肥料等, 树的页面除了当前杨桃数,全在这里
  getChengZiInfo() {
    HTTP.sendMessage('100002')
  },
  //获取用户当前剩余 杨桃数 + 累计支出杨桃 + 累计计入杨桃
  getUserCount() {
    HTTP.sendMessage('100003')
  },
  //获取杨桃流水
  getChengZiList() {
    if (this.data.pageNum>this.data.pages){
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let param = {pageNum:this.data.pageNum,pageSize:this.data.pageSize};
    if(this.data.timeStart&&this.data.timeEnd){
      let timeStart = this.data.timeStart;
      timeStart = timeStart.replace("-","");
      timeStart = timeStart.replace("-","");
      let timeEnd = this.data.timeEnd;
      timeEnd = timeStart.replace("-","");
      timeEnd = timeStart.replace("-","");
      param.startTime = timeStart;
      param.endTime = timeEnd;
    }
    HTTP.sendMessage('100004',param)
  },
  //获取用户可以偷的肥料
  getCanStealList(){
    if (this.data.pageNum>this.data.pages){
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let param = {pageNum:this.data.pageNum,pageSize:this.data.pageSize};
    HTTP.sendMessage('100005',param)
  },
  //看视频领取肥料
  //用户观看视频次数和最多观看次数 100007
  getVideoAmount(){
    HTTP.sendMessage('100007')
  },
  //获取所有道具 100008
  getAllPropsList(){
    HTTP.sendMessage('100008')
  },
  //获取用户我的道具 100009
  getMyPropsList(){
    HTTP.sendMessage('100009')
  },
  //获取用户道具订单 100010
  getMyPropsOrderList(){
    if (this.data.pageNum>this.data.pages){
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let param = {pageNum:this.data.pageNum,pageSize:this.data.pageSize};
    HTTP.sendMessage('100010',param)
  },
  //用户领取杨桃或者肥料或者施肥type 类型 1是领取肥料 2是领取杨桃 3是施肥
  lingChengZi(type){
    let param = {type:type};
    HTTP.sendMessage('100011',param)
  },
  //用户获取杨桃的流水明细
  getChengZiListDetails(time){
    let param = {time:time};
    HTTP.sendMessage('100012',param)
  },
  //用户获取肥料流水记录
  //获取用户施肥流水记录
  //获取昨日施肥数,昨日杨桃数,历史总施肥,历史总分配
  //赠送好友杨桃16
  giveFriend(){
    if (this.data.inputValue===null||this.data.inputValue.length !== 6){
      wx.showToast({
        title: '密码错误',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let param={phone:this.data.friendPhone,amount:this.data.friendNumber,payPassword:this.data.inputValue}
    HTTP.sendMessage('100016',param)
  },
  //偷取好友肥料17
  stealFriend(id){
    let param = {id:id};
    HTTP.sendMessage('100017',param);
  },
  //获取攻略或者海报18
  getDownImgUrl(){
    HTTP.sendMessage('100018',{type:2});
  },
  //获取送杨桃 好友列表19
  getFriendList() {
    HTTP.sendMessage('100019')
  },
  //送杨桃时 查询当前手机号是否存在20
  findPhone() {
    let param={phone:this.data.friendPhone}
    HTTP.sendMessage('100020',param);
  },
  //兑换肥料
  getExchange() {
    let param={password:this.data.exchangeCode}
    HTTP.sendMessage('100021',param);
  },
  //分享好友成功
  shareFinish(type){//1分享朋友圈 2分享好友
    let param={type:type}
    HTTP.sendMessage('100058',param);
  },
  //领取集肥料地方的肥料
  lingQuFeiLiao(e){//1领取抢购商品肥料，2领取购买保护道具肥料 3领取分享朋友圈肥料 4领取分享好友肥料 5领取邀请有效好友注册肥料 6领取急冲冲 7领取登录
    let param={type:e.currentTarget.dataset.type}
    HTTP.sendMessage('100059',param);
  },
  /**返回处理**/
  getChengZiNumberBack(data) {//100001
    this.setData({
      todayNumber:data
    })
  },
  getChengZiInfoBack(data){//100002
    let progressWidth =(1- data.muckAmount/(data.muckAmount+data.todayFertilizeAmount))*100;
    this.setData({
      lastFertilizeAmount:data.lastFertilizeAmount,
      muckAmount:data.muckAmount,
      notChargeMuckAmount:data.notChargeMuckAmount,
      notChargeOrangeAmount:data.notChargeOrangeAmount,
      notFertilizeAmount:data.notFertilizeAmount,
      todayFertilizeAmount:data.todayFertilizeAmount,
      treeRank:data.treeRank,
      treeName:data.treeName,
      progressWidth:progressWidth
    })
  },
  getUserCountBack(data){//100003
    this.setData({
      nowOrange:data.orangeAmount,//当前剩余杨桃
      incomeOrange:data.income,//累计收入
      expendOrange:data.expend,//累计支出
    })
  },
  getChengZiListBack(data){//1004
    let arr = data.list;
    for (let i = 0; i < arr.length; i++) {
      switch (arr[i].useType) {
        case 1:
          arr[i].orangeTypeText = '获得杨桃'
          break;
        case 2:
          arr[i].orangeTypeText = '收到好友赠送'
          break;
        case 3:
          arr[i].orangeTypeText = '送给好友杨桃'
          break;
        case 8:
          arr[i].orangeTypeText = '兑换送到家订单'
          break;
        case 9:
          arr[i].orangeTypeText = '兑换送到家订单取消'
          break;
        case 16:
          arr[i].orangeTypeText = '商城兑换商品'
          break;
        case 17:
          arr[i].orangeTypeText = '商城兑换商品取消'
          break;
      }
      arr[i].createTimeText = Util.timeFuc2(arr[i].createTime);
      this.data.chengZiList.push(arr[i]);
    }
    this.setData({
      pageNum:this.data.pageNum+=1,
      pages:data.pages,
      chengZiList:this.data.chengZiList
    })
  },
  getCanStealListBack(data){//100005
    let arr = data.list;
    for (let i = 0; i < arr.length; i++) {
      this.data.canStealList.push(arr[i]);
    }
    this.setData({
      pageNum:this.data.pageNum+=1,
      pages:data.pages,
      canStealList:this.data.canStealList
    })
  },
  getVideoAmountBack(data){
    this.setData({
      buyGoodsIsReceive: data.buyGoodsIsReceive,
      buyGoodsMuckAmount: data.buyGoodsMuckAmount,
      buyGoodsReceiveMuck:  data.buyGoodsReceiveMuck,
      buyPropsIsReceive: data.buyPropsIsReceive,
      buyPropsMuckAmount: data.buyPropsMuckAmount,
      buyPropsReceiveMuck: data.buyPropsReceiveMuck,
      chongdianMuckAmount: data.chongdianMuckAmount,
      chongdianReceive: data.chongdianReceive,
      chongdianReceiveMuck: data.chongdianReceiveMuck,
      inviteRegister: data.inviteRegister,
      inviteRegisterMax: data.inviteRegisterMax,
      inviteRegisterMuck: data.inviteRegisterMuck,
      inviteRegisterReceiveMuck:  data.inviteRegisterReceiveMuck,
      maxAmount:  data.maxAmount,
      oneDayLogin:  data.oneDayLogin,
      oneDayLoginMuckAmount: data.oneDayLoginMuckAmount,
      oneDayLoginReceiveMuck: data.oneDayLoginReceiveMuck,
      seeOneVideoAmount: data.seeOneVideoAmount,
      shareFriend: data.shareFriend,
      shareFriendCircle: data.shareFriendCircle,
      shareFriendCircleMax: data.shareFriendCircleMax,
      shareFriendCircleMuck: data.shareFriendCircleMuck,
      shareFriendCircleReceiveMuck: data.shareFriendCircleReceiveMuck,
      shareFriendMax:  data.shareFriendMax,
      shareFriendMuck: data.shareFriendMuck,
      shareFriendReceiveMuck: data.shareFriendReceiveMuck,
    })
  },
  getAllPropsListBack(data){//100008
    this.setData({
      allPropsList:data,
    })
    this.openDaoJu()
  },
  //获取用户我的道具
  getMyPropsListBack(data){//100009
    let arr = data;
    for (let i = 0; i < arr.length; i++) {
      arr[i].propsLaveTimeText = Util.timeFuc1(arr[i].propsLaveTime);
      this.data.myPropsList.push(arr[i]);
    }
    this.setData({
      myPropsList:this.data.myPropsList
    })
  },
  //获取用户道具订单
  getMyPropsOrderListBack(data){//100010
    let arr = data.list;
    for (let i = 0; i < arr.length; i++) {
      arr[i].createTimeText = Util.timeFuc(arr[i].createTime);
      this.data.myPropsOrderList.push(arr[i]);
    }
    this.setData({
      pageNum:this.data.pageNum+=1,
      pages:data.pages,
      myPropsOrderList:this.data.myPropsOrderList
    })
  },
  lingChengZiBack(data){//100011
    let msg='';
    if (data.chooseType===1){//肥料领取成功
      msg = '肥料领取成功';
      this.playShouFeiLiao();
    }
    if (data.chooseType===2){//领取杨桃成功
      msg = '杨桃领取成功';
      this.playShouHuo();
    }
    if (data.chooseType===3){//施肥成功
      msg = '施肥成功';
      this.setData({
        shiFeiGifShow:true
      })
      setTimeout(()=>{
        this.setData({
          shiFeiGifShow:false
        })
      },2500)
    }
    wx.showToast({
      title:msg,
      icon: 'none',
      duration: 2000
    })
  },
  getChengZiListDetailsBack(data){
    this.data.chengZiListDetails.fertilizeAmount = data.fertilizeAmount;//当天总施肥量
    this.data.chengZiListDetails.orangeAmount1 = data.orangeAmount;//总杨桃数量
    this.data.chengZiListDetails.userFertilizeAmount = data.userFertilizeAmount;//用户总施肥量
    this.data.chengZiListDetails.userFertilizeRatio = data.userFertilizeRatio;//用户占比
    this.data.chengZiListDetails.userOrangeAmount = data.userOrangeAmount;//用户获得的杨桃数量
    this.setData({
      chengZiListDetailsShow:1,
      chengZiListDetails:this.data.chengZiListDetails
    })
  },
  giveFriendBack(data){//100016
    this.closeSetPassword();
    wx.showToast({
      title:'赠送成功',
      icon: 'none',
      duration: 2000
    })
  },
  stealFriendBack(data){//100017
    this.playShouFeiLiao();
    setTimeout(()=>{
      this.goToMyTree();
    },2000)
  },
  getDownImgUrlBack(data){
    this.setData({
      downImgUrl:data,
      downImgShow:true
    })
  },
  getFriendListBack(data){//100019
    this.data.friendList = data;
    this.setData({
      friendList:this.data.friendList
    })
  },
  findPhoneBack(data){//100020
    if (data){
      this.setData({
        friendListShow:false,
        friendInfo:data,
      })
    }
  },
  getExchangeBack(data){
    this.setData({
      exchangeShow:false,
    })
    wx.showToast({//100021
      title:'兑换成功',
      icon: 'none',
      duration: 2000
    })
  },
  getLingQuFeiLiao(data){
    this.getVideoAmount();
    wx.showToast({//100059
      title:'领取成功',
      icon: 'none',
      duration: 2000
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
//检查Socket重连
  checkOpenSocket () {
    let that = this;
    let msg = {
      info: '000000',
      param: {},
      type: '000000'
    };
    msg = JSON.stringify(msg);
    wx.sendSocketMessage({
      data: msg,
      success: (res) => {
        return;
      },
      fail: (err) => { // 未连接打开websocket连接
        console.log(err)
        if(wx.getStorageSync("token")){
          // HTTP.initSocket();
          // 重连
          wx.closeSocket();
          HTTP.initSocket();
          this.getChengZiNumber();
          this.getChengZiInfo();
          //获取可以偷列表,判断可偷按钮是否展示
          this.getCanStealList();
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    // wx.getStorage({
    //   key:'phone',
    //   success(res) {
    //     getApp().globalData.userPhone = res.data;
    //     that.havePhone();
    //   }
    // })
    this.checkOpenSocket();
    wx.onSocketMessage(function (res) {//收到消息
      HTTP.onSocketMessage(res,function (result) {
        if (result.type === '100000'){
          if (result.info === '100001'){
            that.getChengZiNumberBack(result.data);
          }if (result.info === '100002'){
            that.getChengZiInfoBack(result.data);
          }if (result.info === '100003'){
            that.getUserCountBack(result.data);
          }if (result.info === '100004'){
            that.getChengZiListBack(result.data);
          }if (result.info === '100005'){
            that.getCanStealListBack(result.data);
          }if (result.info === '100007'){
            that.getVideoAmountBack(result.data);
          }if (result.info === '100008'){
            console.log(2)
            that.getAllPropsListBack(result.data);
          }if (result.info === '100009'){
            that.getMyPropsListBack(result.data);
          }if (result.info === '100010'){
            that.getMyPropsOrderListBack(result.data);
          }if (result.info === '100011'){
            that.lingChengZiBack(result.data);
          }if (result.info === '100012'){
            that.getChengZiListDetailsBack(result.data);
          }if (result.info === '100016'){
            that.giveFriendBack(result.data);
          }if (result.info === '100017'){
            that.stealFriendBack(result.data);
          }if (result.info === '100018'){
            that.getDownImgUrlBack(result.data);
          }if (result.info === '100019'){
            that.getFriendListBack(result.data);
          }if (result.info === '100020'){
            that.findPhoneBack(result.data);
          }if (result.info === '100021'){
            that.getExchangeBack(result.data);
          }if (result.info === '100059'){
            that.getLingQuFeiLiao(result.data);
          }
        }
      })
    })
    wx.getStorage({
      key:'phone',
      success(res) {
        that.setData({
          phone:res.data
        })
      }
    })
    wx.getStorage({
      key:'nickName',
      success(res) {
        that.setData({
          signName:res.data
        })
      }
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

  /* 转发*/
  onShareAppMessage: function (ops) {
    let phone =  getApp().globalData.userPhone
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      // console.log(ops.target)
    }
    console.log(getApp().globalData.userPhone)
    if (this.data.shareType == 1){
      this.shareFinish(2)
    }
    return {
      title: '杨桃乐园，福利多多',
      path: '/pages/index/index?fphone=' +  phone,
      imageUrl:'http://img.laishida.cn/images/index/share.png',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
        // if (shareTickets.length == 0) {
        //   return false;
        // }
        // //可以获取群组信息
        // wx.getShareInfo({
        //   shareTicket: shareTickets[0],
        //   success: function (res) {
        //     console.log(res)
        //   }
        // })
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },


})
