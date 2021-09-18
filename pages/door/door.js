// pages/door/door.js
const app = getApp()
var mqtt = require('../utils/mqtt.min') //根据自己存放的路径修改
var client = null;
Page({
  data: {

  },
  light_Switch: function(e)      //Switch开关触发事件
  {
    if(e.detail.value==false){
    client.publish('/iot/70/pub', 'door0_off')
  }else{client.publish('/iot/70/pub', 'door0_on')}
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
      //订阅一个主题
      client.subscribe('/iot/70/sub', {
        qos: 0
      }, function (err) {
        if (!err) {
           client.publish('/iot/70/pub', 'Hello MQTT')
          console.log("订阅成功")
        }
      })
    })
    },
})