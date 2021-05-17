// const WXAPI = require('apifm-wxapi')
const HTTP = require('../utils/httputils')
async function checkSession(){
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })

}

// 检测登录状态，返回 true / false
async function checkHasLogined() {
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  //检查微信登录态是否过期
  const loggined = await checkSession()
  if (!loggined) {
    //过期清除
    wx.removeStorageSync('token')
    return false
  }
  // 检查token状态
  await HTTP.post('/base/user/tokenLogin',token,(data)=>{
    // console.log(data)
    if (data.code != 200) {
      wx.removeStorageSync('token')
      return false
    }
  })

  return true
}

async function wxaCode(){
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        return resolve(res.code)
      },
      fail() {
        wx.showToast({
          title: '获取code失败',
          icon: 'none'
        })
        return resolve('获取code失败')
      }
    })
  })
}

async function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: res => {
        // console.log(res)
        return resolve(res)
      },
      fail: err => {
        // console.error(err)
        return resolve()
      }
    })
  })
}


async function login(errbc){
  const _this = this
  wx.login({
    success: function (res) {
      // console.log(res)
      // get(url, params, onSuccess, onFailed)
      HTTP.post('/base/user/getOpenId',res.code,(data)=>{
        // console.log(data)
        if(data.code == 200){
          wx.setStorage({
            key:"openId",
            data:data.data
          })
          HTTP.post('/base/user/getToken',data.data,(data)=>{
            // console.log(data)
            if(data.code == 200){
              //写入token
              wx.setStorage({
                key:"token",
                data:data.token
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
    }
  })
}

async function register(page) {
  let _this = this;
  wx.login({
    success: function (res) {
      let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
      wx.getUserInfo({
        success: function (res) {
          let iv = res.iv;
          let encryptedData = res.encryptedData;
          let referrer = '' // 推荐人
          let referrer_storge = wx.getStorageSync('referrer');
          if (referrer_storge) {
            referrer = referrer_storge;
          }
          // 下面开始调用注册接口
          WXAPI.register_complex({
            code: code,
            encryptedData: encryptedData,
            iv: iv,
            referrer: referrer
          }).then(function (res) {
            _this.login(page);
          })
        }
      })
    }
  })
}

function loginOut(){
  wx.removeStorageSync('token')
  wx.removeStorageSync('uid')
}

async function checkAndAuthorize (scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success() {
              resolve() // 无返回参数
            },
            fail(e){
              // console.error(e)
              // if (e.errMsg.indexof('auth deny') != -1) {
              //   wx.showToast({
              //     title: e.errMsg,
              //     icon: 'none'
              //   })
              // }
              wx.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success(res) {
                  wx.openSetting();
                },
                fail(e){
                  console.error(e)
                  reject(e)
                },
              })
            }
          })
        } else {
          resolve() // 无返回参数
        }
      },
      fail(e){
        console.error(e)
        reject(e)
      }
    })
  })  
}


module.exports = {
  checkHasLogined: checkHasLogined,
  wxaCode: wxaCode,
  getUserInfo: getUserInfo,
  login: login,
  register: register,
  loginOut: loginOut,
  checkAndAuthorize: checkAndAuthorize
}