// pages/register/register.js
const md5=require('../../utils/md5');
const urlConfig = require("../../utils/urlConfig");
const app = getApp();
Page({
 
  /**
   * 页面的初始数据
   * data为全局变量
   */
  data: {
    client_name: "weichai",//用户名默认为weichai
    password: "",
    phone_number:"",
    login_or_create:false,
    is_client_login:true,
    checkFlag:0,//0-手机号和密码都不合法 1-手机号或密码不合法 2-输入都合法
    passwordAgain:"",//再次确认密码
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
 
phone_numberInput: function (e) {
  var p_num = e.detail.value;
  if (p_num != '') {
    this.setData({ 
      phone_number: p_num,
    });
    
  }
},
 //处理pwdBlur的触发事件
 pwdBlur: function (e) {
   var pwd = e.detail.value;//从页面获取到用户输入的密码
   if (pwd != '') {
     this.setData({ password: pwd });//把获取到的密码赋值给date中的password
   }
 },
 //处理pwdBlur的触发事件,再次确认密码
 pwdBlurAgain: function (e) {
  var pwd = e.detail.value;//从页面获取到用户输入的密码
  if (pwd != '') {
    this.setData({ passwordAgain: pwd });//把获取到的密码赋值给date中的password
  }
},
register:function(){
  //先确认一下两次输入的密码是否一致
  if(this.data.password===this.data.passwordAgain){
    this.registerAjax();
  }else{
    wx.showToast({
      title: '两次密码不一致',
      icon:'none'
    })
  }
},
 //register的ajax请求
 registerAjax: function (e) {
   var that=this;
   this.checkInput();
   if(this.data.checkFlag==2){
    wx.request({
      url: urlConfig.SYSTEM_URL+'/client/login',
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        client_name: this.data.client_name,
        password:md5.hex_md5(this.data.password),
        phone_number:this.data.phone_number,
        login_or_create:this.data.login_or_create,
        is_client_login:this.data.is_client_login
      },
      method: 'POST',//定义传到后台接受的是post方法还是get方法
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        app.globalData.hasLogin=true;
        if(typeof res.data=='object'){
         wx.navigateTo({
           url: '../index/index',
         });
         that.storageUserInfo();
       }else{
         wx.showToast({
           title: res.data,
           icon:"none"
         })
       }
      },
      fail: function (res) {
        console.log("调用API失败");
      }
    })
   }else{
     console.log(this.data.checkFlag);
   }
 },
 //检查输入合法性
 checkInput:function(){
  this.data.checkFlag=0;
  if(this.data.phone_number!=''){
    var p_num=this.data.phone_number;
    let str=/^1\d{10}$/;
    if(str.test(p_num)){
      console.log("手机号格式正确");
      this.data.checkFlag+=1;
    }else{
      wx.showToast({
        title: '请检查手机号格式是否正确',
        icon:"none"
      })
    }
  }else{
    wx.showToast({
      title: '手机号不能为空',
        icon:"none"
    })
  }
  if(this.data.password!=''){
    var psw=this.data.password;
    let str=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;//大于等于八位的数字和英文
    if(str.test(psw)){
      this.data.checkFlag+=1;
      console.log('符合规则');
    }else{
      wx.showToast({
        title: '密码需要同时包含数字和字母，并且至少八位',
        icon:'none'
      })
    }
  }else{
    wx.showToast({
      title: '密码不能为空',
        icon:"none"
    })
  }
},
 storageUserInfo:function(){
  wx.setStorage({
    data: this.data.phone_number,
    key: 'phone_number',
  })
},
})
