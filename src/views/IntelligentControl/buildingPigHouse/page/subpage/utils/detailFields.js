export const initData = (that) => {
  that.unitInfo = {
    pigType: '-',
    data: [
      {
        number: '-',
        key: 'pigDays',
        name: '日龄',
        position: 'left',
        company: '天',
        status: true
      }, {
        number: '-',
        name: '母猪胎次',
        key: 'batchNo',
        position: 'left',
        company: '',
        status: false
      },
      {
        number: '-',
        name: '装猪数量',
        position: 'top',
        key: 'pigCount',
        company: '头',
        status: true
      },
      {
        number: '-',
        name: '单猪体重',
        key: 'weight',
        position: 'right',
        company: 'kg',
        status: true
      },
      {
        number: '-',
        name: '饲养员',
        position: 'right',
        company: '',
        status: true
      },
      {
        number: '-',
        name: '工号',
        position: 'right',
        company: '',
        status: true
      }
    ]
  }
}
export const initEqumentData = (that) => {
  that.equipmentList = [
    {
      position: '室内前',
      temperature: '-',
      temperatureDiffer: '-',
      humidity: '-',
      humidityDiffer: '-',
      type: '1',
      sensing: '',
      signal: '0',
      voltage: '0'
    },
    {
      position: '室内中',
      temperature: '-',
      temperatureDiffer: '-',
      humidity: '-',
      humidityDiffer: '-',
      type: '1',
      sensing: '',
      signal: '0',
      voltage: '0'
    },
    {
      position: '室内后',
      temperature: '-',
      temperatureDiffer: '-',
      humidity: '-',
      humidityDiffer: '-',
      type: '2',
      sensing: '',
      signal: '0',
      voltage: '0'
    },
    {
      position: '其他',
      temperature: '-',
      temperatureDiffer: null,
      humidity: '-',
      humidityDiffer: null,
      type: '5'
    }
  ]
}
