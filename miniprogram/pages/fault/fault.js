// pages/fault/fault.js
const URL = require('../../utils/config')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate:'',
    endDate:'',
    errorList:[],
    pageCount:0,//页数总量
    currentPage:1,//当前页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  getErrorData:function(){
    if(this.data.startDate == ''|| this.data.endDate == ''){
      wx.showToast({
        title: '日期不能为空',
        icon:'none'
      })
    }else{
      this.ajaxErrorData(app.globalData.carId,this.data.startDate,this.data.endDate,this.data.currentPage,5);
    }
  },
  ajaxErrorData:function(code,startTime,endTime,pageIndex,pageCount){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var newUrl = URL.SYSTEM_URL+'/api/app/v1/fault'+'?carID='+code+'&startTime='+that.date2timestamp(startTime)+'&endTime='+that.date2timestamp(endTime)+'&pageIndex='+pageIndex+'&pageCount='+pageCount;
    console.log(newUrl);
    wx.request({
      url: newUrl,
      header:{
        'Token':app.globalData.token
      },
      method:"GET",
      success:function(res){
        console.log(res);
        wx.hideLoading();
        if(res.data.status == 'success'){
          that.setData({
            currentPage:pageIndex,
            pageCount:res.data.dataOption.pageCount
          })
          that.handleErrorData(res.data.dataOption.dataRows);
          if(res.data.dataOption.dataCount == '0'){
            wx.showToast({
              title: '无故障',
              icon:'none'
            })
          }
        }else{
          wx.showToast({
            title: '请求失败',
            icon:'none'
          })
        }
      }
    })
  },
  handleErrorData:function(data){
    var tempArr = [];
    for(var i=0;i<data.length;i++){
      var tempObj = {faultID:"",carNumber:"",faultRank:"",address:"",custom:"",faultTime:""};
      tempObj.faultID = data[i].faultID;
      tempObj.carNumber = data[i].carNumber;
      tempObj.faultRank = data[i].faultRank;
      tempObj.address = data[i].address;
      tempObj.custom = data[i].custom;
      tempObj.faultTime = this.timestamp2date(data[i].faultTime);
      tempArr.push(tempObj);
    }
    this.setData({
      errorList:tempArr
    })
  },
  bindStartDateChange:function(e){
    this.setData({
      startDate:e.detail.value
    })
  },
  bindEndDateChange:function(e){
    this.setData({
      endDate:e.detail.value
    })
  },
  //时间转时间戳
  date2timestamp:function(date){
    var newDate = new Date((date).replace(/-/g,"/"));//兼容IOS不能识别"2020-10-10"类型日期问题
    return newDate.getTime();
  },
  //时间戳转时间
  timestamp2date:function(timestamp){
    var newDate = new Date();
    newDate.setTime(timestamp);
    return newDate.toLocaleString();
  },
  //上一页
  backPage:function(){
    this.ajaxErrorData(app.globalData.carId,this.data.startDate,this.data.endDate,(this.data.currentPage-1),5);
  },
  //下一页
  nextPage:function(){
    this.ajaxErrorData(app.globalData.carId,this.data.startDate,this.data.endDate,(this.data.currentPage+1),5);
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