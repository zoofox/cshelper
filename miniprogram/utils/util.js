module.exports = {
  getBarrage(roomId, barrageType, breakpoint,callback){
    var self = this;
    var returnItems = [];
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
                  returnItems.push(self.takeOffContentShell(v));
                }else{
                  returnItems.push(v);
                }
                
              }
            })
          }
        } 
        callback(newBreakpoint, returnItems);
      }
    })
  },
  takeOffContentShell(item){
    if (item.content.indexOf('<![JSON[') == 0 && item.content.indexOf(']]>' > -1)) {
      var contentJson =  JSON.parse(content.slice(8, -3));
      return {
        content: contentJson.content,
        user:item.user
      }
    }else{
      return {
        content: item.content,
        user: item.user
      }
    }
  }
}