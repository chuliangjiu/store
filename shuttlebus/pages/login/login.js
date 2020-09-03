// miniprogram/pages/login/login.js
var md5=require('../../utils/md5');
var app=getApp();
const urlConfig = require("../../utils/urlConfig");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    client_name: "weichai",//用户名默认为weichai
    password: "",
    phone_number:"",
    login_or_create:true,
    is_client_login:true,
    checkFlag:0,//0-手机号和密码都不合法 1-手机号或密码不合法 2-输入都合法
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
  //登录
  loginBtnClick: function(e){
      var that=this;
      that.checkInput();  
      if(this.data.checkFlag==2){
        wx.request({
          url: urlConfig.SYSTEM_URL+'/client/login',
          data:{
            client_name: this.data.client_name,
            password: md5.hex_md5(this.data.password),
            phone_number:this.data.phone_number,
            login_or_create:this.data.login_or_create,
            is_client_login:this.data.is_client_login
          },
          method:'POST',
          header:{
            'content-type': 'application/json'
          },
          success:function(res){
              console.log(app.globalData);
              app.globalData.hasLogin=true;
              if(typeof res.data=='object'){
                that.storageUserInfo();
                wx.navigateTo({
                  url: '../index/index',
                })
              }else{
                //如果服务器提示未退出登录状态，缓存手机号之后直接跳转到index
                if(res.data==="此账号已在别的设备登录"){
                  wx.setStorage({ 
                    data: that.data.phone_number,
                    key: 'phone_number',
                  })
                  wx.navigateTo({
                    url: '../index/index',
                  })
                }else{
                  wx.showToast({
                    title: res.data,
                    icon:"none"
                  })
                }
              }
          },
          fail:function(error){
            console.log(error)
          }
        })
      }else{
        console.log(this.data.checkFlag)
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
        console.log('密码符合规则');
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

  phone_numberInput: function(event){
    var p_num = event.detail.value;
    if(p_num != "")
    this.setData({phone_number:p_num})
  },

  pwdInput: function(event){
    var psd = event.detail.value;
    if(psd != "")
    this.setData({password:psd})
  },
  register:function(){
    wx.navigateTo({
      url: '../register/register',
    })
  }
})