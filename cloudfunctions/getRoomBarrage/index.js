var rp = require('request-promise');
exports.main = (event, context) => {
  var res = rp('https://chat.chushou.tv/chat/get.htm?roomId=' + event.roomId + '&breakpoint=' + event.breakpoint)
  .then(result=>{
    console.log(result);
    return result;
  }).catch(e=>{
    console.log(e)
    return e;
  })
  return res;
}