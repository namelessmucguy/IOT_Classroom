// pages/index1/index1.js
const app = getApp()
var mqtt = require('../utils/mqtt.min') //根据自己存放的路径修改
var client = null;
Page({
  data: {
      wen:"",
      shi:"",
      oc:"°C",
      ming:"空调",
      tem:27
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
      client.subscribe('/iot/70/tem', {
        qos: 0
      }, function (err) {
        if (!err) {
           client.publish('/iot/70/pub', 'Hello MQTT')
          console.log("订阅成功")
        }
      })

      client.subscribe('/iot/70/shi', {
        qos: 0
      })

    })
    client.on('message', function (_topic, message) {
      if (String.fromCharCode(message[0]=="w")) {
        this.setData({
          wen:String.fromCharCode(message[1])+String.fromCharCode(message[2])+String.fromCharCode(message[3])+String.fromCharCode(message[4])+String.fromCharCode(message[5])+"°C"
          })
      }
      if (String.fromCharCode(message[6]=="s")) {
        this.setData({
          shi:String.fromCharCode(message[7])+String.fromCharCode(message[8])+String.fromCharCode(message[9])+String.fromCharCode(message[10])+String.fromCharCode(message[11])+"%"
          })
      }
      }.bind(this))
    },
    air:function(){
      if(this.data.show){
          this.setData({
              show:false
          })
          client.publish('/iot/70/pub', 'air_on')
      }
      else{
          this.setData({
              show:true
          })
          client.publish('/iot/70/pub', 'air_off')
      }
  },
    temp_up:function(){
      this.data.tem ++
      this.setData({
        tem: this.data.tem
      })
        client.publish('/iot/70/pub', 'temp_up')
  },
  temp_down:function(){
    this.data.tem --
    this.setData({
      tem: this.data.tem
    })
   client.publish('/iot/70/pub', 'temp_down')
},
})