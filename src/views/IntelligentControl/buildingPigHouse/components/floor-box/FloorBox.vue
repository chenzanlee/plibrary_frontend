<template>
  <div class="floor-box-container">
    <div v-if="position==='top'" class="floor-box-wrap">
      <div class="title-box">
        <span class="check-box">
          {{ titleTop + dev_status }}
        </span></div>
      <div class="content-box">
        <section class="part drain-water">
          <div class="insert">
            <!-- background-image: linear-gradient(225deg, #49F480 0%, #32A958 100%); -->
            <span :class="[data &&data.drainageWaterStatus == 1 ? 'online' : 'offline', 'little-circle']" />
            <span>
              <img
                :src="data && data.drainageWaterStatus == 1 ? kaiguan : offKaiguan"
                class="cur"
                @click="operateModal({
                  visible_duration: true,
                  title: `${data && data.drainageWaterStatus === 1 ? '关闭' : '开启'}${titleTop}排水`,
                  deviceIndex: 1,
                  open: data && data.drainageWaterStatus === 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'DrainageWater'
                })"
              ></span>
            <span
              class="cur pai-water-icon icon-common-sty"
              @click="operateModal({
                visible_date: true,
                title: `${titleTop}排水开启时间/关闭时间设置`,
              },()=>{
                const entrys = data && data.drainageWaterConfig && data.drainageWaterConfig.entrys.length > 0 ? data.drainageWaterConfig.entrys : [];
                setState({
                  openTime: entrys.length > 0 ? entrys[0].openTime : null,//开始时间
                  closeTime: entrys.length > 0 ? entrys[0].closeTime : null,//结束时间
                })
              })"
            >
              <svg-icon
                icon-class="paishui"
              />
            </span>
          </div>
        </section>
        <section class="part">
          <div v-if="hasFan" class="fengji">
            <div class="insert">
              <!-- style="background-image: linear-gradient(225deg, #AAAAAA 0%, #6D6D6D 100%);" -->
              <span
                :class="[showStyle(data.fanGroupOneFault, data.fanGroupOneStatus), 'box','cur',showStatus(data, 'fanGroupOneStatus')]"
                @click="handleClick(titleTop, 'fanGroupOneStatus', {
                  title: `${data.fanGroupOneStatus == 1 ? '关闭' : '开启'}风机${titleTop}-1`,
                  visible_duration: true,
                  deviceIndex: 1,
                  open: data.fanGroupOneStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Fan'
                })"
              >
                1 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'fanGroupOneStatus', roofChecked) ? '' : 'hide']" />
              </span>
              <span
                :class="[showStyle(data.fanGroupTwoFault, data.fanGroupTwoStatus), 'box', 'cur',showStatus(data, 'fanGroupTwoStatus')]"
                @click="handleClick(titleTop, 'fanGroupTwoStatus', {
                  title: `${data.fanGroupTwoStatus == 1 ? '关闭' : '开启'}风机${titleTop}-2`,
                  visible_duration: true,
                  deviceIndex: 2,
                  open: data.fanGroupTwoStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Fan'
                })"
              >
                2 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'fanGroupTwoStatus', roofChecked) ? '' : 'hide']" />
              </span>
              <span
                :class="[showStyle(data.fanGroupThreeFault, data.fanGroupThreeStatus), 'box','cur', showStatus(data, 'fanGroupThreeStatus')]"
                @click="handleClick(titleTop, 'fanGroupThreeStatus', {
                  title: `${data.fanGroupThreeStatus == 1 ? '关闭' : '开启'}风机${titleTop}-3`,
                  visible_duration: true,
                  deviceIndex: 3,
                  open: data.fanGroupThreeStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Fan'
                })"
              >3 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'fanGroupThreeStatus', roofChecked) ? '' : 'hide']" /> </span>
            </div>
            <div class="insert bot-wrap">
              <span
                :class="[showStyle(data.fanGroupFourFault, data.fanGroupFourStatus), 'box','cur', showStatus(data, 'fanGroupFourStatus')]"
                @click="handleClick(titleTop, 'fanGroupFourStatus', {
                  title: `${data.fanGroupFourStatus == 1 ? '关闭' : '开启'}风机${titleTop}-4`,
                  visible_duration: true,
                  deviceIndex: 4,
                  open: data.fanGroupFourStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Fan'
                })"
              >4
                <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'fanGroupFourStatus', roofChecked) ? '' : 'hide']" /> </span>
              <span
                :class="[showStyle(data.fanGroupFiveFault, data.fanGroupFiveStatus), 'box','cur', showStatus(data, 'fanGroupFiveStatus')]"
                @click="handleClick(titleTop, 'fanGroupFiveStatus', {
                  title: `${data.fanGroupFiveStatus == 1 ? '关闭' : '开启'}风机${titleTop}-5`,
                  visible_duration: true,
                  deviceIndex: 5,
                  open: data.fanGroupFiveStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Fan'
                })"
              >5
                <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'fanGroupFiveStatus', roofChecked) ? '' : 'hide']" /> </span>
              <span
                :class="[showStyle(data.fanGroupSixFault, data.fanGroupSixStatus), 'box','cur', showStatus(data, 'fanGroupSixStatus')]"
                @click="handleClick(titleTop, 'fanGroupSixStatus', {
                  title: `${data.fanGroupSixStatus == 1 ? '关闭' : '开启'}风机${titleTop}-6`,
                  visible_duration: true,
                  deviceIndex: 6,
                  open: data.fanGroupSixStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Fan'
                })"
              >6
                <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'fanGroupSixStatus', roofChecked) ? '' : 'hide']" /> </span>
            </div>
          </div>
          <div v-if="!hasFan" class="no-data" style="height: 78px;">暂无数据</div>
        </section>
        <section class="part">
          <div v-if="hasFan" class="group2">
            <div class="insert">
              <span
                :class="[showStyle(data.deodorantPumpOneFault, data.deodorantPumpOneStatus), 'box','cur',showStatus(data, 'deodorantPumpOneStatus')]"
                @click="handleClick(titleTop, 'deodorantPumpOneStatus', {
                  title: `${data.deodorantPumpOneStatus == 1 ? '关闭' : '开启'}除臭泵${titleTop}-1`,
                  visible_duration: true,
                  deviceIndex: 1,
                  open: data.deodorantPumpOneStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Deodorize'
                })"
              >1 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'deodorantPumpOneStatus', roofChecked) ? '' : 'hide']" /></span>
              <span
                :class="[showStyle(data.deodorantPumpTwoFault, data.deodorantPumpTwoStatus), 'box', 'cur',showStatus(data, 'deodorantPumpTwoStatus')]"
                @click="handleClick(titleTop, 'deodorantPumpTwoStatus', {
                  title: `${data.deodorantPumpTwoStatus == 1 ? '关闭' : '开启'}除臭泵${titleTop}-2`,
                  visible_duration: true,
                  deviceIndex: 2,
                  open: data.deodorantPumpTwoStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Deodorize'
                })"
              >2  <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'deodorantPumpTwoStatus', roofChecked) ? '' : 'hide']" />   </span>
              <span
                :class="[showStyle(data.deodorantPumpThreeFault, data.deodorantPumpThreeStatus), 'box', 'cur',showStatus(data, 'deodorantPumpThreeStatus')]"
                @click="handleClick(titleTop, 'deodorantPumpThreeStatus', {
                  title: `${data.deodorantPumpThreeStatus == 1 ? '关闭' : '开启'}除臭泵${titleTop}-3`,
                  visible_duration: true,
                  deviceIndex: 3,
                  open: data.deodorantPumpThreeStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Deodorize'
                })"
              >3<i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'deodorantPumpThreeStatus', roofChecked) ? '' : 'hide']" />   </span>
              <span
                :class="[showStyle(data.deodorantPumpFourFault, data.deodorantPumpFourStatus), 'box','cur', showStatus(data, 'deodorantPumpFourStatus')]"
                @click="handleClick(titleTop, 'deodorantPumpFourStatus', {
                  title: `${data.deodorantPumpFourStatus == 1 ? '关闭' : '开启'}除臭泵${titleTop}-4`,
                  visible_duration: true,
                  deviceIndex: 4,
                  open: data.deodorantPumpFourStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Deodorize'
                })"
              >4<i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'deodorantPumpFourStatus', roofChecked) ? '' : 'hide']" />  </span>
            </div>
          </div>
          <div v-if="!hasFan" class="no-data" style="height: 45px;">暂无数据</div>
        </section>
        <section class="part chuchou">
          <div class="insert">
            <div class="wrap-box">
              <section class="left">
                <span class="dir">
                  上
                </span>
              </section>
              <section class="right">
                <span>
                  {{ data && valueExist(data.deodorantShedUpperTemp) ? data.deodorantShedUpperTemp + '℃' : '---' }}
                </span>
                <span>
                  {{ data && valueExist(data.deodorantShedUpperHumidity) ? data.deodorantShedUpperHumidity + '%' : '---' }}
                </span>
                <span> {{ data && valueExist(data.deodorantShedUpperSpeed) ? data.deodorantShedUpperSpeed + 'm/s' : '---' }}</span>
              </section>
            </div>
            <div class="wrap-box mt-10">
              <section class="left">
                <span class="dir">
                  中
                </span>
              </section>
              <section class="right">
                <span>
                  {{ data && valueExist(data.deodorantShedMiddleTemp) ? data.deodorantShedMiddleTemp + '℃' : '---' }}
                </span>
                <span>
                  {{ data && valueExist(data.deodorantShedMiddleHumidity) ? data.deodorantShedMiddleHumidity + '%' : '---' }}
                </span>
                <span>
                  {{ data && valueExist(data.deodorantShedMiddleSpeed) ? data.deodorantShedMiddleSpeed + 'm/s' : '---' }}
                </span>
              </section>
            </div>
            <div class="wrap-box mt-10">
              <section class="left">
                <span class="dir">
                  下
                </span>
              </section>
              <section class="right">
                <span>
                  {{ data && valueExist(data.deodorantShedLowerTemp) ? data.deodorantShedLowerTemp + '℃' : '---' }}
                </span>
                <span>
                  {{ data && valueExist(data.deodorantShedLowerHumidity) ? data.deodorantShedLowerHumidity + '%' : '---' }}
                </span>
                <span>
                  {{ data && valueExist(data.deodorantShedLowerSpeed) ? data.deodorantShedLowerSpeed + 'm/s' : '---' }}
                </span>
              </section>
            </div>
          </div>
        </section>
        <section class="part chuchou">
          <div class="insert">
            <div class="wrap-box">
              <section class="left">
                <span class="dir">
                  上
                </span>
              </section>
              <section class="right">
                <span>
                  {{ data && valueExist(data.deodorantShedOuterUpperTemp) ? data.deodorantShedOuterUpperTemp + '℃' : '---' }}
                </span>
                <span>
                  {{ data && valueExist(data.deodorantShedOuterUpperHumidity) ? data.deodorantShedOuterUpperHumidity + '%' : '---' }}
                </span>
                <span> {{ data && valueExist(data.deodorantShedOuterUpperSpeed) ? data.deodorantShedOuterUpperSpeed + 'm/s' : '---' }}</span>
              </section>
            </div>
            <div class="wrap-box mt-10">
              <section class="left">
                <span class="dir">
                  中
                </span>
              </section>
              <section class="right">
                <span>
                  {{ data && valueExist(data.deodorantShedOuterMiddleTemp) ? data.deodorantShedOuterMiddleTemp + '℃' : '---' }}
                </span>
                <span>
                  {{ data && valueExist(data.deodorantShedOuterMiddleHumidity) ? data.deodorantShedOuterMiddleHumidity + '%' : '---' }}
                </span>
                <span> {{ data && valueExist(data.deodorantShedOuterMiddleSpeed) ? data.deodorantShedOuterMiddleSpeed + 'm/s' : '---' }}</span>
              </section>
            </div>
            <div class="wrap-box mt-10">
              <section class="left">
                <span class="dir">
                  下
                </span>
              </section>
              <section class="right">
                <span>
                  {{ data && valueExist(data.deodorantShedOuterLowerTemp) ? data.deodorantShedOuterLowerTemp + '℃' : '---' }}
                </span>
                <span>
                  {{ data && valueExist(data.deodorantShedOuterLowerHumidity) ? data.deodorantShedOuterLowerHumidity + '%' : '---' }}
                </span>
                <span> {{ data && valueExist(data.deodorantShedOuterLowerSpeed) ? data.deodorantShedOuterLowerSpeed + 'm/s' : '---' }}</span>
              </section>
            </div>
          </div>
        </section>
      </div>
    </div>
    <div v-else class="floor-bottom-wrap floor-box-wrap">
      <div class="content-box">
        <section class="part">
          <div v-if="hasFan" class="group2" style="height: 40px;">
            <div class="insert">
              <span
                :class="[showStyle(data.deodorantPumpOneFault, data.deodorantPumpOneStatus), 'box','cur', showStatus(data, 'deodorantPumpOneStatus')]"
                @click="handleClick(titleTop, 'deodorantPumpOneStatus', {
                  title: `${data.deodorantPumpOneStatus == 1 ? '关闭' : '开启'}除臭泵${titleTop}-1`,
                  visible_duration: true,
                  deviceIndex: 1,
                  open: data.deodorantPumpOneStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Deodorize'
                })"
              >1 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'deodorantPumpOneStatus', roofChecked) ? '' : 'hide']" />
              </span>
              <span
                :class="[showStyle(data.deodorantPumpTwoFault, data.deodorantPumpTwoStatus), 'box', 'cur',showStatus(data, 'deodorantPumpTwoStatus')]"
                @click="handleClick(titleTop, 'deodorantPumpTwoStatus', {
                  title: `${data.deodorantPumpTwoStatus == 1 ? '关闭' : '开启'}除臭泵${titleTop}-2`,
                  visible_duration: true,
                  deviceIndex: 2,
                  open: data.deodorantPumpTwoStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Deodorize'
                })"
              >2 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'deodorantPumpTwoStatus', roofChecked) ? '' : 'hide']" /> </span>
              <span
                :class="[showStyle(data.deodorantPumpThreeFault, data.deodorantPumpThreeStatus), 'box', 'cur',showStatus(data, 'deodorantPumpThreeStatus')]"
                @click="handleClick(titleTop, 'deodorantPumpThreeStatus', {
                  title: `${data.deodorantPumpThreeStatus == 1 ? '关闭' : '开启'}除臭泵${titleTop}-3`,
                  visible_duration: true,
                  deviceIndex: 3,
                  open: data.deodorantPumpThreeStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Deodorize'
                })"
              >3 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'deodorantPumpThreeStatus', roofChecked) ? '' : 'hide']" /> </span>
              <span
                :class="[showStyle(data.deodorantPumpFourFault, data.deodorantPumpFourStatus), 'box','cur', showStatus(data, 'deodorantPumpFourStatus')]"
                @click="handleClick(titleTop, 'deodorantPumpFourStatus', {
                  title: `${data.deodorantPumpFourStatus == 1 ? '关闭' : '开启'}除臭泵${titleTop}-4`,
                  visible_duration: true,
                  deviceIndex: 4,
                  open: data.deodorantPumpFourStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Deodorize'
                })"
              >4 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'deodorantPumpFourStatus', roofChecked) ? '' : 'hide']" /> </span>
            </div>
          </div>
          <div v-if="!hasFan" class="no-data" style="height: 45px;">暂无数据</div>
        </section>
        <section class="part fengji">
          <div v-if="hasFan" class="fengji">
            <div class="insert">
              <!-- style="background-image: linear-gradient(225deg, #AAAAAA 0%, #6D6D6D 100%);" -->
              <span
                :class="[showStyle(data.fanGroupOneFault, data.fanGroupOneStatus), 'box','cur', showStatus(data, 'fanGroupOneStatus')]"
                @click="handleClick(titleTop, 'fanGroupOneStatus', {
                  title: `${data.fanGroupOneStatus == 1 ? '关闭' : '开启'}风机${titleTop}-1`,
                  visible_duration: true,
                  deviceIndex: 1,
                  open: data.fanGroupOneStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Fan'
                })"
              >
                1 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'fanGroupOneStatus', roofChecked) ? '' : 'hide']" />
              </span>
              <span
                :class="[showStyle(data.fanGroupTwoFault, data.fanGroupTwoStatus), 'box','cur', showStatus(data, 'fanGroupTwoStatus')]"
                @click="handleClick(titleTop, 'fanGroupTwoStatus', {
                  title: `${data.fanGroupTwoStatus == 1 ? '关闭' : '开启'}风机${titleTop}-2`,
                  visible_duration: true,
                  deviceIndex: 2,
                  open: data.fanGroupTwoStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Fan'
                })"
              >
                2 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'fanGroupTwoStatus', roofChecked) ? '' : 'hide']" />
              </span>
              <span
                :class="[showStyle(data.fanGroupThreeFault, data.fanGroupThreeStatus), 'box', 'cur',showStatus(data, 'fanGroupThreeStatus')]"
                @click="handleClick(titleTop, 'fanGroupThreeStatus', {
                  title: `${data.fanGroupThreeStatus == 1 ? '关闭' : '开启'}风机${titleTop}-3`,
                  visible_duration: true,
                  deviceIndex: 3,
                  open: data.fanGroupThreeStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Fan'
                })"
              >3 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'fanGroupThreeStatus', roofChecked) ? '' : 'hide']" /> </span>
            </div>
            <div class="insert bot-wrap">
              <span
                :class="[showStyle(data.fanGroupFourFault, data.fanGroupFourStatus), 'box','cur', showStatus(data, 'fanGroupFourStatus')]"
                @click="handleClick(titleTop, 'fanGroupFourStatus', {
                  title: `${data.fanGroupFourStatus == 1 ? '关闭' : '开启'}风机${titleTop}-4`,
                  visible_duration: true,
                  deviceIndex: 4,
                  open: data.fanGroupFourStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Fan'
                })"
              >4 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'fanGroupFourStatus', roofChecked) ? '' : 'hide']" /> </span>
              <span
                :class="[showStyle(data.fanGroupFiveFault, data.fanGroupFiveStatus), 'box','cur', 'cur', showStatus(data, 'fanGroupFiveStatus')]"
                @click="handleClick(titleTop, 'fanGroupFiveStatus', {
                  title: `${data.fanGroupFiveStatus == 1 ? '关闭' : '开启'}风机${titleTop}-5`,
                  visible_duration: true,
                  deviceIndex: 5,
                  open: data.fanGroupFiveStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Fan'
                })"
              >5 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'fanGroupFiveStatus', roofChecked) ? '' : 'hide']" /> </span>
              <span
                :class="[showStyle(data.fanGroupSixFault, data.fanGroupSixStatus), 'box', 'cur', showStatus(data, 'fanGroupSixStatus')]"
                @click="handleClick(titleTop, 'fanGroupSixStatus', {
                  title: `${data.fanGroupSixStatus == 1 ? '关闭' : '开启'}风机${titleTop}-6`,
                  visible_duration: true,
                  deviceIndex: 6,
                  open: data.fanGroupSixStatus == 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'Fan'
                })"
              >6 <i v-if="isMUlti" :class="['el-icon-success', 'right_icon', isChecked2(titleTop, 'fanGroupSixStatus', roofChecked) ? '' : 'hide']" /> </span>
            </div>
          </div>
          <div v-if="!hasFan" class="no-data" style="height: 78px;">暂无数据</div>
        </section>
        <section class="part drain-water">
          <div class="insert">
            <span :class="[data && data.drainageWaterStatus == 1 ? 'online' : 'offline', 'little-circle']" />
            <span>
              <img
                :src="data && data.drainageWaterStatus == 1 ? kaiguan : offKaiguan"
                class="cur"
                @click="operateModal({
                  visible_duration: true,
                  title: `${data && data.drainageWaterStatus === 1 ? '关闭' : '开启'}${titleTop}排水`,
                  deviceIndex: 1,
                  open: data && data.drainageWaterStatus === 1 ? 0 : 1,
                  duration: null,
                  iPig3SRoofDevSubType: 'DrainageWater'
                })"
              ></span>
            <span
              class="cur pai-water-icon icon-common-sty"
              @click="operateModal({
                visible_date: true,
                title: `${titleTop}排水开启时间/关闭时间设置`,
              },()=>{
                const entrys = data && data.drainageWaterConfig && data.drainageWaterConfig.entrys.length > 0 ? data.drainageWaterConfig.entrys : [];
                setState({
                  openTime: entrys.length > 0 ? entrys[0].openTime : null,//开始时间
                  closeTime: entrys.length > 0 ? entrys[0].closeTime : null,//结束时间
                })
              })"
            >
              <svg-icon
                icon-class="paishui"
              />
            </span>
            <!-- <span>
              <img
              class="cur"
              style="width:16px;height:16px;"
              :src="paishui"
              @click="operateModal({
                visible_date: true,
                title: `${titleTop}排水开启时间/关闭时间设置`,
              },()=>{
                const entrys = data && data.drainageWaterConfig && data.drainageWaterConfig.entrys.length > 0 ? data.drainageWaterConfig.entrys : [];
                setState({
                  openTime: entrys.length > 0 ? entrys[0].openTime : null,//开始时间
                  closeTime: entrys.length > 0 ? entrys[0].closeTime : null,//结束时间
                })
              })"
            ></span> -->
          </div>
        </section>
      </div>
      <div class="title-box">
        <span>{{ titleTop }}<span>{{ dev_status }}</span> </span>
      </div>
    </div>
    <!-- visible_duration modal-->
    <el-dialog
      :modal="false"
      :modal-append-to-body="false"
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible_duration"
      width="550px"
      @close="operateModal({
        visible_duration: false,
        title: ``,
        deviceIndex: null,
        open: null,
        duration: null,
        iPig3SRoofDevSubType: null
      })"
    >
      <div class="number-box nav-form">
        <span class="title modal-label">生效时长（分）</span>
        <el-input-number
          v-model="duration"
          controls-position="right"
          :min="0"
          :step="1"
          @change="durationChange(item.event)"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-hasAuth="'buildingPigHouse:control_RoofSub'" class="btn-blue" @click="controlInstruct">确 定</el-button>
      </div>
    </el-dialog>
    <!-- visible_date modal -->
    <el-dialog
      :modal="false"
      :modal-append-to-body="false"
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible_date"
      width="550px"
      @close="operateModal({
        visible_date: false,
        title: ``,
        openTime: null,
        closeTime: null,
      })"
    >
      <div class="number-box nav-form">
        <div class="time-box">
          <div class="time-title">开启时间（时:分）</div>
          <div class="tiem-picker-wrap">
            <el-time-picker
              v-model="openTime"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="选择开启时间"
            />
          </div>
        </div>
        <div class="split-line" />
        <div class="time-box">
          <div class="time-title">
            关闭时间（时:分）
          </div>
          <div class="tiem-picker-wrap">
            <el-time-picker
              v-model="closeTime"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="选择关闭时间"
            />
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-hasAuth="'buildingPigHouse:subConfig'" class="btn-blue" @click="paramInstruct">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import zaixian from '@/assets/image/pighouse/在线.png'
import kaiguan from '@/assets/image/pighouse/开关.png'
import shijian from '@/assets/image/pighouse/时间.png'
import './floor.scss'
import { getConfigElement } from '@/utils/overtService'
import offKaiguan from '@/assets/image/pighouse/offline-kaiguan.png'
import paishui from '@/assets/image/pighouse/形状.svg'
let message = {}
const titleMap = {
  'A1': 'roofA1SubGroupStatus',
  'A2': 'roofA2SubGroupStatus',
  'A3': 'roofA3SubGroupStatus',
  'A4': 'roofA4SubGroupStatus',
  'A5': 'roofA5SubGroupStatus',
  'A6': 'roofA6SubGroupStatus',
  'A7': 'roofA7SubGroupStatus',
  'B1': 'roofB1SubGroupStatus',
  'B2': 'roofB2SubGroupStatus',
  'B3': 'roofB3SubGroupStatus',
  'B4': 'roofB4SubGroupStatus',
  'B5': 'roofB5SubGroupStatus',
  'B6': 'roofB6SubGroupStatus',
  'B7': 'roofB7SubGroupStatus'
}
export default {
  name: 'FloorBox',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    roofChecked: {
      type: Array,
      default: () => {
        return []
      }
    },
    roofMultiOpen: {
      type: Boolean,
      default: false
    },
    roofMultiClose: {
      type: Boolean,
      default: false
    },
    titleTop: {
      type: String,
      default: 'A1'
    },
    position: {
      type: String,
      default: 'top'
    },
    // eslint-disable-next-line vue/require-default-prop
    handleMultiChoose: Function,
    // eslint-disable-next-line vue/require-default-prop
    handleReload: Function
  },
  data() {
    message = this.$message
    return {
      zaixian,
      offKaiguan,
      paishui,
      kaiguan,
      shijian,
      visible: false,
      activeItem: '',
      openTime: null, // 开始时间
      closeTime: null, // 结束时间
      title: '', // 模态框标题
      visible_duration: false,
      visible_date: false,
      visible_fan_duration: false,
      iPig3SRoofDevSubType: null,
      open: null,
      duration: null, // 生效时长
      deviceIndex: null
    }
  },
  computed: {
    isMUlti() {
      return this.roofMultiOpen || this.roofMultiClose
    },
    dev_status() {
      return JSON.stringify(this.data) === '{}' ? '未安装' : (this.data && this.data.isOnline === 1 ? '在线' : '离线')
    },
    hasFan() {
      const data = this.data
      return !!(data && (data.fanGroupOneStatus !== null || data.fanGroupTwoStatus !== null || data.fanGroupThreeStatus !== null || data.fanGroupFourStatus !== null || data.fanGroupFiveStatus !== null || data.fanGroupSixStatus !== null))
    }
  },
  methods: {
    // 操作模态框的显示隐藏
    operateModal(param, callback) {
      this.setState({
        ...param
      }, () => {
        if (callback) {
          callback()
        }
      })
    },
    setState(data = {}, call) {
      Object.keys(data).forEach(key => {
        this[key] = data[key]
      })
      if (typeof call === 'function') {
        call()
      }
    },
    isChecked2(mode, key, obj) {
      const str = titleMap[mode] + '_' + key
      return obj.indexOf(str) !== -1
    },
    durationChange(val) {

    },
    // 生效时长/开启/关闭风机/ 指令下发
    controlInstruct() {
      const data = this.data
      const pageElement = getConfigElement('buildingPigHouse')
      const deviceId = data && data.deviceId ? data.deviceId : null
      const deviceName = data && data.deviceName ? data.deviceName : null
      if (deviceId && deviceName) {
        const { duration, deviceIndex, open, iPig3SRoofDevSubType } = this.$data
        if (!duration) {
          this.$message.error('生效时长不能为空')
          return
        }
        const obj = {
          iPig3SRoofDevSubType,
          open,
          duration,
          deviceIndex
        }
        this.$httpRequest({
          type: 'PUT',
          payload: [obj],
          uri: pageElement.control_RoofSub && pageElement.control_RoofSub.uri + `?deviceId=${deviceId}&deviceName=${deviceName}`,
          callback: (res) => {
            if (res.rel) {
              this.$message.success(res.message || '指令下发成功!')
            } else {
              this.$message.error(res.message || '指令下发失败!')
            }
            this.setState({
              visible_duration: false,
              iPig3SRoofDevSubType: null,
              open: null,
              duration: null,
              deviceIndex: null
            })
          }
        })
      } else {
        this.$message.error('当前设备不存在！')
        this.setState({
          visible_duration: false,
          iPig3SRoofDevSubType: null,
          open: null,
          duration: null,
          deviceIndex: null
        })
      }
    },
    showStyle(errorCode, status) {
      const { roofMultiOpen, roofMultiClose } = this.$props
      if (errorCode === 0 || errorCode === null) {
        if (status === 1) {
          return roofMultiClose ? 'on_multi' : 'on'
        } else {
          return roofMultiOpen ? 'off_multi' : 'off'
        }
      } else {
        if (status === 1) {
          return roofMultiClose ? 'on_multi' : 'error_online'
        } else {
          return roofMultiOpen ? 'off_multi' : 'error_offline'
        }
      }
    },
    showStatus(data, key) {
      if (data) {
        if (this.valueExist(data[key])) {
          return ''
        } else {
          return 'hide'
        }
      } else {
        return 'hide'
      }
    },
    valueExist(val) {
      if (val === undefined || val === null || val === '') {
        return false
      } else {
        return true
      }
    },
    // 设置开启/关闭时间指令下发
    paramInstruct() {
      const data = this.data
      const pageElement = getConfigElement('buildingPigHouse')
      const deviceId = data && data.deviceId ? data.deviceId : null
      const deviceName = data && data.deviceName ? data.deviceName : null
      if (deviceId && deviceName) {
        const { openTime, closeTime } = this.$data
        if (!openTime || !closeTime) {
          this.$message.error('开始时间和结束时间不能为空')
          return
        }
        const obj = {
          'drainageWaterConfig': {
            'entrys': [
              {
                'openTime': openTime,
                'closeTime': closeTime
              }
            ]
          }
        }
        this.$httpRequest({
          type: 'PUT',
          payload: obj,
          uri: pageElement.subConfig && pageElement.subConfig.uri + `?deviceId=${deviceId}&deviceName=${deviceName}`,
          callback: (res) => {
            if (res.rel) {
              this.$message.success(res.message || '指令下发成功!')
            } else {
              this.$message.error(res.message || '指令下发失败!')
            }
            this.setState({
              visible_date: false,
              openTime: null,
              closeTime: null
            }, () => {
              this.handleReload()
            })
          }
        })
      } else {
        this.$message.error('当前设备不存在！')
        this.setState({
          visible_date: false,
          openTime: null,
          closeTime: null
        })
      }
    },
    handleClick(mode, key, params) {
      const { data, handleMultiChoose, roofMultiOpen, roofMultiClose } = this.$props
      const isMUlti = roofMultiOpen || roofMultiClose
      if (!isMUlti) {
        this.operateModal(params)
      } else if (data.isOnline !== 1) {
        message.error(`${mode}设备离线`)
        return
      } else if (roofMultiOpen === true) {
        if (data[key] === 1) {
          message.error('请选择关闭的设备')
          return
        }
      } else if (roofMultiClose === true) {
        if (data[key] === 0) {
          message.error('请选择开启的设备')
          return
        }
      }
      handleMultiChoose(titleMap[mode], key)
    }
  }
}
</script>
<style lang="scss">
.el-time-spinner__item {
  color: white;
}
.el-time-panel__btn {
    color: gainsboro;
}
.el-time-spinner__item:hover:not(.disabled):not(.active) {
    background: unset;
    cursor: pointer;
    font-weight: 700;
}
.el-time-spinner__item.active:not(.disabled) {
    color:white;
    font-weight: 700;
}
.floor-box-container {
  .el-dialog__body {
    padding: 10px;
  }
  .el-dialog__title {
    font-size: 18px;
  }
.el-input-number {
  line-height: 36px;
  height: 36px;
  overflow: hidden;
  border: 1px solid #475a9a;
  border-radius: 2px;
  .el-input__inner {
    background: #162456;
     color: #cdd8f7;
    border: none;
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    background: #162456;
    border-left: 1px solid #475a9a;
    border-bottom: none;
    & [class*='el-icon'] {
      color: #ffffff;
    }
  }
}
}

</style>
