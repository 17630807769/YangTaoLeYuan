/**
 * 请求地址
 */
const BASE_URL = 'http://cz.krjie.com'
// const BASE_URL = 'https://www.yunlemuyuan.com';
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIiwiaWF0IjoxNjIxMjM0OTUzLCJleHAiOjEwMjYxMTQ4NTUzLCJqdGkiOiJ7XCJhY2NvdW50U3RhdHVzXCI6MCxcImFsbEZlcnRpbGl6ZUFtb3VudFwiOjAuMDAsXCJhdmF0YXJcIjpcImh0dHA6Ly90aGlyZHd4LnFsb2dvLmNuL21tb3Blbi9zUlVBbFI5ckczVUJBNFdMN29xa21FSXVKZUhHRTVVY2IxZU1yaWI0TjN6bDFJMVdxaWEyNVJackNLTXpGRE9LaWN6NWdjZmZQNTNnSE9sSkdwRFEzYnhVUm1FNUpub0VpYk9xLzEzMlwiLFwiY3JlYXRlVGltZVwiOlwiMjAyMTA1MTcxNDU2MjhcIixcImlkXCI6MSxcImlzRGVsZXRlXCI6ZmFsc2UsXCJpc0xvZ2luXCI6dHJ1ZSxcIm5pY2tOYW1lXCI6XCLlsI_npaVcIixcIm5vdENoYXJnZUVnZ0Ftb3VudFwiOjAuMDAsXCJub3RDaGFyZ2VNdWNrQW1vdW50XCI6MC4wMDAwLFwibm90Q2hhcmdlT3JhbmdlQW1vdW50XCI6MC4wMDAwLFwibm90RmVydGlsaXplQW1vdW50XCI6MC4wMCxcIm9wZW5pZFwiOlwidGVzdHRlc3R0ZXN0XCIsXCJvcmFuZ2VBbW91bnRcIjowLjAwMDAsXCJvdmVyRWdnQW1vdW50XCI6MC4wMCxcIm92ZXJJbmdvdHNBbW91bnRcIjowLjAwMDAsXCJvdmVyT3JhbmdlQW1vdW50XCI6MC4wMDAwLFwicGhvbmVcIjpcIjE1NTY1NTM2MzI1XCIsXCJ0b2RheUZlcnRpbGl6ZUFtb3VudFwiOjAuMDAsXCJ0b3RhbEVnZ0Ftb3VudFwiOjAuMDAsXCJ1cGRhdGVUaW1lXCI6XCIyMDIxMDUxNzE1MDIzM1wiLFwidXNlckluZ290c0Ftb3VudFwiOjAuMDAwMCxcInZlcnNpb25cIjoxfSJ9.vFkor4_BgNPM9OlcPt2skvv4bRNOP2BrSVFtX2VG0zw'
/**
 * 请求头
 */
var header = {
    'content-type': 'application/json;charset=UTF-8',
    'token':wx.getStorageSync("token"),
    // 'Authorization': "Bearer " + wx.getStorageSync("token"),
    'Authorization': "Bearer " + token,
    // 'os': 'android',
    // 'version': '1.0.0',
    // 'device_token': 'ebc9f523e570ef14',
}

/**
 * 供外部post请求调用
 */
function post(url, params, onSuccess, onFailed) {
    // console.log("请求方式：", "POST")
    request(url, params, "POST", onSuccess, onFailed);
}

/**
 * 供外部get请求调用
 */
function get(url, params, onSuccess, onFailed) {
    // console.log("请求方式：", "GET")
    request(url, params, "GET", onSuccess, onFailed);
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onSuccess 成功回调
 * @onFailed  失败回调
 */

function request(url, params, method, onSuccess, onFailed) {
    // if(header.Authorization === 'Bearer '||header.Authorization === 'Bearer undefined'){
    //     header['Authorization'] = "Bearer " + wx.getStorageSync("token");
    // }
    header['userId'] = 1;
    // console.log('请求url：'+ BASE_URL + url);
    wx.showLoading({
        title: "正在加载中...",
    })
    // console.log("请求头：", header)
    wx.request({
        url: BASE_URL + url,
        data: dealParams(params),
        method: method,
        header: header,
        success: function(res) {
            wx.hideLoading();
            // console.log('响应：', res.data);
            if (res.data) {
                /** start 根据需求 接口的返回状态码进行处理 */
                if (res.statusCode == 200) {
                    if(res.data.code === 400){//跳到登陆去
                        wx.removeStorage("token");
                        wx.navigateTo({url:'/pages/login-type/index'})
                    }
                    onSuccess(res.data); //request success
                } else {
                    if(typeof onFailed === "function"){
                        onFailed();
                    } else {
                        wx.showToast({
                            icon:"none",
                            title: res.data.message,
                            duration: 2000
                        })
                    }
                }
                /** end 处理结束*/
            }
        },
        fail: function(error) {
            wx.hideLoading();
            console.log(error)
            wx.showToast({
                icon:'none',
                title: '请求超时',
                duration: 2000
            })

        },
    })
}
let socketOpen=false;//判断是否已经成功open
let socketMsgQueue=[];//成功open之前，要发的消息暂存此数组。。open之后 循环发出
function initSocket() {
    wx.connectSocket({
        url: 'ws://192.168.0.11:7000/ws?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIiwiaWF0IjoxNjA3NDgzMTgzLCJleHAiOjEwMjQ3Mzk2NzgzLCJqdGkiOiJ7XCJpZFwiOjF9In0.YInvjw9y-0kBVweqNEOCNjZtmCDHzlS-iw8FyBEPQJU'
    })
    wx.onSocketOpen(function(res) {
        socketOpen = true;
        for (let i = 0; i < socketMsgQueue.length; i++){
            sendSocketMessage(socketMsgQueue[i])
        }
        socketMsgQueue = [];
    })
    wx.onSocketClose(function(res) {
        console.log('WebSocket 已关闭！');
        //重连
    })
    wx.onSocketError(function () {
        console.log('WebSocket 异常！');
        //重连
    })
}
// 发送方法的封装
function sendSocketMessage(msg) {
    console.log(msg)
    if (socketOpen) {
        wx.sendSocketMessage({
            data:msg
        })
    } else {
        socketMsgQueue.push(msg)
    }
}
// 发送方法的封装1
function sendMessage(info,param,type) {
    let msg = {info:info,param:{},type:'100000'};
    if (param){
        msg.param = param
    }
    if (type){
        msg.type = type
    }
    msg = JSON.stringify(msg);
    if (socketOpen) {
        wx.sendSocketMessage({
            data:msg
        })
    } else {
        socketMsgQueue.push(msg)
    }
}
//返回的方法封装
function onSocketMessage(res,callback) {
    let result = JSON.parse(res.data);
    console.log(result);
    if (result.code === 200){
        callback(result)
    } else if(result.code === 411) {
        //重新登录 //message
    } else {
        //message
        wx.showToast({
            title: result.message,
            icon: 'none',
            duration: 2000
        })
    }
}
/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
    // console.log("请求参数:", params)
    return params;
}


// 1.通过module.exports方式提供给外部调用
module.exports = {
    post: post,
    get: get,
    initSocket:initSocket,
    sendMessage:sendMessage,
    onSocketMessage:onSocketMessage
}