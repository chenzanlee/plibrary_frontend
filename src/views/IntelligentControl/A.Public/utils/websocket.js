// import SockJS from 'sockjs-client'
// import Stomp from 'stompjs'
// function createWebSocket(deviceId, callback, getStompClient) {
//   let stompClient = null
//   const token = localStorage.getItem('MY-Admin-Token') // 'http://dev.imuyuan.com/unit_evc_ws'
//   const socket = new SockJS('https://10.106.11.37/unit_evc_ws', null, {
//     'protocols_whitelist': ['websocket']
//   })
//   stompClient = Stomp.over(socket)
//   getStompClient(stompClient)
//   stompClient.connect({ 'token': token }, function(frame) {
//     console.log('Connected: ' + frame)
//     stompClient.subscribe('https://10.106.11.37/unit_evc/' + deviceId.trim(), function(response) {
//       console.log('解析的web', response)
//       callback(JSON.parse(response.body))
//       // showGreeting(JSON.parse(response.body).content);
//     })
//   })
// }

// function closeWebSocket(stompClient) {
//   console.log(stompClient + ':  ' + stompClient)
//   if (stompClient != null) {
//     stompClient.disconnect()
//   }
//   console.log('Disconnected')
// }
// export {
//   createWebSocket,
//   closeWebSocket
// }
