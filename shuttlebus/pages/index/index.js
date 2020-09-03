//index.js
//获取应用实例
const app = getApp()
const urlConfig = require("../../utils/urlConfig");

Page({
  data: {
    windowHeight:0,
    mapData:{
      latitude:0,//手机获取的定位坐标
      longitude:0,//手机获取的定位坐标
    },
    startAddress:"",
    endAddress:"",
    phone_number:"",
    hasLogin:false,
  },
  onLoad: function () {
    this.initData();
    this.checkUserOrder();
    this.getUserLocation();
  },
  onShow: function(){
    this.syncAddress();
  },    
  //检查当前用户是否有正在进行的订单
  checkUserOrder:function(){
    var that=this;
    wx.getStorage({
      key:'phone_number',
      success(res){
        console.log(res)
        app.globalData.hasLogin=true;
        that.data.phone_number=res.data;
        wx.request({
          url: urlConfig.SYSTEM_URL+'/client/checkorder',
          data:{
            phone_number:res.data,
            start_positon_x:'0',
            start_positon_y:'0',
            target_positon_x:'0',
            target_positon_y:'0',
            is_in_car:false,
            order_status:"proc"
          },
          method:"POST",
          success(r){
            console.log(r.data);
            if(typeof r.data=='string'){
              
            }else{
              that.storageOrderInfo(r)
              wx.navigateTo({
                url: '../progress/progress',
              })
            }
          }
        })
      },
      // fail(error){
      //   console.log(error)
      //   wx.navigateTo({
      //     url: '../login/login',
      //   })
      // }
    })
  },
  //存储订单信息
  storageOrderInfo:function(res){
    var tempObj={};
    tempObj.start_position_x=res.data.start_position_x;
    tempObj.start_position_y=res.data.start_position_y;
    tempObj.target_position_x=res.data.target_position_x;
    tempObj.target_position_y=res.data.target_position_y;
    tempObj.order_id=res.data.order_id;
    wx.setStorage({
      data: tempObj,
      key: 'order_data',
    })
  },
  //初始化
  initData:function(){
    this.setData({
      windowHeight:app.globalData.windowHeight,
      hasLogin:app.globalData.hasLogin
    })
  },
  getUserLocation:function(){
    let that=this;
    wx.getLocation({
      type: 'gcj02',
      success(res){
        const tempLatitude=res.latitude;
        const tempLongitude=res.longitude;
        app.globalData.currentLatitude=tempLatitude;
        app.globalData.currentLongitude=tempLongitude;
        that.setData({
          "mapData.latitude":tempLatitude,
          "mapData.longitude":tempLongitude
        });
      }
    })
  },
  //同步位置信息
  syncAddress:function(){
    this.setData({
      startAddress:app.globalData.start.address,
      endAddress:app.globalData.end.address
    })
  },
  //退出登录
  logout:function(){
    var that = this;
    wx.showModal({
      title:'注销',
      content:'您是否确定退出登录?',
      confirmText:'退出登录',
      success(r){
        if(r.confirm){
          wx.request({
            url: urlConfig.SYSTEM_URL+'/client/logout',
            data:{
              client_name: "",
              password: "",
              phone_number:that.data.phone_number,
              login_or_create:true,
              is_client_login:false
            },
            method:'POST',
            header:{
              'content-type': 'application/json'
            },
            success:function(res){
              console.log(res.data)
                wx.showToast({
                  title: res.data,
                  icon:"none"
                })
                if(res.data==="当前账号已成功退出"||res.data==="该账号并未登录"){
                  //先清理缓存然后跳转到登录页面
                  wx.clearStorage({
                    complete: (result) => {
                      wx.navigateTo({
                        url: '../login/login',
                      })
                    },
                  })
                }
            },
          })
        }
      },
    })
  },
})
