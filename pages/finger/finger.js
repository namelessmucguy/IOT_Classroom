const app = getApp()
var mqtt = require('../utils/mqtt.min') 
var client = null;

Page({
  
  data: {
    // 数据源
    list:[]
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
      client.subscribe('/iot/70/finger', {
        qos: 0
      }, function (err) {
        if (!err) {
           client.publish('/iot/70/pub', 'Hello MQTT')
          console.log("订阅成功")
        }
      })
    })
    client.on('message', function (_topic, message) {
      console.log('received msg:' + message.toString());
      if (message=="1") {
        this.setData({
          ['list[0]']: '电气  吕鑫鹏\t'+ new Date()
        });
        let data = 'list[0]';
        this.setData({
          [data]: '电气  吕鑫鹏\t'+ new Date()
        })
      }
      else if (message=="2") {
        
          this.setData({
            ['list[1]']: '自动化  张溢波\t'+ new Date()
          });
          let data = 'list[1]';
          this.setData({
            [data]: '自动化  张溢波\t'+ new Date()
          })
      }
      else if (message=="3") {
        
        this.setData({
          ['list[2]']: '自动化  郭田\t'+ new Date()
        });
        let data = 'list[2]';
        this.setData({
          [data]: '自动化  郭田\t'+ new Date()
        })
    }
      }.bind(this))
    },
  
})
