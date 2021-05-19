// const WXAPI = require('apifm-wxapi')
const HTTP = require('../utils/httputils')
async function login(errbc){
  // const _this = this
  wx.login({
    success: function (res) {
      // console.log(res)
      // get(url, params, onSuccess, onFailed)
      HTTP.get('/api/v1/leyuan/user/info/outer/get/openid/'+res.code,{},(data)=>{
        // console.log(data)
        if(data.code == 200){
          wx.setStorage({
            key:"openId",
            data:data.data
          })
          wx.getUserInfo({
            success: function (res) {
              let params={};
              console.log(res)
              // params.avatar =
              HTTP.post('/api/v1/leyuan/user/info/outer/wx/login',data.data,(data)=>{
                // console.log(data)
                if(data.code == 200){
                  //写入token
                  wx.setStorage({
                    key:"token",
                    data:data.token
                  })
                }
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

function loginOut(){
  wx.removeStorageSync('token')
  wx.removeStorageSync('openId')
  wx.removeStorageSync('uid')
}

module.exports = {
  login: login,
  loginOut: loginOut,
}