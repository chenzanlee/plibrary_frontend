
// 获取场区设备故障统计数据
export function derive(baseUrl) {
  let url = baseUrl
  url += 'token=' + localStorage.getItem('MY-Admin-Token')
  // eslint-disable-next-line no-undef
  newWindow = window.open(window.location.host + url, 'left=0,meunbar=no,toolbar=no,scrollbar=yes,status=yes')
  // newWindow=window.open('http://localhost:8080')
  setTimeout(function() {
    // newWindow.close();
  }, 2000)
}
