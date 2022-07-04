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

  limit_10_60 = { min: 10, max: 60, rules: this.rulesNull }
  limit_1_10 = { min: 1, max: 10, rules: this.rulesNull }
  limit_5_100 = { min: 5, max: 100, rules: this.rulesNull }

  limit_0_90 = { min: 0, max: 90, rules: this.rulesNull }
  limit_0_60 = { min: 0, max: 60, rules: this.rulesNull }
  limit_0_600 = { min: 0, max: 600, rules: this.rulesNull }
  limit_1_600 = { min: 1, max: 600, rules: this.rulesNull }

  limit__40_60 = { min: -40, max: 60, rules: this.rulesNull }
  limit_0_5 = { min: 0, max: 5, rules: this.rulesNull }

  limit_0_1800 = { min: 0, max: 1800, rules: this.rulesNull }
  limit_0_800 = { min: 0, max: 800, rules: this.rulesNull }
  limit_0_300 = { min: 0, max: 300, rules: this.rulesNull }

  limit_0_100 = { min: 0, max: 100, rules: this.rulesNull }
  limit_10_3600 = { min: 10, max: 3600, rules: this.rulesNull }

  limit_0_100_arr = { min: 0, max: 100, rules: this.rulesArrayNull }

  limit_mac_address = { rules: this.rulesMacAddress }

  // 设备控制
  limit_0_65535 = { min: 0, max: 65535, rules: this.rulesNull }
  limit_5_65535 = { min: 5, max: 65535, rules: this.rulesNull }
  limit_0_50 = { min: 0, max: 50, rules: this.rulesNull }
  limit_0_100000 = { min: 0, max: 100000, rules: this.rulesNull }
  // limit_0_100 = { min: 0, max: 100, rules: this.rulesNull }
  limit_0_3600 = { min: 0, max: 3600, rules: this.rulesNull }
  limit_0_no = { min: 0, rules: this.rulesNull }

  // 参数设置
  limit_0_1000000 = { min: 0, max: 1000000, rules: this.rulesNull }
  limit_0_50 = { min: 0, max: 50, rules: this.rulesNull }
  limit_10_1000000 = { min: 10, max: 1000000, rules: this.rulesNull }
  limit_10_60 = { min: 10, max: 60, rules: this.rulesNull }
  limit_3_120 = { min: 3, max: 120, rules: this.rulesNull }
  limit_5_100 = { min: 5, max: 100, rules: this.rulesNull }
  limit_0_800 = { min: 0, max: 800, rules: this.rulesNull }
  limit_0_no = { min: 0, rules: this.rulesNull } // 装猪数量 不做上限控制 max: 800,
  limit_0_300 = { min: 0, max: 300, rules: this.rulesNull }
  limit__2_2 = { min: -2, max: 2, rules: this.rulesNull }
  limit__5_5 = { min: -5, max: 5, rules: this.rulesNull }
  limit__45_90 = { min: 45, max: 90, rules: this.rulesNull }
  limit__30_90 = { min: 30, max: 90, rules: this.rulesNull }
  limit_10_90 = { min: 10, max: 90, rules: this.rulesNull }
  limit_50_80 = { min: 50, max: 80, rules: this.rulesNull }
  limit_60_1200 = { min: 60, max: 1200, rules: this.rulesNull }
  limit_5_60 = { min: 5, max: 60, rules: this.rulesNull }

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
    const json = {
      min: arr[0],
      max: arr[1],
      rules: []
    }
    json.rules = [
      {
        validator: (rule, v, callback) => {
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
