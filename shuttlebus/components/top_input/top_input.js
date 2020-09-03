// components/top_input/top_input.js
const app = getApp();
const urlConfig = require("../../utils/urlConfig");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    startAddress: {
      type: String,
      value: '',
    },
    endAddress: {
      type: String,
      value: '',
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    chooseStart:function(){
      app.globalData.kind=0;
      wx.navigateTo({
        url: '../../pages/location/location',
      })
    },
    chooseEnd:function(){
      app.globalData.kind=1;
      wx.navigateTo({
        url: '../../pages/location/location',
      })
    },
    submitOrder:function(){
      var that=this;
      var appData=app.globalData;
      if(appData.hasLogin==true){
        if(appData.start.latitude!=0&&appData.end.latitude!=0){
          wx.getStorage({
            key:"phone_number",
            success(res){
              console.log(res.data);
              wx.request({
                url: urlConfig.SYSTEM_URL+'/client/createorder',
                method:"POST",
                header:{
                  'content-type': 'application/json'
                },
                data:{
                  phone_number:res.data,
                  start_position_x:appData.start.latitude,
                  start_position_y:appData.start.longitude,
                  target_position_x:appData.end.latitude,
                  target_position_y:appData.end.longitude,
                  is_in_car:false,
                  order_status:"comp"
                },
                success(res){
                  console.log(res.data);
                  if(typeof res.data=='string'){
                    wx.showModal({
                      title: "排队中",
                      content:res.data+",请重新提交订单",
                      showCancel:false,
                      confirmText:"取消排队",
                      success(result){
                        if(result.confirm){
                          wx.request({
                            url: urlConfig.SYSTEM_URL+'/client/createorder',
                            data:{
                              phone_number:res.data,
                              queue_cancel:true,
                            },
                            header:{
                              'content-type': 'application/json'
                            },
                            method:"POST",
                            success(r){
                              console.log(r.data)
                            }
                          })
                        }
                      }
                    })
                  }else{
                    that.storageOrderInfo(res)
                    wx.navigateTo({
                      url: '../../pages/progress/progress',
                    })
                  }
                }
              })
            },
            fail(error){
              console.log(error);
              wx.navigateTo({
                url: '../../pages/login/login',
              })
            }
          });
        }else{
          wx.showToast({
            title: '起点或终点不能为空',
            icon:'none',
          })
        }
      }else{
        wx.navigateTo({
          url: '../../pages/login/login',
        })
      }
      
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
    }
  }
})
