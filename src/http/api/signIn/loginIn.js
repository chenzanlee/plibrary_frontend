import request from '@/http/http'

// 查询账户 - 工号
export function queryAccountJon(data) {
  return request('/api/admin/user/account/innerlist', {
    method: 'get',
    params: data
  })
  // jobNo
}

// 查询账户 - 手机号
export function queryAccountPhone(data) {
  return request('/api/admin/user/account/outlist', {
    method: 'get',
    params: data
  })
  // mobilePhoneF
}

// 获取验证码 - 工号
export function getVerificationCode(data) {
  return request('/api/wechat/verificationCode/inner/send', {
    method: 'get',
    params: data
  })
  // jobNo: 200607917
  // cause:
}
// 获取验证码 - 手机号
export function getVerificationCodePhone(data) {
  return request('/api/admin/user/sendVerifyCodeByMobile', {
    method: 'get',
    params: data
  })
  // mobile: phone
}

// 修改密码 - 工号:jobNo     手机号:mobile
export function setResetPassword(data) {
  return request('/api/admin/user/internal/resetpwd', {
    method: 'post',
    data: data
  })
  // jobNo: "200812573"
  // loginName: "yw200812573"
  // newPwd: "123456."
  // verifyCode: "123456"
}

// 二维码登录
export function getWechart(data) {
  return request(`/api/auth/jwt/tokenByWxQrCode`, {
    method: 'get',
    params: data
  })
}
// 二维码获取state
export function buildWxLoginInfo(data) {
  return request('/api/wechat/auth/buildWxLoginInfo', {
    method: 'get',
    params: data
  })
}
