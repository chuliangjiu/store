// pages/progress/progress.js
const urlConfig = require("../../utils/urlConfig");
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:0,
    mapData:{
      latitude:0,//手机获取的定位坐标
      longitude:0,//手机获取的定位坐标
    },
    markers:[
      {id:1,latitude:36.7175671415,longitude:119.207696771,iconPath:'../../resource/imgs/car.png',width:36,height:36}
    ],
    polyline:{},//路径
    orderInfo:{},//返回的订单信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data)
    this.initData();
    // this.getOrderInfo(false,'proc');
  },
  initData:function(){
    console.log(app.globalData)
    var tmpObj={
      latitude:app.globalData.currentLatitude,
      longitude:app.globalData.currentLongitude
    }
    this.setData({
      windowHeight:app.globalData.windowHeight,
      mapData:tmpObj,
    })
  },
  getOrderInfo:function(is_in_car,order_status){
    var that=this;
    wx.getStorage({
      key: 'order_data',
      success(res){
        console.log(res);
        wx.request({
          url: urlConfig.SYSTEM_URL+'/client',
          method:"POST",
          data:{
            order_id:res.data.order_id,
            start_position_x:res.data.start_position_x,
            start_position_y:res.data.start_position_y,
            target_position_x:res.data.target_position_x,
            target_position_y:res.data.target_position_y,
            is_in_car:is_in_car,
            order_status:order_status
          },
          success(result){
            console.log(result.data);
            that.setData({
              orderInfo:result.data,
              mapData:{
                latitude:result.data.current_position_x,
                longitude:result.data.current_position_y,
              },
              markers:[{id:1,latitude:parseFloat(result.data.current_position_x),longitude:parseFloat(result.data.current_position_y),iconPath:'../../resource/imgs/car.png',width:10,height:10}]
            })
            if(result.data.order_status=="comp"){
              wx.navigateTo({
                url: '../index/index',
              })
            }
          },
          fail(err){
            console.log(err)
          }
        })
      },
      fail(error){
        console.log(error)
      }
    })
  },
  //是否上车
  isInCar:function(){
    var that=this;
    wx.showModal({
      title:'确认上车',
      content:'如果您已上车，请点击确认上车按钮',
      confirmText:'确认上车',
      success(r){
        if(r.confirm){
          that.getOrderInfo(true,'proc');
        }
      },
    })
  },
  //是否完成订单
  isComplete:function(){
    var that=this;
    wx.showModal({
      title:'确认下车',
      content:'如果您已下车，请点击确认下车按钮以完成订单',
      confirmText:'确认下车',
      success(r){
        if(r.confirm){
          that.getOrderInfo(true,'comp');
        }
      },
    })
  },
  //查询车辆位置
  searchCarLocation:function(){
    var that=this;
    wx.showModal({
      title:'车辆位置',
      content:'您是否想要更新车辆当前位置?',
      confirmText:'确认更新',
      success(r){
        if(r.confirm){
          that.getOrderInfo(that.data.orderInfo.is_in_car==1?true:false,that.data.orderInfo.order_status);
        }
      },
    })
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

  }
})