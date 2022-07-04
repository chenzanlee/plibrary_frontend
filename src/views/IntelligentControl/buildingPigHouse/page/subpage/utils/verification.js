// eslint-disable-next-line no-unused-vars
class RulesService {
  inputErrorTip = '不能为空'
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

  rulesMacAddress = [
    {
      validator: (rule, v, callback) => {
        // const value = v.mac
        const value = v
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

  // limit_10_60 = { min: 10, max: 60, rules: this.rulesNull }
  // 设备控制

  // 参数设置
  limit__40_60 = { min: -40, max: 60, rules: this.rulesNull }
  limit_0_1800 = { min: 0, max: 1800, rules: this.rulesNull }
  limit_0_600 = { min: 0, max: 600, rules: this.rulesNull }
  limit_0_800 = { min: 0, max: 800, rules: this.rulesNull }
  limit_0_100 = { min: 0, max: 100, rules: this.rulesNull }
  limit_0_300 = { min: 0, max: 300, rules: this.rulesNull }
  limit_10_3600 = { min: 10, max: 3600, rules: this.rulesNull }
  limit_0_65535 = { min: 0, max: 65535, rules: this.rulesNull }
  limit_0_60 = { min: 0, max: 60, rules: this.rulesNull }
  limit_0_120 = { min: 0, max: 120, rules: this.rulesNull }
  limit_30_1000000 = { min: 30, max: 1000000, rules: this.rulesNull }
  limit_360_1000000 = { min: 360, max: 1000000, rules: this.rulesNull }
  limit_15_30 = { min: 15, max: 30, rules: this.rulesNull }
  limit_20_35 = { min: 20, max: 35, rules: this.rulesNull }
  limit_25_40 = { min: 25, max: 40, rules: this.rulesNull }
  limit_0_5 = { min: 0, max: 5, rules: this.rulesNull }
  limit_20_50 = { min: 20, max: 50, rules: this.rulesNull }
  limit_5_ = { min: 5, rules: this.rulesNull }
  limit_20_ = { min: 20, rules: this.rulesNull }
  limit_0_ = { min: 0, rules: this.rulesNull }

  limit_mac_address = { rules: this.rulesMacAddress }

  macAdress(address) {
    var temp = /[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/
    return temp.test(address)
  }
  limitControl(min, max) {
    return { min: min, max, rules: this.rulesNull }
  }
  verNull() {
    const newRules = this.rulesNull.slice(0)
    console.log(newRules)
    return newRules
  }
  verGreaterThan = (arr, t, tips, that, k1, k2, k3) => {
    const json = {
      min: arr[0],
      max: arr[1],
      rules: []
    }
    json.rules = [
      {
        validator: (rule, v, callback) => {
          if (!that[k1]) {
            callback()
          }
          const v2 = that[k1][k2][k3]
          if (t === '<') {
            if (v) {
              if (v < v2) { callback() } else { callback(tips) }
            } else if (v === undefined || v === null) {
              callback(rulesService.inputErrorTip)
            } else { callback() }
          } else if (t === '>') {
            if (v) {
              if (v > v2) { callback() } else { callback(tips) }
            } else if (v === undefined || v === null) {
              callback(rulesService.inputErrorTip)
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
