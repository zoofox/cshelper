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
    soundType: '暂不可选',
    readStatusText: '开始',
    isReading: false,
    breakpoint: '',
    buffer: [],
    audio:null,
    intervalTime:null,
    openId:'',
    readname:0,
    actions: [{
      name: '暂不可选'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var value = wx.getStorageSync('openId')
    this.setData({openId:value});
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
  switchChange(){
    var readname = this.data.readname;
    this.setData({
      readname:1-readname
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
          this.clear();
          this.startRead(roomId, soundType);
        }
      }
    } else {
      this.setData({
        readStatusText: '开始',
        buffer: [],
        isReading: false
      });
      this.clear();
      this.stop();
    }
  },
  startRead(roomId, soundType) {
    var self = this;
    var breakpoint = self.data.breakpoint;
    this.setData({
      readStatusText: '停止',
      buffer: [],
      isReading:true
    });
    self.getBarrage(roomId, soundType, breakpoint);
    if(!self.data.audio){
      self.initBackground(() => {
        self.playTask();
      })
    }else{
       self.playTask();
    }
  },
  getBarrage(roomId, soundType, breakpoint) {
    var self = this;
    app.util.getBarrage(roomId,1,breakpoint,function(newBreakpoint,barrages){
      self.setData({
        breakpoint: newBreakpoint
      });
      if (barrages.length != 0){
        if(self.data.readname == 1){
          //不读发言人则合并弹幕
          self.data.buffer = app.util.removeDuplicatedItem(self.data.buffer.concat(barrages));
        }else{
          self.data.buffer = self.data.buffer.concat(barrages);
        }
      }
      if(self.data.isReading){
        setTimeout(function () {
          self.getBarrage(roomId, soundType, self.data.breakpoint);
        }, 1500)
      }
    })
  },
  playTask:function(){
    var self = this;
    console.log(this.data.buffer.length)
    if (this.data.buffer.length != 0){
      var textdata = self.data.buffer.shift();
      
      var readname = this.data.readname;
      if(readname == 1){
        var text = textdata['user'].nickname+'说' + textdata['content'];
      }else{
        var text = textdata['content'];
      }
      app.util.text2audio(text,this.data.openId,(url)=>{
        if(url){
          if(self.data.isReading){
            self.play(url);
          }
        }
      })
    }else{
      if (this.data.isReading){
        setTimeout(self.playTask, 1500);
      }
    }
  },
  initBackground(callback){
    this.data.audio = wx.getBackgroundAudioManager();
    this.data.audio.title = '触手直播助手';
    this.data.audio.epname = this.data.roomId;
    this.data.audio.singer = '房间号'
    this.data.audio.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    // 设置了 src 之后会自动播放
    this.data.audio.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    this.data.audio.onEnded((res) => {
      if (this.data.isReading) {
        console.log('read end')
        this.playTask();
      }
    })
    callback();
  }
  ,
  initAudio(callback){
    this.data.audio = wx.createInnerAudioContext();
    this.data.audio.autoplay = true;
    this.data.audio.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      if (this.data.isReading) {
        this.playTask();
      }
    })
    this.data.audio.onEnded((res) => {
      if(this.data.isReading){
        console.log('read end')
        this.playTask();
      }
    })
    callback();
  },
  play(src){
    console.log('read start')
    this.data.audio.src = src;
  },
  stop(){
    this.data.audio.stop();
  },
  //清空该id下的音频目录
  clear(){
    app.util.clearFiles(this.data.openId);
  }
})