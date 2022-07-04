/**
 *
 * @file 存放异步读取/修改state的方法
 * @author author-name(李陈赞）
 */
import jwtDecode from 'jwt-decode'
import {
  loginByUsername,
  refreshToken
} from '@/http/api/plibrary/user-service'
import { setToken, getRefresh, setRefresh, setAuthTime, setExpires, tokenWatch } from '@/views/userManagement/common/auth/authStore'
import { setBytes } from '@/views/userManagement/common/auth/userStore'
export default {
  LoginByUsername({
    commit
  }, userInfo) {
    console.log('登录传入的参数', userInfo)
    const username = userInfo.username.trim()
    return new Promise((resolve, reject) => {
      loginByUsername(username, userInfo.password).then(response => {
        console.log('登录返回的内容', response)

        // commit('SET_TOKEN', response.data.rows[0].token)
        // commit('SET_REFRESHTOKEN', response.data.rows[0].refreshToken)
        //
        // setToken(response.data.rows[0].token)
        // setRefresh(response.data.rows[0].refreshToken)
        //
        // localStorage.setItem('user-token', response.data.rows[0].token)
        //
        // setTokenWatch()
        resolve(response)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  RefreshToken({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      refreshToken(getRefresh()).then(response => {
        // console.log('刷新token的响应', response)
        commit('SET_TOKEN', response.data.rows[0].token)
        commit('SET_REFRESHTOKEN', response.data.rows[0].refreshToken)
        commit('SET_BYTES', jwtDecode(response.data.rows[0].token))
        setToken(response.data.rows[0].token)
        setRefresh(response.data.rows[0].refreshToken)
        setBytes(jwtDecode(response.data.rows[0].token))
        setAuthTime()
        setExpires(`${jwtDecode(response.data.rows[0].token).exp}000`)
        tokenWatch()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

}
