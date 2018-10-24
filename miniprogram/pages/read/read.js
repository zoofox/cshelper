// pages/read/read.js
import Toast from '../../vant/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    roomId:'',
    soundType:'选项1',
    readStatusText:'开始',
    isReading:false,
    actions: [
      {
        name: '选项1'
      },
      {
        name: '选项2'
      },
      {
        name: '选项3'
      },
      {
        name: '选项4'
      },
      {
        name: '选项5'
      },
      {
        name: '选项6'
      },
      {
        name: '选项3'
      },
      {
        name: '选项4'
      },
      {
        name: '选项5'
      },
      {
        name: '选项6'
      }
    ]
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
  onChangeRoomId: function (event){
    this.setData({roomId:event.detail});
  },
  onClose() {
    this.setData({ show: false });
  },
  onSelect(event) {
    this.setData({
      soundType:event.detail.name,
      show:false
    })
  },
  showSoundTypes(){
    this.setData({ show: true });
  },
  readControl(){
    if (!this.data.isReading){
      var roomId = this.data.roomId;
      var soundType = this.data.soundType;
      if(roomId == ''){
        Toast.fail('请输入房间号');
        return;
      }else{
        if(isNaN(roomId)){
          Toast.fail('房间号必须为数字哦～');
          return;
        }else{
          this.startRead(roomId, soundType);
        }
      }
    }else{

    }
  },
  startRead(roomId, soundType){
    console.log('2222')
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getRoomBarrage',
      // 传给云函数的参数
      data: {
        roomId: roomId,
        soundType: soundType
      },
      success:res=>{
        console.log('a'+res);
      }
     
    
    })
  }
})