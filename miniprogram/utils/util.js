module.exports = {
  getBarrage(roomId, barrageType,filter, breakpoint,callback){
    var self = this;
    var returnItems = [];
    // console.log('--------------->>>')
    wx.request({
      url: 'https://chat.chushou.tv/chat/get.htm?roomId=' + roomId + '&breakpoint=' + breakpoint,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var result = res.data;
        var newBreakpoint = '';
        if (result.code == 0) {
          var items = result.data.items;
          newBreakpoint = result.data.breakpoint;
          if (items.length != 0) {
            items.forEach(function (v, k) {
              if (v.type == barrageType) {
                if(barrageType == 1){
                  var item = self.takeOffContentShell(v);
                  if (filter && filter.dropNum == 1){
                    if(!item.isNum){
                      returnItems.push(item);
                    }
                  }else{
                    returnItems.push(item);
                  }
                }else{
                  returnItems.push(v);
                }
              }
            })
          }
        } 
        callback(newBreakpoint, returnItems);
      },
      fail(res){
        console.log('fail')
        callback(breakpoint, []);
      }
    })
  },
  takeOffContentShell(item){
    if (item.content.indexOf('<![JSON[') == 0 && item.content.indexOf(']]>' > -1)) {
      var contentJson =  JSON.parse(content.slice(8, -3));
      var content = this.emojiHandler(contentJson.content);
      var isNum = isNaN(content)?0:1;
      return {
        content: content,
        user:item.user,
        isNum: isNum
      }
    }else{
      var content = this.emojiHandler(item.content);
      var isNum = isNaN(content) ? 0 : 1;
      return {
        content: content,
        user: item.user,
        isNum: isNum
      }
    }
  },
  emojiHandler(text){
    return text.replace('1_', '').replace('2_', '');
  }
  ,
  text2audio(text,id,callback){
    var date = Date.now()+'';
    var rnd = Math.floor(Math.random()*10000);
    var name = date+rnd;
    var mp3url = 'https://niyh.cn/mp3/'+id+'/'+ name+'.mp3';
    wx.request({
      url: 'https://niyh.cn/kdxf/text2audio?name=' + name+'&text='+text+'&id='+id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
       if(res.data.code == 0){
         callback(mp3url)
       }else{
         callback(null)
       }
      }
    })
  },
  //清空文件夹
  clearFiles(id){
    wx.request({
      url: 'https://niyh.cn/kdxf/clearfiles?id=' + id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
      
      }
    })
  },
  //数组去重
  removeDuplicatedItem(arr){
    var contentarr = [];
    var newarr = [];
    var contentarr = arr.map(function (item) {
      return item['content'];
    });
    var r = contentarr.filter(function (element, index, self) {
      if (self.indexOf(element) === index){
        newarr.push(arr[index]);
        return true;
      }else{
        return false;
      }
    });
    return newarr;
  },
  initCenter(){
    wx.setStorage({
      key: 'center',
      data: {
        read:0
      }
    })
  },
  //center数据控制全局状态
  changeCenter(key,val){
    var center = wx.getStorageSync('center');
    center[key] = val;
    wx.setStorage({
      key: 'center',
      data: center
    })
  }
}