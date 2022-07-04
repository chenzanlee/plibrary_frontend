// eslint-disable-next-line no-unused-vars
class RulesService {
  inputErrorTip = '不能为空'
  inputLimitTip = (a, b) => {
    return `取值范围在${a}-${b}之间`
  }
  submitErrorTip = '参数错误，请根据提示输入正确参数'
  addressErrorTip = 'MAC地址不正确!'
  rulesNull = [
    {
      validator: (rule, value, callback) => {
        if (value === undefined || value === null || value === '') {
          callback(this.inputErrorTip)
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  ]

  rulesLimit = (a, b) => {
    return [
      {
        validator: (rule, value, callback) => {
          if (value === undefined || value === null || value === '') {
            callback(this.inputErrorTip)
          } else if (value < a || value > b) {
            callback(this.inputLimitTip(a, b))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change']
      }
    ]
  }

  rulesArrayNull = [
    {
      validator: (rule, v, callback) => {
        const value = v[0].percent
        if (value === undefined || value === null || value === '') {
          callback(this.inputErrorTip)
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  ]

  rulesArrayLimit = (a, b) => {
    return [
      {
        validator: (rule, v, callback) => {
          const value = v[0].percent
          if (value === undefined || value === null || value === '') {
            callback(this.inputErrorTip)
          } else if (value < a || value > b) {
            callback(this.inputLimitTip(a, b))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change']
      }
    ]
  }

  rulesMacAddress = [
    {
      validator: (rule, v, callback) => {
        const value = v.mac
        if (value) {
          if (this.macAdress(value)) {
            callback()
          } else {
            callback(this.addressErrorTip)
          }
        } else if (value === undefined || value === null || value === '') {
          callback(this.inputErrorTip)
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  ]

  rulesGreater = []

  limit_10_60 = { rules: this.rulesLimit(10, 60) }
  limit_1_10 = { rules: this.rulesLimit(1, 10) }
  limit_5_100 = { rules: this.rulesLimit(5, 100) }

  limit_0_90 = { rules: this.rulesLimit(0, 90) }
  limit_0_60 = { rules: this.rulesLimit(0, 60) }
  limit_0_600 = { rules: this.rulesLimit(0, 600) }
  limit_1_600 = { rules: this.rulesLimit(1, 600) }

  limit__40_60 = { rules: this.rulesLimit(-40, 60) }
  limit_75_95 = { rules: this.rulesLimit(75, 95) }
  limit_0_5 = { rules: this.rulesLimit(0, 5) }
  limit_20_30 = { rules: this.rulesLimit(20, 30) }
  limit_55_80 = { rules: this.rulesLimit(55, 80) }

  limit_0_1800 = { rules: this.rulesLimit(0, 1800) }
  limit_0_800 = { rules: this.rulesLimit(0, 800) }
  limit_0_300 = { rules: this.rulesLimit(0, 300) }

  limit_0_100 = { rules: this.rulesLimit(0, 100) }
  limit_10_3600 = { rules: this.rulesLimit(10, 3600) }

  limit_0_100_arr = { rules: this.rulesArrayLimit(0, 100) }

  limit_mac_address = { rules: this.rulesMacAddress }

  // 设备控制
  limit_0_65535 = { rules: this.rulesLimit(0, 65535) }
  limit_5_65535 = { rules: this.rulesLimit(5, 65535) }
  limit_0_50 = { rules: this.rulesLimit(0, 50) }
  limit_0_100000 = { rules: this.rulesLimit(0, 100000) }
  // limit_0_100 = { min: 0, max: 100, rules: this.rulesLimit(10, 60) }
  limit_0_3600 = { rules: this.rulesLimit(0, 3600) }
  limit_10_30 = { rules: this.rulesLimit(10, 30) }
  limit_20_35 = { rules: this.rulesLimit(20, 35) }
  macAdress(address) {
    var temp = /[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/
    return temp.test(address)
  }

  verNull() {
    const newRules = this.rulesNull.slice(0)
    console.log(newRules)
    return newRules
  }
  verGreaterThan = (arr, t, tips, that, k1, k2, k3) => {
    const min = arr[0]
    const max = arr[1]
    const json = {
      rules: []
    }
    json.rules = [
      {
        validator: (rule, v, callback) => {
          const v2 = that[k1][k2][k3]
          // console.log('验证的信息', v, v2)
          if (t === '<') {
            if (v === undefined || v === null) {
              callback(rulesService.inputErrorTip)
            } else if (v < min || v > max) {
              callback(this.inputLimitTip(min, max))
            } else if (v) {
              if (v < v2) { callback() } else { callback(tips) }
            } else { callback() }
          } else if (t === '>') {
            if (v === undefined || v === null) {
              callback(rulesService.inputErrorTip)
            } else if (v < min || v > max) {
              callback(this.inputLimitTip(min, max))
            } else if (v) {
              if (v > v2) { callback() } else { callback(tips) }
            } else { callback() }
          }
        },
        trigger: ['blur', 'change']
      }
    ]
    return json
  }
  verLessThan() {
    console.log()
  }
  limit(d, l, type, target) {
    console.log(111, target)
    const c = Object.assign({}, d, this.limit_10_60)

    console.log(c)
    return c
  }
}

// eslint-disable-next-line new-cap
const rulesService = new RulesService()
export default rulesService
