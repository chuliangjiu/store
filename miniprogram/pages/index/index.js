//index.js
//获取应用实例
const configData = require('../../utils/config')
const app = getApp()

Page({
  data: {
    windowHeight:0,
    latitude:0,
    longitude:0,
    markers:[
      {latitude:0,longitude:0,iconPath:'../../imgs/location.png',width:24,height:24}
    ],
    infoList:[
      {leftText:{key:"rate",name:"车速(km/h): ",value:""},rightText:{key:"npm",name:"转速(r/min): ",value:""}},
      {leftText:{key:"accelerate",name:"加速踏板开度(%): ",value:""},rightText:{key:"loadRate",name:"实际扭矩百分比(%): ",value:""}},
      {leftText:{key:"lqyTemp",name:"冷却液温度(℃): ",value:""},rightText:{key:"oilTemp",name:"机油温度(℃): ",value:""}},
      {leftText:{key:"ssyh",name:"瞬时油耗(km/L): ",value:""},rightText:{key:"ljgls",name:"累计公里数(km): ",value:""}},
      {leftText:{key:"ljyxsj",name:"累计运行时间(h): ",value:""},rightText:{key:"ljyh",name:"累计油耗(L): ",value:""}},
      {leftText:{key:"rywd",name:"燃油温度(℃): ",value:""},rightText:{key:"zlhjqyl",name:"中冷后进气压力(kPa): ",value:""}},
      {leftText:{key:"pqwd",name:"排气温度(℃): ",value:""},rightText:{key:"zlhjqwd",name:"中冷后进气温度(℃): ",value:""}},
      {leftText:{key:"jyyl",name:"机油压力(kPa): ",value:""},rightText:{key:"cknj",name:"参考扭矩(N·m): ",value:""}},
      {leftText:{key:"mcnjbfb",name:"摩擦扭矩百分比(%): ",value:""},rightText:{key:"xdcdy",name:"蓄电池电压(V): ",value:""}},
      {leftText:{key:"hjdqyl",name:"环境大气压力(kPa): ",value:""},rightText:{key:"hjdqwd",name:"环境大气温度(℃): ",value:""}},
      
    ],
    timer:''//定时器
  },
  
  onLoad: function (options) {
    if(options.terminal){
      this.login(options.terminal);
    }else{
      wx.showModal({
        title: '温馨提醒',
        content:'请退出小程序点击微信扫一扫扫描车辆二维码',
        showCancel: false,
        success:function(res){
          
        }
      })
    }
    this.getWindowHeight();
    this.getLocation();
  },
  onShow: function(){
    clearInterval(this.data.timer);
    //返回到实时工况页面是立即获取一下最新数据，然后定时器每10s再获取一下最新数据
    if(app.globalData.carId != ''){
      this.getCarStatus(app.globalData.carId);
      this.setTimer();
    }
  },
  onHide: function(){
    clearInterval(this.data.timer);
  },
  getCarId:function(code){
    var that = this;
    wx.request({
      url: configData.SYSTEM_URL+'/api/app/v1/vehicle/terminal/'+code,
      header:{
        'Token':app.globalData.token
      },
      method:"GET",
      success:function(res){
        console.log(res);
        if(res.data.status == 'success'){
          app.globalData.carId = res.data.dataOption;
          that.getCarStatus(res.data.dataOption);
        }
      }
    })
  },
  getCarStatus:function(carId){
    var that = this;
    wx.request({
      url: configData.SYSTEM_URL+'/api/app/v1/vehicle/monitor/'+carId,
      header:{
        'Token':app.globalData.token
      },
      method:"GET",
      success:function(res){
        console.log(res);
        if(res.data.status == 'success'){
          var resData = res.data.dataOption;
          if(resData.location.lat){
            that.setData({
              latitude:resData.location.lat,
              longitude:resData.location.lng,
              markers:[
                {latitude:resData.location.lat,longitude:resData.location.lng,iconPath:'../../imgs/location.png',width:24,height:24}
              ]
            })
          }
          that.handleStatusData(resData);
        }
        wx.hideLoading();
      }
    })
  },
  handleStatusData:function(data){
    var newArr = this.data.infoList.concat();
    for(var i = 0;i<newArr.length;i++){
      if(data.custonSta&&data.custonSta[newArr[i].leftText.key]){
        newArr[i].leftText.value = data.custonSta[newArr[i].leftText.key];
      }
      if(data.fixData&&data.fixData[newArr[i].leftText.key]){
        newArr[i].leftText.value = data.fixData[newArr[i].leftText.key];
      }
      if(data.realTimeSta&&data.realTimeSta[newArr[i].leftText.key]){
        newArr[i].leftText.value = data.realTimeSta[newArr[i].leftText.key];
      }
      if(data.custonSta&&data.custonSta[newArr[i].rightText.key]){
        newArr[i].rightText.value = data.custonSta[newArr[i].rightText.key];
      }
      if(data.fixData&&data.fixData[newArr[i].rightText.key]){
        newArr[i].rightText.value = data.fixData[newArr[i].rightText.key];
      }
      if(data.realTimeSta&&data.realTimeSta[newArr[i].rightText.key]){
        newArr[i].rightText.value = data.realTimeSta[newArr[i].rightText.key];
      }
    }
    this.setData({
      infoList:newArr
    })
  },
  getLocation:function(){
    var that = this;
    wx.getLocation({
      type:"gcj02",
      success:function(res){
        // console.log(res);
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude,
          markers:[
            {latitude:res.latitude,longitude:res.longitude,iconPath:'../../imgs/location.png',width:24,height:24}
          ]
        })
      }
    })
  },
  setTimer:function(){
    var that = this;
    that.data.timer = setInterval(function(){
      that.getCarStatus(app.globalData.carId)
    },10000);
  },
  //初始化屏幕高度
  getWindowHeight:function(){
    this.setData({
      windowHeight:app.globalData.windowHeight
    })
  },
  //用默认帐号密码登录，用户名weichai02
  login:function(terminal){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    wx.request({
      url: configData.SYSTEM_URL+'/api/auth/login',
      method:"POST",
      data:{
        "username":configData.USERNAME,
        "password":configData.PASSWORD,
        "userType":0
      },
      success:function(res){
        console.log(res.data);
        if(res.data.status == 'success'){
          app.globalData.token = res.data.dataOption.token;
          app.globalData.userId = res.data.dataOption.userId;
          that.getCarId(terminal);
        }
      }
    })
  }
})
