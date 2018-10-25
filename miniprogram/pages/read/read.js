// pages/read/read.js
import Toast from '../../vant/toast/toast';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    roomId: '',
    soundType: '选项1',
    readStatusText: '开始',
    isReading: false,
    breakpoint: '',
    buffer: [],
    actions: [{
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
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  onChangeRoomId: function(event) {
    this.setData({
      roomId: event.detail
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onSelect(event) {
    this.setData({
      soundType: event.detail.name,
      show: false
    })
  },
  showSoundTypes() {
    this.setData({
      show: true
    });
  },
  readControl() {
    if (!this.data.isReading) {
      var roomId = this.data.roomId;
      var soundType = this.data.soundType;
      if (roomId == '') {
        Toast.fail('请输入房间号');
        return;
      } else {
        if (isNaN(roomId)) {
          Toast.fail('房间号必须为数字哦～');
          return;
        } else {
          this.startRead(roomId, soundType);
        }
      }
    } else {

    }
  },
  startRead(roomId, soundType) {
    var self = this;
    this.setData({
      buffer: []
    });
    var breakpoint = self.data.breakpoint;
    self.getBarrage(roomId, soundType, breakpoint);

  },
  getBarrage(roomId, soundType, breakpoint) {
    var self = this;
    console.log('bre:'+breakpoint);
    app.util.getBarrage(roomId,1,breakpoint,function(newBreakpoint,barrages){
      self.setData({
        breakpoint: newBreakpoint
      });
      if (barrages.length != 0){
        self.data.buffer = self.data.buffer.concat(barrages);
      }
      console.log(self.data.buffer);
      setTimeout(function () {
        self.getBarrage(roomId, soundType, self.data.breakpoint);
      }, 1500)
    })
  }
})