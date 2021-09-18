const app = getApp()
var mqtt = require('../utils/mqtt.min') 
var client = null;
var timer;
Page({
  data: {
        select: false,
        tihuoWay: '教室▼',
        msg:"掉线"
  },
  onLoad: function (_options) {
    this.connectMqtt()
  },
  onUnload: function (_options) {
    client.end()
  },
  connectMqtt: function () {
    const options = {
      connectTimeout: 4000, // 超时时间
      clientId: 'esp',
      port: 8084, 
      username: '25ecb5c1008729a137b06f8c571488e5',
      password: '741',
    }

    client = mqtt.connect('wxs://t.yoyolife.fun/mqtt', options)
     client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })

    client.on('error', (error) => {
      console.log('连接失败:', error)
    })

    client.on('connect', (_e) => {
      console.log('成功连接服务器')
      //订阅主题
      client.subscribe('/iot/70/esp', {
        qos: 0
      }, function (err) {
        if (!err) {
           client.publish('/iot/70/pub', 'Hello ES8266')
          console.log("订阅成功")
        }
      }
      )
    })
     client.on('message', function (_topic, message) {
        console.log('received msg:' + message.toString());
        if (message=='hello') {
          this.setData({
            msg:'上线'
            })
        }
        }.bind(this))
    },
 
    pub0:function(){
      if(this.data.show){
          this.setData({
              show:false
          })
          client.publish('/iot/70/pub', 'power_off')
      }
      else{
          this.setData({
              show:true
          })
          client.publish('/iot/70/pub', 'power_on')
      }
  },
cilck1:function(){
     wx.navigateTo({
       url: '/pages/light/light',
     })
},
cilck2:function(){
  wx.navigateTo({
    url: '/pages/window/window',
  })
},
cilck3:function(){
  wx.navigateTo({
    url: '/pages/door/door',
  })
},
bindShowMsg() {
     this.setData({
         select:!this.data.select
     })
},
mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
        tihuoWay: name,
        select: false
    })
}
})
var interval = setInterval(function () {  
  client.publish('/iot/70/pub', 'Hello MQTT')
}, 10000) //ms
