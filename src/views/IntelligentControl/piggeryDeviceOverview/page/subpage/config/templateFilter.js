const getFilterTemplate = (arr, segmentId) => {
  console.log(arr)
  if (arr.length < 1 || !segmentId) {
    return arr
  } else {
    let temps = []
    switch (segmentId) {
      case '13906': temps = [...arr.filter((item) => { // 保育
        return item.styType === 'RoomType001' || item.styType === 'RoomType008'
      })]
        break
      case '13907': temps = [...arr.filter((item) => { // 育肥
        return item.styType === 'RoomType002'
      })]
        break
      case '29535': temps = [...arr.filter((item) => { // 待配
        return item.styType === 'RoomType003'
      })]
        break
      case '13909': temps = [...arr.filter((item) => { // 怀孕
        return item.styType === 'RoomType004'
      })]
        break
      case '13905': temps = [...arr.filter((item) => { // 哺乳
        return item.styType === 'RoomType005'
      })]
        break
      case '13911': temps = [...arr.filter((item) => { // 公猪
        return item.styType === 'RoomType006'
      })]
        break
      case '13908': temps = [...arr.filter((item) => { // 后备
        return item.styType === 'RoomType007'
      })]
        break
      default: break
    }
    return temps
  }
}
export default getFilterTemplate
