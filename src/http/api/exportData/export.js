// 数据导出
export function derive(baseUrl, data) {
  let url = baseUrl + '?'
  for (const name in data) {
    url += name + '=' + data[name] + '&'
  }
  url += 'token=' + localStorage.getItem('TOKEN')
  let aDom = document.createElement('a')
  aDom.setAttribute('download', url)
  aDom.setAttribute('href', url)
  aDom.click()
  aDom = null // 改成在当前页下载
  // window.open(url, 'left=0,meunbar=no,toolbar=no,scrollbar=yes,status=yes')
}

export function deriveOpenNewWindow(baseUrl, data) {
  let url = baseUrl + '?'
  for (const name in data) {
    url += name + '=' + data[name] + '&'
  }
  url += 'token=' + localStorage.getItem('TOKEN')
  // let aDom = document.createElement('a')
  // aDom.setAttribute('download', url)
  // aDom.setAttribute('href', url)
  // aDom.click()
  // aDom = null // 改成在当前页下载
  window.open(url, 'left=0,meunbar=no,toolbar=no,scrollbar=yes,status=yes')
}

export function deriveV(baseUrl) {
  const url = baseUrl
  let aDom = document.createElement('a')
  aDom.setAttribute('download', url)
  aDom.setAttribute('href', url)
  aDom.click()
  aDom = null // 改成在当前页下载
  // window.open(url, 'left=0,meunbar=no,toolbar=no,scrollbar=yes,status=yes')
}

// import request from '@/http/http'
import axios from 'axios'
// import Vue from 'vue'

// 请求下载 有return信息的
function downloadAjax(url, data, method = 'get') {
  const axiosConfig = {
    method: method,
    url,
    time: 100000,
    responseType: 'arraybuffer',
    responseEncoding: 'utf8'
  }
  if (method.toLocaleLowerCase() === 'post') {
    axiosConfig.data = data
    axiosConfig.headers = {
      'Authorization': localStorage.getItem('TOKEN')
    }
  } else {
    data.token = localStorage.getItem('TOKEN')
    axiosConfig.params = data
  }
  // for (const name in data) {
  //   url += name + '=' + data[name] + '&'
  // }
  return axios(axiosConfig)
}

// 处理下载
export function downloadBlob(url, data, method) {
  return downloadAjax(url, data, method).then((res) => {
    // console.dir(res.headers['content-disposition']) // 这里可以处理出文件名字
    // 获取heads中的filename文件名
    const temp = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
    const name = decodeURIComponent(temp)
    if (res && res.status === 200) { //  && res.statusText === 'OK'这个据后台说未设置，所以暂不判断
      saveFile(res.data, name)
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  })
}

function saveFile(data, fileName) {
  const file = new Blob([data], { type: 'application/vnd.ms-excel' })
  const url = window.URL || window.webkitURL
  const fileURL = url.createObjectURL(file)
  const a = document.createElement('a')
  a.href = fileURL
  a.download = fileName
  a.target = '_self'
  a.click()
  url.revokeObjectURL(fileURL)
}
