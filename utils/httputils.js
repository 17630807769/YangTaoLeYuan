/**
 * 请求地址
 */
// const BASE_URL = 'https://cz.krjie.com'
// var wss_url = 'wss://cz.socket.krjie.com/ws';
const BASE_URL = 'https://ytapi.laishida.cn'
var wss_url = 'wss://yangtao.laishida.cn/ws';
/**
 * 请求头
 */
var header = {
    'content-type': 'application/json;charset=UTF-8',
    // 'token':wx.getStorageSync("token"),
    'Authorization': "Bearer " + wx.getStorageSync("token"),
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
 * 供外部PUT请求调用
 */
function put(url, params, onSuccess, onFailed) {
    // console.log("请求方式：", "PUT")
    request(url, params, "PUT", onSuccess, onFailed);
}

/**
 * 供外部DELETE请求调用
 */
function delete1(url, params, onSuccess, onFailed) {
    // console.log("请求方式：", "DELETE")
    request(url, params, "DELETE", onSuccess, onFailed);
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
    if(header.Authorization === 'Bearer '||header.Authorization === 'Bearer undefined'){
        header['Authorization'] = "Bearer " + wx.getStorageSync("token");
    }
    // header['userId'] = 1;
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
                    console.log(res.data);
                    // if(res.data.code === 200){
                    //     onSuccess(res.data); //request success
                    // } else {
                    //     if(res.data.code === 411){//跳到登陆去
                    //         wx.removeStorage("token");
                    //         wx.redirectTo({url:'/pages/login/login'});
                    //     }
                    //     wx.showToast({
                    //         icon:"none",
                    //         title: res.data.message,
                    //         duration: 2000
                    //     })
                    // }
                    if(res.data.code === 411){//跳到登陆去
                        wx.removeStorage("token");
                        wx.redirectTo({url:'/pages/login/login'});
                        return
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
let initCount = 1;
let time=null;//心跳定时器
function initSocket() {
    let wss_url1 = wss_url + '?token='+wx.getStorageSync("token");
    console.log(wss_url1)
    wx.connectSocket({
        url: wss_url1,
    })
    wx.onSocketOpen(function(res) {
        socketOpen = true;
        for (let i = 0; i < socketMsgQueue.length; i++){
            sendSocketMessage(socketMsgQueue[i])
        }
        socketMsgQueue = [];
        //发送心跳包
        clearInterval(time);
        time = setInterval(()=>{
            sendMessage('000000',{},'000000')
        },10000)
    })
    wx.onSocketClose(function(res) {
        console.log('WebSocket 已关闭！');
        clearInterval(time);
        //重连
    })
    wx.onSocketError(function () {
        console.log('WebSocket 异常！');
        clearInterval(time);
        if (initCount<3){
            setTimeout(()=>{
                initSocket();
                console.log('WebSocket 第'+initCount+'次重连！');
                initCount+=1;
            },1000)
        } else {
            console.log('WebSocket 重连失败');
        }
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
    if (wx.getStorageSync("token")){
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
    } else {
        wx.removeStorage("token");
        wx.redirectTo({url:'/pages/login/login'});
    }
}
//返回的方法封装
function onSocketMessage(res,callback) {
    let result = JSON.parse(res.data);
    console.log(result);
    if (result.code === 200){
        callback(result)
    } else if(result.code === 202) {
        // console.log('心跳包，不处理')
    } else if(result.code === 411) {
        //重新登录
        wx.removeStorage("token");
        wx.redirectTo({url:'/pages/login/login'});
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
    put:put,
    delete:delete1,
    initSocket:initSocket,
    sendMessage:sendMessage,
    onSocketMessage:onSocketMessage
}