// pages/location/location.js
const app = getApp()
const urlConfig = require("../../utils/urlConfig");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationList:[
      
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getLocationList();

  },
  getLocationList:function(){
    var that =this;
    wx.request({
      url: urlConfig.LOCATIONLIST_URL,
      method:"GET",
      success(res){
        console.log(res.data)
        if(res.data){
          that.processData(res.data) ;
        }        
      }
    })
  },
  processData:function(arr){
    var tempArr=[];
    for(var i=0;i<arr.length;i++){
      var obj={};
      obj.id=i;
      obj.address=arr[i].location;
      obj.latitude=arr[i].latitude;
      obj.longitude=arr[i].longitude;
      tempArr.push(obj);
    }
    this.setData({
      locationList:tempArr
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
  chooseLocation:function(e){
    const id=e.currentTarget.dataset.id;
    if(app.globalData.kind==0){
      app.globalData.start.address=this.data.locationList[id].address;
      app.globalData.start.latitude=this.data.locationList[id].latitude;
      app.globalData.start.longitude=this.data.locationList[id].longitude;
    }else if(app.globalData.kind==1){
      app.globalData.end.address=this.data.locationList[id].address;
      app.globalData.end.latitude=this.data.locationList[id].latitude;
      app.globalData.end.longitude=this.data.locationList[id].longitude;
    }else{
      console.log("error")
    }
    console.log(app.globalData)
    wx.navigateTo({
      url: '../index/index',
    })
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