// pages/detail/detail.js
const URL = require('../../utils/config')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList:[
      {key:"carVIN",name:"车辆VIN码: ",value:""},
      {key:"zdbh",name:"终端编号: ",value:""},
      {key:"carNum",name:"车牌号: ",value:""},
      {key:"fdjbh",name:"发动机编号: ",value:""},
      {key:"carType",name:"车辆类型: ",value:""},
      {key:"carPP",name:"车辆品牌: ",value:""},
      {key:"carXH",name:"车辆型号: ",value:""},
      {key:"carYT",name:"车辆用途: ",value:""},
      {key:"carGS",name:"车辆归属: ",value:""},
      {key:"ecuxh",name:"控制器ECU型号: ",value:""},
      {key:"ecurjbb",name:"控制器ECU软件版本: ",value:""},
      {key:"fdjxh",name:"发动机型号: ",value:""},
      {key:"fdjxlh",name:"发动机序列号: ",value:""},
      {key:"fdjpp",name:"发动机品牌: ",value:""},
      {key:"rllx",name:"燃料类型: ",value:""},
      {key:"fdjpl",name:"发动机排量: ",value:""},
      {key:"sccj",name:"生产厂家: ",value:""},
      {key:"khmc",name:"客户名称: ",value:""},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCarInfo(app.globalData.carId);
  },
  getCarInfo:function(carId){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: URL.SYSTEM_URL+'/api/app/v1/vehicle/detail/'+carId,
      header:{
        'Token':app.globalData.token
      },
      method:"GET",
      success:function(res){
        console.log(res);
        if(res.data.status == 'success'){
          that.handleInfoData(res.data.dataOption);
        }
      }
    })
  },
  handleInfoData(data){
    var newArr = this.data.detailList.concat();
    for(var i = 0;i<newArr.length;i++){
      if(data[newArr[i].key]){
        newArr[i].value = data[newArr[i].key];
      }
    }
    this.setData({
      detailList:newArr
    })
    wx.hideLoading();
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