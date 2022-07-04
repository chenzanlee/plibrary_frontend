export const getPageData = (that) => {
  return {
    selectedOption: [], // '2', '15417450', '15418291'
    // selectedOption: [],
    waterpressSensorPressure1: null,
    waterpressSensorPressure2: null,
    fandialogVisible: false,
    activeItem: 'total',
    allModalParams: ['前温湿度', '后温湿度', '0级开度', '1级风速', '2级风速', '4级风速', '4级开度'],
    showParams: ['前温湿度', '后温湿度', '0级开度', '1级风速', '2级风速', '4级风速', '4级开度'], // 默认展示的参数
    modalParams: [], // 模态框中选中展示的参数
    roofData: {
      main: {},
      roofA1SubGroupStatus: {},
      roofA2SubGroupStatus: {},
      roofA3SubGroupStatus: {},
      roofA4SubGroupStatus: {},
      roofA5SubGroupStatus: {},
      roofA6SubGroupStatus: {},
      roofA7SubGroupStatus: {},
      roofB1SubGroupStatus: {},
      roofB2SubGroupStatus: {},
      roofB3SubGroupStatus: {},
      roofB4SubGroupStatus: {},
      roofB5SubGroupStatus: {},
      roofB6SubGroupStatus: {},
      roofB7SubGroupStatus: {}
    },
    selectedLabel: [],
    segmentChecked: [],
    duration_water: null,
    isMulti: false,
    SFModal: false, // 楼房猪舍类型弹框显示与隐藏
    custom: false, // 单元数据设置的modal
    memoryParam: {}, // 上次记录的操作参数
    visible_main_duration: false, // 主控制器补水设置弹窗
    visible_main_date: false, // 主控器器开启关闭时间控制
    roofChecked: [], // 接口返回场区楼顶状态数据
    visible_main_pop_water: false,
    loaded: true,
    duration: undefined,
    openTime: null, // 开启时间
    closeTime: null, // 关闭时间
    reportTime: null,
    loadingModelVisible: false,
    pressure: null, // 主控制器上次上报的实际压差
    destPressure: null, // 目标压差
    activeDev: null,
    isCheckedBacTemp: false, // 是否选中后温度补偿
    isCheckedFroTemp: false, // 是否选中前温度补偿
    isCheckedLevel0: false, // 是否选中0级开度
    isCheckedLevel4: false, // 是否选中4级开度
    isCheckedLevelHotExchange: false, // 是否选中热交换开度
    levelHotExchange: undefined, // 热交换开度
    checkAll: false, // 选中所有可选指令
    checkedInstructSegment: [], // 指令下发选中的工段
    backTemp: undefined, // 后温度补尝
    frontTemp: undefined, // 前温度补偿
    level0: undefined, // 0级开度
    level4: undefined, // 4级开度
    destPressureModalVisible: false,
    unit_duration: undefined,
    instructModalVisible: false,
    prg: 0,
    floorMap: {
      'FLOOR_ONE': '1楼',
      'FLOOR_TWO': '2楼',
      'FLOOR_THREE': '3楼',
      'FLOOR_FOUR': '4楼',
      'FLOOR_FIVE': '5楼',
      'FLOOR_SIX': '6楼',
      'FLOOR_SEVEN': '7楼',
      'FLOOR_EIGHT': '8楼'
    },
    destPressure2: 0,
    subDestPressure: '',
    titleMap: {
      'roofA1SubGroupStatus': 'A1',
      'roofA2SubGroupStatus': 'A2',
      'roofA3SubGroupStatus': 'A3',
      'roofA4SubGroupStatus': 'A4',
      'roofA5SubGroupStatus': 'A5',
      'roofA6SubGroupStatus': 'A6',
      'roofA7SubGroupStatus': 'A7',
      'roofB1SubGroupStatus': 'B1',
      'roofB2SubGroupStatus': 'B2',
      'roofB3SubGroupStatus': 'B3',
      'roofB4SubGroupStatus': 'B4',
      'roofB5SubGroupStatus': 'B5',
      'roofB6SubGroupStatus': 'B6',
      'roofB7SubGroupStatus': 'B7'
    },
    subPressureModalVisible: null,
    houseItem: null,
    checkedObj: {}, // a/b座选中的指令
    allSegment: [], // 所有可选的工段
    allFloor: [], // 所有可选的楼层
    enableSegment: [], // 可操作的工段
    enableFloor: [], // 可操作的楼层
    chooseSegment: [], // 已选的工段
    chooseFloor: [], // 已选的楼层
    chooseTempSegment: [], // 暂存已选的工段
    chooseTempFloor: [], // 暂存已选的楼层
    visible_duration: null,
    enable_open: null, // 补水开关 1开启, 0关闭
    pop_enable_open: null, // 排水开关 1开启, 0关闭
    pop_openTime: null, //  排水开启时间
    pop_closeTime: null, //  排水关闭时间
    roofMultiOpen: false, // 楼顶批量开
    roofMultiClose: false, // 楼顶批量关
    deviceData: {},
    water_block: null, // 补水楼栋
    activeTab: 'RoofPlan',
    topBtns: [{
      text: '楼顶平面',
      type: 'RoofPlan'
    },
    {
      text: 'A座',
      type: 'BLOCK_A'
    },
    {
      text: 'B座',
      type: 'BLOCK_B'
    }
    ],
    defaultValue: [],
    navFormInfo: {
      data: {
        cascader: []
      },
      fieldList: {
        left: {
          inpLists: [{
            key: 'cascader',
            type: 'slot',
            className: 'shadow',
            placeholder: '大区 / 区域 / 场区',
            width: '300px',
            customLabel: 'title',
            customValue: '',
            options: []
          }]
        }
      }
    },
    blockFormInfo: {
      data: {},
      fieldList: {}
    }
  }
}
