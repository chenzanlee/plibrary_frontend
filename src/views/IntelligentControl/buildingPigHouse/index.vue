<template>
  <div class="pig-house-container">
    <searchForm
      v-show="!isfullScreen"
      ref="navForm"
      style="margin-bottom:10px;"
      class="pig-nav-house"
      :data="navFormInfo.data"
      :field-list="navFormInfo.fieldList"
    >
      <template v-slot:form-cascader>
        <div>
          <el-cascader
            ref="cascader"
            v-model="navFormInfo.data.cascader"
            clearable
            :options="navFormInfo.fieldList.left.inpLists[0].options"
            :props="{
              checkStrictly: false,
              expandTrigger: 'hover',
              label: navFormInfo.fieldList.left.inpLists[0].customLabel
                ? navFormInfo.fieldList.left.inpLists[0].customLabel
                : 'label',
              value: navFormInfo.fieldList.left.inpLists[0].customValue
                ? navFormInfo.fieldList.left.inpLists[0].customValue
                : 'value',
            }"
            filterable
            :placeholder="navFormInfo.fieldList.left.inpLists[0].placeholder"
            :style="{ width: navFormInfo.fieldList.left.inpLists[0].width }"
            @change="handleEvent"
          />
        </div>
      </template>
      <div slot="left" class="top-tab-container">
        <el-button
          :class="{ active: activeTab === 'RoofPlan', 'topBtn':true }"
          style="padding:12px;"
          @click="changeTopBtn('RoofPlan')"
        >楼顶平面</el-button>
        <el-button
          v-hasAuth="'buildingPigHouse:getDevicesByFieldForBuilding'"
          :class="{ active: activeTab === 'BLOCK_A', 'topBtn':true }"
          style="padding:12px;"
          @click="changeTopBtn('BLOCK_A')"
        >A座</el-button>
        <el-button
          v-hasAuth="'buildingPigHouse:getDevicesByFieldForBuilding'"
          :class="{ active: activeTab === 'BLOCK_B', 'topBtn':true }"
          style="padding:12px;"
          @click="changeTopBtn('BLOCK_B')"
        >B座</el-button>
        <el-button v-show="activeTab === 'RoofPlan'" class="btn-blue" @click="submitOption">刷新</el-button>
      </div>
    </searchForm>
    <div v-if="selectedOption.length === 3 && activeTab === 'RoofPlan'" class="temp-box-wrap top-box">
      <div class="tem-desc">
        <li>
          <span class="label">室外温度: </span>
          <span class="not-cur">{{ roofData.main && valueExist(roofData.main.roofOuterTemp) ? roofData.main.roofOuterTemp + '℃' : '---' }}</span>
        </li>
        <li>
          <span class="label">室外湿度: </span>
          <span class="not-cur">{{ roofData.main&& valueExist(roofData.main.roofOuterHumidity) ? roofData.main.roofOuterHumidity + '%' : '---' }}</span>
        </li>
        <li>
          <span class="label">开启风机总数: </span>
          <span class="not-cur">{{ roofData.main && valueExist(roofData.main.fanCount) ? roofData.main.fanCount : '---' }}</span>
        </li>
        <li>
          <span class="label">平均压差: </span>
          <span class="not-cur">{{ roofData.main && valueExist(roofData.main.averagePressure) ? roofData.main.averagePressure + 'pa' : '---' }}</span>
        </li>
        <li>
          <span class="label">目标压差: </span>
          <span class="press-box dest-press">
            <span class="value cur" @click="updateDestPressure">{{ valueExist(destPressure) ? destPressure + 'pa' : '---' }}</span>
          </span>
        </li>
        <li>
          <span class="label">补水水压1: </span>
          <span class="not-cur">{{ valueExist(waterpressSensorPressure1) ? waterpressSensorPressure1 + 'Kpa' : '---' }}</span>
        </li>
        <li>
          <span class="label">补水水压2: </span>
          <span class="not-cur">{{ valueExist(waterpressSensorPressure2) ? waterpressSensorPressure2 + 'Kpa' : '---' }}</span>
        </li>
      </div>
    </div>
    <div v-loading="!loaded" class="content-container Highlight" :style="isfullScreen ? 'height: 100%' :wrapHeight">
      <!-- <div v-loading="!loaded" class="content-container Highlight" :style="{wrapHeight, height: (isfullScreen ? '100%' : '')}"> -->
      <div v-if="!isShowFloorBlock" style="height: calc(100vh - 246px);overflow-y: auto;">
        <section v-if="roofData && selectedOption.length === 3" class="content-section">
          <div class="left-part">
            <div class="top">
              <div class="water guide">
                <div class="text-box">
                  <span class="text"> 排水</span>
                  <span class="line" />
                  <span class="line" />
                  <span class="line" />
                  <span class="bot" />
                </div>
              </div>
              <div class="fan guide">
                <div class="text-box">
                  <span class="text">  风机</span>
                  <span class="line" />
                  <span class="line" />
                  <span class="line" />
                  <span class="bot" />
                </div>
              </div>
              <div class="cub guide">
                <div class="text-box">
                  <span class="text">  除臭泵</span>
                  <span class="line" />
                  <span class="line" />
                  <span class="line" />
                  <span class="bot" />
                </div>
              </div>
              <div class="peng guide">
                <div class="text-box">
                  <span class="text">  除臭棚侧</span>
                  <span class="line" />
                  <span class="line" />
                  <span class="line" />
                  <span class="bot" />
                </div>
              </div>
              <div class="peng guide">
                <div class="text-box">
                  <span class="text">  天井侧</span>
                  <span class="line" />
                  <span class="line" />
                  <span class="line" />
                  <span class="bot" />
                </div>
              </div>
            </div>
            <div class="center">
              <div class="sol-box">
                <div class="text-box">
                  <span class="text">  实际压差</span>
                  <span class="line" />
                  <span class="line" />
                  <span class="line" />
                  <span class="bot" />
                </div>
              </div>
              <div class="tar-box">
                <div class="text-box">
                  <span class="text">  目标压差</span>
                  <span class="line" />
                  <span class="line" />
                  <span class="line" />
                  <span class="bot" />
                </div>
              </div>
            </div>
            <div class="bottom top">
              <div class="cub guide">
                <div class="text-box">
                  <span class="text">  除臭泵</span>
                  <span class="line" />
                  <span class="line" />
                  <span class="line" />
                  <span class="bot" />
                </div>
              </div>
              <div class="fan guide">
                <div class="text-box">
                  <span class="text">  风机</span>
                  <span class="line" />
                  <span class="line" />
                  <span class="line" />
                  <span class="bot" />
                </div>
              </div>
              <div class="water guide">
                <div class="text-box">
                  <span class="text"> 排水</span>
                  <span class="line" />
                  <span class="line" />
                  <span class="line" />
                  <span class="bot" />
                </div>
              </div>
            </div>
          </div>
          <div class="right-part ">
            <div class="top-box">
              <div v-if="activeTab === 'RoofPlan'" class="batch-btns batch-btns2">
                <el-button v-show="isRoofMultiOpt" class="is-scrolling-left-btn btn-border" @click="roofMultiOptCancel">取消</el-button>
                <el-button v-show="isRoofMultiOpt" class="is-scrolling-left-btn btn-blue" @click="roofMultiOptOkModal">确定</el-button>
                <el-button v-show="!isRoofMultiOpt" class="is-scrolling-left-btn btn-blue" type="primary" @click="handleroofMultiOpen">批量开</el-button>
                <el-button v-show="!isRoofMultiOpt" class="is-scrolling-left-btn btn-blue" @click="handleroofMultiClose">批量关</el-button>
                <el-button class="is-scrolling-left-btn btn-blue" @click="handleFanExport">风机明细导出</el-button>
              </div>
              <div class="controller-desc">
                <div class="tem-desc">
                  <div class="main-control">
                    <span class="label">主控制器: </span>
                    <svg-icon
                      v-if="roofData.main"
                      class="icon-item"
                      :icon-class="roofData.main.isOnline === 1 ? 'online-ico' : 'offline-ico'"
                    />
                    <span style="margin-left: 3px;" :class="[ roofData.main && roofData.main.isOnline === 1 ? 'not-cur': 'offline-text']">{{ roofData.main === null ? '未安装' : (roofData.main.isOnline === 1 ? '在线' : '离线') }}</span>
                    <el-button
                      v-show="roofData.main"
                      v-hasAuth="'buildingPigHouse:mainSelfControl'"
                      :loading="reStartLoading"
                      style="display:inline-block;margin-left: 10px;"
                      class="is-scrolling-left-btn btn-blue"
                      :disabled="(roofData.main && roofData.main.isOnline === 1)? false : true"
                      @click="reStart"
                    >
                      重启
                    </el-button>
                    <el-button
                      v-show="roofData.main"
                      v-hasAuth="'buildingPigHouse:param_RoofMain'"
                      style="display:inline-block;margin-left: 10px;"
                      class="is-scrolling-left-btn btn-blue"
                      :disabled="(roofData.main && roofData.main.isOnline === 1)? false : true"
                      @click="configDialog = true"
                    >
                      工作配置
                    </el-button>
                  </div>
                </div>
                <div class="icon-list water-box">
                  <div class="left-water">
                    <li class="water-li">
                      <span class="label">补水: </span>
                      <span class="give-water-icon icon-common-sty">
                        <svg-icon
                          icon-class="give-water"
                        />
                      </span>
                    </li>
                    <li class="water-li">
                      <span class="label">排水: </span>
                      <span class="pai-water-icon icon-common-sty">
                        <svg-icon
                          icon-class="paishui"
                        />
                      </span>
                    </li>
                  </div>
                  <div class="right-water">
                    <li class="water-li">
                      <span class="house-icon">
                        <span :class="['little-circle', roofData.main && Number(roofData.main.replenishWaterStatusA) === 1 ? 'online' : 'offline']" />
                      </span>
                    </li>
                    <li class="water-li">
                      <span class="house-icon cur">
                        <img
                          :src="roofData.main && roofData.main.replenishWaterStatusA == 1 ? kaiguan : offKaiguan "
                          @click="setState({
                            water_block: 0,
                            visible_main_duration: true
                          })"
                        >
                      </span>
                    </li>
                    <li class="water-li">
                      <span
                        class="house-icon cur"
                        @click="setState({
                          water_block: 0,
                          visible_main_date: true,
                          enable_open: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].enable : null,
                          openTime: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].openTime : null,
                          closeTime: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].closeTime : null
                        })"
                      >
                        <span class="give-water-icon icon-common-sty">
                          <svg-icon
                            icon-class="give-water"
                          />
                        </span>
                      </span>
                    </li>
                    <li
                      class="water-li"
                    >
                      <span
                        class="house-icon cur icon-common-sty pai-water-icon"
                        @click="setState({
                          water_block: 0,
                          visible_main_pop_water: true,
                          pop_enable_open: roofData.main && roofData.main.drainageWaterConfig && roofData.main.drainageWaterConfig.entrys.length > 0 ? roofData.main.drainageWaterConfig.entrys[0].enable : null,
                          pop_openTime: roofData.main && roofData.main.drainageWaterConfig && roofData.main.drainageWaterConfig.entrys.length > 0 ? roofData.main.drainageWaterConfig.entrys[0].openTime : null,
                          pop_closeTime: roofData.main && roofData.main.drainageWaterConfig && roofData.main.drainageWaterConfig.entrys.length > 0 ? roofData.main.drainageWaterConfig.entrys[0].closeTime : null,
                        })"
                      >
                        <!-- <img
                          style="width:16px;height:16px;"
                          :src="xingzhuang"

                        > -->
                        <svg-icon
                          icon-class="paishui"
                        />
                      </span>
                    </li>
                  </div>
                </div>
                <div class="icon-list controll-icon-box">
                  <li class="water-li">
                    <span class="house-icon label"><img :src="guanbi" alt=""></span>
                    <span class="value">关闭</span>
                  </li>
                  <li class="water-li">
                    <span class="house-icon label"><img :src="kaiqi" alt=""></span>
                    <span class="value">开启</span>
                  </li>
                  <li class="water-li">
                    <span class="house-icon label"><img :src="baojing" alt=""></span>
                    <span class="value">报警</span></li>
                </div>
              </div>
            </div>
            <div class="data-box is-scrolling-left">
              <div class="a-floor">
                <FloorBox
                  key="top_1"
                  :data="roofData.roofA1SubGroupStatus"
                  position="top"
                  title-top="A1"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
                <FloorBox
                  key="top_2"
                  :data="roofData.roofA2SubGroupStatus"
                  position="top"
                  title-top="A2"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
                <FloorBox
                  key="top_3"
                  :data="roofData.roofA3SubGroupStatus"
                  position="top"
                  title-top="A3"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
                <FloorBox
                  key="top_4"
                  :data="roofData.roofA4SubGroupStatus"
                  position="top"
                  title-top="A4"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
                <FloorBox
                  key="top_5"
                  :data="roofData.roofA5SubGroupStatus"
                  position="top"
                  title-top="A5"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
                <FloorBox
                  key="top_6"
                  :data="roofData.roofA6SubGroupStatus"
                  position="top"
                  title-top="A6"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
                <FloorBox
                  key="top_7"
                  :data="roofData.roofA7SubGroupStatus"
                  position="top"
                  title-top="A7"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
              </div>
              <div class="single-box">
                <div class="insert">
                  <!-- A1 -->
                  <div class="block">
                    <div class="mb-10">
                      <span>
                        <span class="floor-text">A1: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofA1SubGroupStatus) && valueExist(roofData.roofA1SubGroupStatus.pressure) ? `${roofData.roofA1SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B1: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofB1SubGroupStatus) &&
                            valueExist(roofData.roofB1SubGroupStatus.pressure) ?
                              `${roofData.roofB1SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span>
                        <span class="floor-text">A1: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofA1SubGroupStatus', {
                            activeDev: 'roofA1SubGroupStatus',
                            subDestPressure: valueExist(roofData.roofA1SubGroupStatus) && valueExist(roofData.roofA1SubGroupStatus.destPressure) ? `${roofData.roofA1SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofA1SubGroupStatus) && valueExist(roofData.roofA1SubGroupStatus.destPressure) ? `${roofData.roofA1SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B1: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofB1SubGroupStatus', {
                            activeDev: 'roofB1SubGroupStatus',
                            subDestPressure: valueExist(roofData.roofB1SubGroupStatus) && valueExist(roofData.roofB1SubGroupStatus.destPressure) ? `${roofData.roofB1SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofB1SubGroupStatus) && valueExist(roofData.roofB1SubGroupStatus.destPressure) ? `${roofData.roofB1SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                  </div>
                  <!-- A2 -->
                  <div class="block">
                    <div class="mb-10">
                      <span>
                        <span class="floor-text">A2: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofA2SubGroupStatus) && valueExist(roofData.roofA2SubGroupStatus.pressure) ? `${roofData.roofA2SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B2: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofB2SubGroupStatus) && valueExist(roofData.roofB2SubGroupStatus.pressure) ? `${roofData.roofB2SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span>
                        <span class="floor-text">A2: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofA2SubGroupStatus', {
                            activeDev: 'roofA2SubGroupStatus',
                            subDestPressure:valueExist(roofData.roofA2SubGroupStatus) && valueExist(roofData.roofA2SubGroupStatus.destPressure) ? `${roofData.roofA2SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofA2SubGroupStatus) && valueExist(roofData.roofA2SubGroupStatus.destPressure) ? `${roofData.roofA2SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B2: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofB2SubGroupStatus', {
                            activeDev: 'roofB2SubGroupStatus',
                            subDestPressure: valueExist(roofData.roofB2SubGroupStatus) && valueExist(roofData.roofB2SubGroupStatus.destPressure) ? `${roofData.roofB2SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofB2SubGroupStatus) && valueExist(roofData.roofB2SubGroupStatus.destPressure) ? `${roofData.roofB2SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                  </div>
                  <!-- A3 -->
                  <div class="block">
                    <div class="mb-10">
                      <span>
                        <span class="floor-text">A3: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofA3SubGroupStatus) && valueExist(roofData.roofA3SubGroupStatus.pressure) ? `${roofData.roofA3SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B3: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofB3SubGroupStatus) && valueExist(roofData.roofB3SubGroupStatus.pressure) ? `${roofData.roofB3SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span>
                        <span class="floor-text">A3: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofA3SubGroupStatus', {
                            activeDev: 'roofA3SubGroupStatus',
                            subDestPressure:valueExist(roofData.roofA3SubGroupStatus) && valueExist(roofData.roofA3SubGroupStatus.destPressure) ? `${roofData.roofA3SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofA3SubGroupStatus) && valueExist(roofData.roofA3SubGroupStatus.destPressure) ? `${roofData.roofA3SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B3: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofB3SubGroupStatus', {
                            activeDev: 'roofB3SubGroupStatus',
                            subDestPressure: valueExist(roofData.roofB3SubGroupStatus) && valueExist(roofData.roofB3SubGroupStatus.destPressure) ? `${roofData.roofB3SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofB3SubGroupStatus) && valueExist(roofData.roofB3SubGroupStatus.destPressure) ? `${roofData.roofB3SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                  </div>
                  <!-- A4 -->
                  <div class="block">
                    <div class="mb-10">
                      <span>
                        <span class="floor-text">A4: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofA4SubGroupStatus) && valueExist(roofData.roofA4SubGroupStatus.pressure) ? `${roofData.roofA4SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B4: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofB4SubGroupStatus) && valueExist(roofData.roofB4SubGroupStatus.pressure) ? `${roofData.roofB4SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span>
                        <span class="floor-text">A4: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofA4SubGroupStatus', {
                            activeDev: 'roofA4SubGroupStatus',
                            subDestPressure:valueExist(roofData.roofA4SubGroupStatus) && valueExist(roofData.roofA4SubGroupStatus.destPressure) ? `${roofData.roofA4SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofA4SubGroupStatus) && valueExist(roofData.roofA4SubGroupStatus.destPressure) ? `${roofData.roofA4SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B4: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofB4SubGroupStatus', {
                            activeDev: 'roofB4SubGroupStatus',
                            subDestPressure: valueExist(roofData.roofB4SubGroupStatus) && valueExist(roofData.roofB4SubGroupStatus.destPressure) ? `${roofData.roofB4SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofB4SubGroupStatus) && valueExist(roofData.roofB4SubGroupStatus.destPressure) ? `${roofData.roofB4SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>

                  </div>
                  <!-- A5 -->
                  <div class="block">
                    <div class="mb-10">
                      <span>
                        <span class="floor-text">A5: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofA5SubGroupStatus) && valueExist(roofData.roofA5SubGroupStatus.pressure) ? `${roofData.roofA5SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B5: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofB5SubGroupStatus) && valueExist(roofData.roofB5SubGroupStatus.pressure) ? `${roofData.roofB5SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span>
                        <span class="floor-text">A5: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofA5SubGroupStatus', {
                            activeDev: 'roofA5SubGroupStatus',
                            subDestPressure:valueExist(roofData.roofA5SubGroupStatus) && valueExist(roofData.roofA5SubGroupStatus.destPressure) ? `${roofData.roofA5SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofA5SubGroupStatus) && valueExist(roofData.roofA5SubGroupStatus.destPressure) ? `${roofData.roofA5SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B5: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofB5SubGroupStatus', {
                            activeDev: 'roofB5SubGroupStatus',
                            subDestPressure: valueExist(roofData.roofB5SubGroupStatus) && valueExist(roofData.roofB5SubGroupStatus.destPressure) ? `${roofData.roofB5SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofB5SubGroupStatus) && valueExist(roofData.roofB5SubGroupStatus.destPressure) ? `${roofData.roofB5SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                  </div>
                  <!-- A6 -->
                  <div class="block">
                    <div class="mb-10">
                      <span>
                        <span class="floor-text">A6: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofA6SubGroupStatus) &&
                            valueExist(roofData.roofA6SubGroupStatus.pressure) ? `${roofData.roofA6SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B6: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofB6SubGroupStatus) && valueExist(roofData.roofB6SubGroupStatus.pressure) ? `${roofData.roofB6SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span>
                        <span class="floor-text">A6: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofA6SubGroupStatus', {
                            activeDev: 'roofA6SubGroupStatus',
                            subDestPressure:valueExist(roofData.roofA6SubGroupStatus) &&
                              valueExist(roofData.roofA6SubGroupStatus.destPressure) ? `${roofData.roofA6SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofA6SubGroupStatus) && valueExist(roofData.roofA6SubGroupStatus.destPressure) ? `${roofData.roofA6SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B6: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofB6SubGroupStatus', {
                            activeDev: 'roofB6SubGroupStatus',
                            subDestPressure: valueExist(roofData.roofB6SubGroupStatus) && valueExist(roofData.roofB6SubGroupStatus.destPressure) ? `${roofData.roofB6SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofB6SubGroupStatus) && valueExist(roofData.roofB6SubGroupStatus.destPressure) ? `${roofData.roofB6SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                  </div>
                  <!-- A7 -->
                  <div class="block">
                    <div class="mb-10">
                      <span>
                        <span class="floor-text">A7: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofA7SubGroupStatus) && valueExist(roofData.roofA7SubGroupStatus.pressure) ? `${roofData.roofA7SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B7: </span>
                        <span class="sub-btn">
                          {{ valueExist(roofData.roofB7SubGroupStatus) && valueExist(roofData.roofB7SubGroupStatus.pressure) ? `${roofData.roofB7SubGroupStatus.pressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span>
                        <span class="floor-text">A7: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofA7SubGroupStatus', {
                            activeDev: 'roofA7SubGroupStatus',
                            subDestPressure:valueExist(roofData.roofA7SubGroupStatus) && valueExist(roofData.roofA7SubGroupStatus.destPressure) ? `${roofData.roofA7SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofA7SubGroupStatus) && valueExist(roofData.roofA7SubGroupStatus.destPressure) ? `${roofData.roofA7SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                      <span>
                        <span class="floor-text">B7: </span>
                        <span
                          class="sub-btn cur value press-box dest-press"
                          @click=" setPressure(roofData, 'roofB7SubGroupStatus', {
                            activeDev: 'roofB7SubGroupStatus',
                            subDestPressure: valueExist(roofData.roofB7SubGroupStatus) && valueExist(roofData.roofB7SubGroupStatus.destPressure) ? `${roofData.roofB7SubGroupStatus.destPressure}` : null,
                            subPressureModalVisible: true,
                          })"
                        >
                          {{ valueExist(roofData.roofB7SubGroupStatus) && valueExist(roofData.roofB7SubGroupStatus.destPressure) ? `${roofData.roofB7SubGroupStatus.destPressure}pa` : '---' }}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="b-floor a-floor">
                <FloorBox
                  key="bottom_1"
                  title-top="B1"
                  position="bottom"
                  :data="roofData.roofB1SubGroupStatus"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
                <FloorBox
                  key="bottom_2"
                  title-top="B2"
                  position="bottom"
                  :data="roofData.roofB2SubGroupStatus"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
                <FloorBox
                  key="bottom_3"
                  title-top="B3"
                  position="bottom"
                  :data="roofData.roofB3SubGroupStatus"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
                <FloorBox
                  key="bottom_4"
                  title-top="B4"
                  position="bottom"
                  :data="roofData.roofB4SubGroupStatus"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
                <FloorBox
                  key="bottom_5"
                  title-top="B5"
                  position="bottom"
                  :data="roofData.roofB5SubGroupStatus"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
                <FloorBox
                  key="bottom_6"
                  title-top="B6"
                  position="bottom"
                  :data="roofData.roofB6SubGroupStatus"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
                <FloorBox
                  key="bottom_7"
                  title-top="B7"
                  position="bottom"
                  :data="roofData.roofB7SubGroupStatus"
                  :roof-checked="roofChecked"
                  :roof-multi-open="roofMultiOpen"
                  :roof-multi-close="roofMultiClose"
                  :handle-multi-choose="handleMultiChoose"
                  :handle-reload="submitOption"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          v-else
          style="display:flex;justify-content: center; align-items: center;width: 100%;height: calc(100vh - 205px);"
        >
          <img :src="noData | noDataFile('noData', 'svg')" alt="" style="max-width: 300px;">
        </section>
      </div>
      <!-- AB座 内容 -->

      <div
        v-if="isShowFloorBlock"
      >
        <div v-if="isFloorBlockHasData" class="floor-block-container is-scrolling-left" :style="!isfullScreen ? 'height: calc(100vh - 205px);':'height: calc(100vh - 60px);'">
          <div>
            <div class="top-box top-box-ab">
              <div class="left">
                <searchForm
                  ref="navForm"
                  :data="blockFormInfo.data"
                  :field-list="blockFormInfo.fieldList"
                >
                  <div slot="left" class="top-tab-container">
                    <el-button style="width: 90px; margin-right: 10px;" :class="{ active: houseItem === 1, 'topBtn':true }" @click="showSFModal(1)">
                      楼层猪舍类型
                    </el-button>
                    <el-button style="margin-right: 10px;" :class="{ active: activeItem ==='total', 'topBtn':true}" @click="changeItem('total')">
                      全部
                      <span>{{ `(${deviceData && calculate(deviceData.deviceList, 'total')})` }}</span>
                    </el-button>
                    <el-button style="margin-right: 10px;" :class="{ active: activeItem ==='online', 'topBtn':true }" @click="changeItem('online')">
                      <span class="icon-text-box">
                        <svg-icon
                          :icon-class="'online-ico'"
                        />
                        <span>在线</span>
                        <span>{{ `(${deviceData && calculate(deviceData.deviceList, 'online')})` }}</span>
                      </span>
                    </el-button>
                    <el-button style="margin-right: 10px;" :class="{ active: activeItem ==='offline', 'topBtn':true}" @click="changeItem('offline')">
                      <span class="icon-text-box">
                        <svg-icon
                          :icon-class="'offline-ico'"
                        />
                        <span>离线</span>
                        <span>{{ `(${deviceData && calculate(deviceData.deviceList, 'offline')})` }}</span>
                      </span>
                    </el-button>
                    <el-button style="margin-right: 10px;" :class="{ active: activeItem ==='error','topBtn':true }" @click="changeItem('error')">
                      <span class="icon-text-box">
                        <span class="waring-box"><img src="@/assets/image/unitStatus/waring.png"></span>
                        <span>故障</span>
                        <span>{{ `(${deviceData && calculate(deviceData.deviceList, 'error')})` }}</span>
                      </span>
                    </el-button>
                    <el-button style="margin-right: 10px;" :class="{ active: activeItem ==='alarm', 'topBtn':true}" @click="changeItem('alarm')">
                      <span class="icon-text-box">
                        <svg-icon
                          :icon-class="'warn-num'"
                        />
                        <span>报警</span>
                        <span>{{ `(${deviceData && calculate(deviceData.deviceList, 'alarm')})` }}</span>
                      </span>
                    </el-button>
                  </div>
                </searchForm>
              </div>
              <div class="right">
                <div class="batch-box-big building-input">
                  <input
                    v-model="minTemp"
                    class="my-input"
                    type="number"
                    placeholder="低温"
                  >
                  <span>-</span>
                  <input
                    v-model="maxTemp"
                    class="my-input"
                    type="number"
                    placeholder="高温"
                    style="margin-right: 10px"
                  >
                  <input
                    v-model="minAge"
                    class="my-input"
                    type="number"
                    placeholder="短龄"
                  >
                  <span>-</span>
                  <input
                    v-model="maxAge"
                    class="my-input"
                    type="number"
                    placeholder="长龄"
                    style="margin-right: 10px"
                  >
                  <div class="filter default building" style="margin-right: 10px">
                    <el-select
                      v-model="filterValue"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="fitem in filterOptions"
                        :key="fitem.value"
                        :label="fitem.label"
                        :value="fitem.value"
                      />
                    </el-select>
                  </div>
                </div>
                <!-- <span class="set-box">
                  <img :src="shezhi">
                </span> -->
              </div>
            </div>
            <div class="top-box">
              <div style="flex:1 1 auto;" />
              <div class="right">
                <div class="batch-box-big building-input">
                  <el-button v-show="!isMulti" type="primary" style="padding:8px 5px;" class="btn-blue" @click="batchOperate(true)">
                    批量操作
                  </el-button>
                  <el-checkbox v-show="isMulti && viewPage === 'box'" v-model="checkAll" style="margin-right:10px;" @change="(checked)=>{checkAllChange(checked)}">
                    <span class="allCheck">全选</span>
                  </el-checkbox>
                  <el-button v-show="isMulti" style="padding: 8px 12px;" type="primary" class="btn-blue" @click="batchOperate(false)">
                    取消
                  </el-button>
                  <el-button v-show="isMulti" style="padding: 8px 12px;" type="primary" class="btn-blue" @click="instruct">
                    发送指令
                  </el-button>
                  <div
                    class="layout"
                    style="margin-left:10px;cursor:pointer"
                    @click="switchViewPage"
                  >
                    <el-tooltip class="" effect="dark" :content="viewPage === 'table' ? '切换格子视图':'切换表格视图'" placement="top-start">
                      <svg-icon style="font-size: 24px" icon-class="view-layout" />
                    </el-tooltip>
                  </div>
                  <div
                    class="full-screen"
                    style="margin-left:10px;cursor:pointer"
                    @click="checkFullScreen"
                  >
                    <el-tooltip class="" effect="dark" :content="isfullScreen ? '退出全屏':'全屏'" placement="top-start">
                      <svg-icon
                        style="font-size: 24px"
                        :icon-class="isfullScreen ? 'shirk-screen':'full-screen'"
                      />
                    </el-tooltip>
                  </div>
                  <!-- 表格视图时不需要设置展示字段功能 -->
                  <div v-show="viewPage === 'box'" style="margin-left:10px;cursor:pointer" @click="handleCustomModal">
                    <el-tooltip class="" effect="dark" content="设置" placement="top-start">
                      <svg-icon
                        style="font-size: 24px"
                        icon-class="setting"
                      />
                    </el-tooltip>
                  </div>
                  <div
                    style="margin-left:10px;cursor:pointer;padding-top:5px;margin-right:5px;"
                    @click="exportFileData"
                  >
                    <el-button class="btn-blue">
                      <svg-icon icon-class="newExport" />
                      导出
                    </el-button>
                    <!-- <el-tooltip class="" effect="dark" content="导出" placement="top-start">
                      <img src="@/assets/image/export.png">
                    </el-tooltip> -->
                  </div>
                </div>
              </div>
            </div>
            <div v-if="viewPage === 'box'" class="floor-block-content-box" style="margin-bottom: -120px;">
              <div
                v-for="(item,i) in filterData(deviceData.deviceList, activeItem, activeTab, chooseFloor, chooseSegment)"
                :key="i"
                style="width:16.666%;"
              >
                <InfoBox
                  :key="i"
                  :has-check-box="isMulti"
                  :data="item"
                  :show-params="showParams"
                  :check-change="checkChange"
                  :checked-obj="checkedObj"
                  :handle-detail="handleDetail"
                />
              </div>
            </div>
            <div v-if="viewPage === 'table'" class="table-container">
              <table-view
                :table-data="filterData(deviceData.deviceList, activeItem, activeTab, chooseFloor, chooseSegment)"
                :has-check-box="isMulti"
                :show-params="showParams"

                :checked-obj="checkedObj"
                :handle-detail="handleDetail"
                @checkChange="checkTableChange"
                @checkTableAllChange="checkAllChange"
              />
            </div>
          </div>
        </div>
        <section
          v-else
          style="display:flex;justify-content: center; align-items: center;width: 100%;height: calc(100vh - 265px);"
        >
          <img :src="noData | noDataFile('noData', 'svg')" alt="" style="max-width: 300px;">
        </section>
      </div>
    </div>
    <!-- 修改目标压差 -->
    <el-dialog
      :modal="false"
      :modal-append-to-body="false"
      title="修改目标压差"
      :close-on-click-modal="false"
      :visible.sync="destPressureModalVisible"
      width="550px"
      @close="setState({
        destPressureModalVisible: false
      })"
    >
      <div class="number-box floor-box-container nav-form">
        <span class="title modal-label">目标压差：</span>
        <el-input-number
          v-model="destPressure2"
          controls-position="right"
          placeholder="请输入目标压差"
          :min="0"
          :step="1"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-hasAuth="'buildingPigHouse:param_RoofMain'" class="btn-blue" @click="handleDestPressureOk">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :modal="false"
      :modal-append-to-body="false"
      :title="`修改${titleMap[activeDev]}目标压差`"
      :close-on-click-modal="false"
      :visible.sync="subPressureModalVisible"
      width="550px"
      @close="setState({
        subPressureModalVisible: false
      })"
    >
      <div slot="footer" class="dialog-footer">
        <div class="number-box floor-box-container nav-form">
          <span class="title modal-label">目标压差：</span>
          <el-input-number
            v-model="subDestPressure"
            placeholder="请输入目标压差"
            controls-position="right"
            :min="0"
            :step="1"
          />
        </div>
        <el-button v-hasAuth="'buildingPigHouse:subConfig'" class="btn-blue" @click="handleSubPressureOk">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 批量开启和关闭 -->
    <el-dialog
      :modal="false"
      :modal-append-to-body="false"
      :title="`批量${roofMultiOpen ? '开启' : '关闭'}`"
      :close-on-click-modal="false"
      :visible.sync="visible_duration"
      width="550px"
      @close="setState({
        roofMultiOpen: false,
        roofMultiClose: false,
        roofChecked: [],
        visible_duration: false,
      })"
    >
      <div class="number-box floor-box-container  nav-form">
        <span class="title modal-label">生效时长（分）</span>
        <el-input-number
          v-model="duration"
          controls-position="right"
          :min="0"
          :step="1"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-hasAuth="'buildingPigHouse:control_RoofMain'" class="btn-blue" @click="roofMultiOptOk">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 主控制器补水控制 -->
    <el-dialog
      :modal="false"
      :modal-append-to-body="false"
      title="主控制器补水控制"
      :close-on-click-modal="false"
      :visible.sync="visible_main_duration"
      width="550px"
      @close="setState({
        visible_main_duration: false,
        duration_water: null,
      })"
    >
      <div class="number-box floor-box-container nav-form">
        <span class="title modal-label">生效时长（分）</span>
        <el-input-number
          v-model="duration_water"
          controls-position="right"
          :min="0"
          :step="1"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-hasAuth="'buildingPigHouse:control_RoofMain'" class="btn-blue" @click="controlInstruct">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 主控制器补水开启时间/关闭时间设置 -->
    <el-dialog
      :modal="false"
      :modal-append-to-body="false"
      title="主控制器补水开启时间/关闭时间设置"
      :close-on-click-modal="false"
      :visible.sync="visible_main_date"
      width="550px"
      @close="setState({
        visible_main_date: false,
        enable_open: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].enable : null,
        openTime: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].openTime : null,
        closeTime: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].closeTime : null
      })"
    >
      <div class="number-box nav-form turn-box">
        <span class="turn-on">开关</span>
        <span class="turn-radio-box">
          <el-radio-group v-model="enable_open">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </span>
      </div>
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
        <el-button v-hasAuth="'buildingPigHouse:param_RoofMain'" class="btn-blue" @click="paramInstruct">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 主控制器排水开启时间/关闭时间设置 -->
    <el-dialog
      :modal="false"
      :modal-append-to-body="false"
      title="主控制器排水开启时间/关闭时间设置"
      :close-on-click-modal="false"
      :visible.sync="visible_main_pop_water"
      width="550px"
      @close="setState({
        visible_main_pop_water: false,
        pop_enable_open: roofData.main && roofData.main.drainageWaterConfig && roofData.main.drainageWaterConfig.entrys.length > 0 ? roofData.main.drainageWaterConfig.entrys[0].enable : null,
        pop_openTime: roofData.main && roofData.main.drainageWaterConfig && roofData.main.drainageWaterConfig.entrys.length > 0 ? roofData.main.drainageWaterConfig.entrys[0].openTime : null,
        pop_closeTime: roofData.main && roofData.main.drainageWaterConfig && roofData.main.drainageWaterConfig.entrys.length > 0 ? roofData.main.drainageWaterConfig.entrys[0].closeTime : null
      })"
    >
      <div class="nav-form">
        <div class="number-box nav-form turn-box">
          <span class="turn-on">开关</span>
          <span class="turn-radio-box">
            <el-radio-group v-model="pop_enable_open">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </span>
        </div>
        <div class="number-box nav-form">
          <div class="time-box">
            <div class="time-title">开启时间（时:分）</div>
            <div class="tiem-picker-wrap">
              <el-time-picker
                v-model="pop_openTime"
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
                v-model="pop_closeTime"
                value-format="HH:mm"
                format="HH:mm"
                placeholder="选择关闭时间"
              />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-hasAuth="'buildingPigHouse:param_RoofMain'" class="btn-blue" @click="popParamInstruct">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 自定义设置 -->
    <el-dialog
      :modal="false"
      :modal-append-to-body="false"
      title="自定义设置"
      :close-on-click-modal="false"
      :visible.sync="custom"
      width="550px"
      @close="custom = false"
    >
      <div class="custom-modal-content-box nav-form">
        <div class="modal_check" style="width: 300px;"><span>单元数据设置</span><span>（取消勾选则不显示）</span></div>
        <div class="check-box-wrap">
          <el-checkbox-group v-model="modalParams">
            <div v-for="(item) in allModalParams" :key="item" class="modal_check">
              <el-checkbox :label="item">
                <span>{{ item }}</span>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
        <div slot="footer" class="footer-box">
          <el-button class="btn-border" style="margin-right:10px;" @click="custom = false">取消</el-button>
          <el-button class="btn-blue" @click="handleCustomModalCancel">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 楼层猪舍类型 -->
    <el-dialog
      :modal="false"
      :modal-append-to-body="false"
      title="楼层猪舍类型"
      :close-on-click-modal="false"
      :visible.sync="SFModal"
      width="550px"
      @close="handleSFModalCancel"
    >
      <div class="house-modal-content-box nav-form">
        <div>
          <div class="house-type"><span>猪舍类型</span></div>
          <div class="house-modal-type">
            <el-checkbox-group v-model="segmentChecked" @change="filterSegmentChange">
              <div v-for="(item) in allSegment" :key="item.roomTypeId" class="modal_check">
                <el-checkbox :label="item.roomTypeId" :disabled="isOperate(item.roomTypeId, enableSegment, 'segment')">
                  <span style="color: #CDD8F7;">{{ item.roomTypeName }}</span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
        <div>
          <div class="house-type"><span>楼层</span></div>
          <div class="house-modal-type">
            <el-checkbox-group v-model="chooseTempFloor" @change="filterFloorChange">
              <div v-for="(item) in allFloor" :key="item" class="modal_check">
                <el-checkbox :label="item" :disabled="isOperate(item, enableFloor, 'floor')">
                  <span style="color: #CDD8F7;">{{ floorMap[item] }}</span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button class="btn-blue" @click="handleSFModalOk">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 发送指令 -->
    <el-dialog
      :modal="false"
      :modal-append-to-body="false"
      title="发送指令"
      :close-on-click-modal="false"
      :visible.sync="instructModalVisible"
      width="500px"
      @close="handleInstructModalCancel"
    >
      <div class="instruct-modal-content general-form">
        <div class="selected-unit">
          <div class="selected-unit-instruct-title">
            已选单元
          </div>
          <div class="selected-box">
            <span v-for="(tag,i) in selectedUnits" :key="i" class="single-unit">
              <span class="unit-text">{{ `${tag.segmentName}${tag.unit}` }}</span>
              <!-- <i class="el-icon-close cur" /> -->
            </span>
          </div>
        </div>
        <div class="select-content-box">
          <div class="row-box">
            <div class="content-single-box">
              <span class="desc-single">
                生效时长
              </span>
              <div class="input-box">
                <!-- @change="changeModalValue(item.event)" -->
                <el-input-number
                  v-model="unit_duration"
                  controls-position="right"
                  :min="0"
                />
              </div>
            </div>
            <div class="content-single-box">
              <span class="desc-single">
                <el-checkbox v-model="isCheckedLevel4" style="color:#CDD8F7">四级开度</el-checkbox>
              </span>
              <div class="input-box">
                <el-input-number
                  v-model="level4"
                  controls-position="right"
                  :min="0"
                />
              </div>
            </div>
          </div>
          <div class="row-box">
            <div class="content-single-box">
              <span class="desc-single">
                <el-checkbox v-model="isCheckedBacTemp" style="color:#CDD8F7">后温度补偿(℃)</el-checkbox>
              </span>
              <div class="input-box">
                <el-input-number
                  v-model="backTemp"
                  controls-position="right"
                  :min="0"
                />
              </div>
            </div>
            <div class="content-single-box">
              <span class="desc-single">
                <el-checkbox v-model="isCheckedFroTemp" style="color:#CDD8F7">前温度补偿(℃)</el-checkbox>
              </span>
              <div class="input-box">
                <el-input-number
                  v-model="frontTemp"
                  controls-position="right"
                  :min="0"
                />
              </div>
            </div>
          </div>
          <div class="row-box">
            <div class="content-single-box">
              <span class="desc-single">
                <el-checkbox v-model="isCheckedLevel0" style="color:#CDD8F7">0级开度(%)</el-checkbox>
              </span>
              <div class="input-box">
                <el-input-number
                  v-model="level0"
                  controls-position="right"
                  :min="0"
                />
              </div>
            </div>
            <div class="content-single-box">
              <span class="desc-single">
                <el-checkbox v-model="isCheckedLevelHotExchange" style="color:#CDD8F7">热交换开度(%)</el-checkbox>
              </span>
              <div class="input-box">
                <el-input-number
                  v-model="levelHotExchange"
                  controls-position="right"
                  :min="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button class="btn-border" @click="handleInstructModalCancel">取消</el-button>
        <el-button v-hasAuth="'buildingPigHouse:controlParamMulti_Room'" class="btn-blue" @click="handleInstructModalOk">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-loading="exportLoading"
      :modal="false"
      :modal-append-to-body="false"
      title="风机明细导出"
      :close-on-click-modal="false"
      :visible.sync="fandialogVisible"
      width="550px"
      @close="setState({
        fandialogVisible: false,
      })"
    >
      <div class="nav-form">
        <el-date-picker
          v-model="exportFanDates"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn-blue" style="margin-top: 10px;" @click="confirmExport">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 工作配置 -->
    <el-dialog
      :modal="true"
      :modal-append-to-body="false"
      title="工作配置"
      :close-on-click-modal="false"
      :visible.sync="configDialog"
      width="700px"
      @close="closeConfigDialog"
    >
      <div class="body">
        <general-form
          ref="Configdelog"
          label-width="200px"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :list-type-info="listTypeInfo"
          theme-type="default"
        />
      </div>
      <div slot="footer" class="dialog-footer label73">
        <div style="margin:0 auto;">
          <el-button class="btn-border canleButton" @click="closeConfigDialog">取 消</el-button>
          <el-button class="btn-blue" :loading="configLoading" @click="doConfig">下发</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import searchForm from '@/components/commonComponent/navForm'
import generalForm from '@/components/commonComponent/generalForm'
import { getPageData } from './fields'
// import noData from '@/assets/image/page/noData.png'
import zaixian from '@/assets/image/pighouse/在线.png'
import kaiguan from '@/assets/image/pighouse/开关.png'
import offKaiguan from '@/assets/image/pighouse/offline-kaiguan.png'
import shijian from '@/assets/image/pighouse/时间.png'
import guanbi from '@/assets/image/pighouse/关闭.png'
import kaiqi from '@/assets/image/pighouse/开启.png'
import baojing from '@/assets/image/pighouse/报警.png'
import shezhi from '@/assets/image/pighouse/设置.png'
import giveWater from '@/icons/svg/give-water.svg'
import xingzhuang from '@/assets/image/pighouse/形状.svg'
import FloorBox from './components/floor-box/FloorBox'
import InfoBox from './components/info-box/InfoBox'
import tableView from './components/tableView'
import { getConfigElement } from '@/utils/overtService'
import { derive } from '@/http/api/exportData/export'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import './house.scss'
const pageElement = getConfigElement('buildingPigHouse')
const roofModeList = [
  { value: 0, title: '未知' },
  { value: 1, title: '停止' },
  { value: 2, title: '普通' },
  { value: 3, title: '手动' },
  { value: 4, title: '智能' }
]
let message = null
let interval = null
export default {
  components: {
    searchForm,
    generalForm,
    FloorBox,
    InfoBox,
    tableView
  },
  data() {
    message = this.$message
    return {
      configLoading: false,
      configDialog: false, // 工作配置框
      listTypeInfo: {
      },
      formInfo: { // 工作配置 表单
        data: {
          roofMode: 0, // 工作模式
          openGear: '', // 挡位
          pressureAdjust: '' // 校准压差（单位：Pa）
        },
        fieldList: [
          {
            label: '工作模式',
            key: 'roofMode',
            type: 'radio',
            className: 'shadow',
            filterable: true,
            customVal: 'value',
            customLabel: 'title',
            optList: roofModeList,
            required: true,
            rules: [{ required: true, message: '请选择工作模式', trigger: 'change' }],
            handleChange: (data) => {
            }
          },
          {
            label: '档位（0 ~ 84）', // 0 ~ 84
            key: 'openGear',
            type: 'inputNumber',
            className: 'shadow',
            controlsPositionRight: 'right',
            filterable: true,
            placeholder: '请输入档位',
            min: 0,
            max: 84,
            required: true,
            rules: [{ required: true, message: '请输入档位', trigger: 'change' }],
            handleChange: (data) => {
              console.log(data)
            }
          },
          {
            label: '校准压差（单位:Pa，-30 ~ 30）',
            key: 'pressureAdjust',
            type: 'inputNumber',
            className: 'shadow',
            controlsPositionRight: 'right',
            filterable: true,
            placeholder: '请输入校准压差',
            min: -30,
            max: 30,
            required: true,
            rules: [{ required: true, message: '请输入校准压差', trigger: 'change' }],
            handleChange: (data) => {
              console.log(data)
            }
          }
        ]
      },
      reStartLoading: false,
      exportFanDates: [],
      noData: '',
      kaiguan,
      shezhi,
      offKaiguan,
      zaixian,
      giveWater,
      shijian,
      guanbi,
      kaiqi,
      xingzhuang,
      baojing,
      viewPage: 'box',
      filterValue: 'unit',
      filterOptions: [
        {
          value: 'unit',
          label: '单元'
        },
        {
          value: 'comfort',
          label: '舒适度'
        },
        {
          value: 'beforeIndoorTemp',
          label: '室内前温度'
        },
        {
          value: 'beforeIndoorHumidity',
          label: '室内前湿度'
        },
        {
          value: 'afterIndoorTemp',
          label: '室内后温度'
        },
        {
          value: 'afterIndoorHumidity',
          label: '室内后湿度'
        }
      ],
      minTemp: null, // 最低温度
      maxTemp: null, // 最高温度
      minAge: null, // 最短日龄
      maxAge: null, // 最长日龄
      exportLoading: false,
      ...getPageData(this),
      windTimer: null,
      windNumb: 0
    }
  },
  computed: {
    wrapHeight() {
      if (this.roofData && this.selectedOption.length === 3) {
        if (this.activeTab === 'RoofPlan') {
          return { height: 'calc(100vh - 228px)' }
        } else {
          return { height: 'calc(100vh - 185px)' }
        }
      } else {
        return { height: 'calc(100vh - 185px)' }
      }
    },
    ...mapGetters(['sidebar', 'fullScreen']),
    isfullScreen() {
      return this.fullScreen
    },
    isRoofMultiOpt() { // 批量开/关
      return (this.roofMultiOpen || this.roofMultiClose)
    },
    isShowFloorBlock() {
      return this.activeTab !== 'RoofPlan'
    },
    isFloorBlockHasData() {
      return this.selectedOption.length === 3 && this.deviceData && this.deviceData.deviceList && this.deviceData.deviceList.length > 0
    },
    selectedUnits() {
      const { deviceData, checkedObj } = this.$data
      return deviceData && deviceData.deviceList && deviceData.deviceList.length > 0 && deviceData.deviceList.filter((data, index) => {
        if (checkedObj[data.deviceId]) {
          return true
        }
      })
    },
    ...mapState({
      'buildingPigHouseParam': (state) => state.buildPigHouse.buildingPigHouseParam
    })
  },
  created() {
    // eslint-disable-next-line no-irregular-whitespace
    // this.noData = this.$getImgUrl('noData', 'svg')
  },
  mounted() {
    this.setOption()
  },
  beforeRouteLeave(to, form, next) {
    clearTimeout(this.windTimer)
    next()
  },
  methods: {
    closeConfigDialog() {
      this.configDialog = false
      this.formInfo.data = {
        ...this.fansMgrConfig
      }
    },
    // 工作配置 下发
    doConfig() {
      if (!this.$refs['Configdelog'].validateSelf()) {
        return false
      }
      const element = pageElement['param_RoofMain']
      const { deviceId, deviceName } = this.roofData.main
      const params = {
        fansMgrConfig: this.formInfo.data
      }
      this.configLoading = true
      this.$httpRequest({
        type: element?.method,
        uri: element?.uri + `?deviceId=${deviceId}&deviceName=${deviceName}`,
        payload: params,
        callback: (res) => {
          this.configLoading = false
          if (res.status === 200 && res.rel) {
            this.configDialog = false
            this.$message.success('下发成功')
          } else if (res.status === 200 && !res.rel) {
            this.formInfo.data = {
              ...this.fansMgrConfig
            }
            this.$message.error(res.message)
          }
        }
      })
    },
    // 重启主控制器
    reStart() {
      this.$confirm('此操作将重启该主控制器, 是否继续?', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'btn-blue btn-blue-confirm',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const element = pageElement['mainSelfControl']
        const { deviceId, deviceName } = this.roofData.main
        this.reStartLoading = true
        this.$httpRequest({
          type: element?.method,
          uri: element?.uri + '/DevReboot' + `?deviceId=${deviceId}&deviceName=${deviceName}`,
          callback: (res) => {
            this.reStartLoading = false
            if (res.status === 200 && res.rel) {
              this.$message.success('下发成功')
            } else if (res.status === 200 && !res.rel) {
              this.$message.error('下发失败')
            }
          }
        })
      }).catch(() => {})
    },
    checkFullScreen() {
      this.$store.dispatch('checkFullScreen')
    },
    checkTableChange(selection) {
      console.log(selection)
      const obj = { ...this.checkedObj }
      if (selection.length > 0) {
        const length = this.filterData(this.deviceData.deviceList, this.activeItem, this.activeTab, this.chooseFloor, this.chooseSegment).length
        if (selection.length === length) {
          this.checkAllChange(true)
        } else {
          for (const key in obj) {
            const index = selection.map((item) => { return item.deviceId }).indexOf(key)
            if (index !== -1) {
              obj[key] = true
            } else {
              obj[key] = false
            }
          }
          this.checkedObj = obj
          console.log(this.checkedObj)
        }
      } else {
        // for (const key in this.checkedObj) {
        //   obj[key] = false
        // }
        // this.checkedObj = obj
        this.checkAllChange(false)
      }
    },
    switchViewPage() {
      this.viewPage = this.viewPage === 'table' ? 'box' : 'table'
    },
    // confirmExport() { // 风机明细导出
    //   if (this.exportFanDates && this.exportFanDates.length) {
    //     const url = '/api/unit_evc/myEvcRoofFanInfo/export'
    //     derive(
    //       url,
    //       {
    //         endTime: this.exportFanDates[1],
    //         startTime: this.exportFanDates[0],
    //         fieldId: this.selectedOption[2],
    //         fieldName: this.selectedLabel[2]
    //       }
    //     )
    //     this.fandialogVisible = false
    //   }
    // },
    confirmExport() { // 风机明细导出 初始化
      // if (this.exportFanDates && this.exportFanDates.length) {
      //   const url = '/api/unit_evc/myEvcRoofFanInfo/export'
      //   derive(
      //     url,
      //     {
      //       endTime: this.exportFanDates[1],
      //       startTime: this.exportFanDates[0],
      //       fieldId: this.selectedOption[2],
      //       fieldName: this.selectedLabel[2]
      //     }
      //   )
      //   this.fandialogVisible = false
      // }
      if (this.exportFanDates && this.exportFanDates.length) {
        const data = {
          endTime: this.exportFanDates[1],
          startTime: this.exportFanDates[0],
          fieldId: this.selectedOption[2],
          fieldName: this.selectedLabel[2]
        }
        this.exportLoading = true
        this.$httpRequest({
          type: 'GET',
          uri: '/unit_evc/myEvcRoofFanInfo/exportV1',
          payload: data,
          callback: (res) => {
            this.fandialogVisible = false
            if (res && res.status === 200 && res.rel) {
              this.confirmExportDown()
            } else {
              this.exportLoading = false
              this.$message.error(res.message)
            }
          }
        })
      }
    },
    // 导出
    confirmExportDown() {
      this.exportLoading = true
      if (this.windNumb >= 60) {
        this.exportLoading = false
        this.windNumb = 0
        clearTimeout(this.windTimer)
        return
      }
      const data = {
        endTime: this.exportFanDates[1],
        startTime: this.exportFanDates[0],
        fieldId: this.selectedOption[2],
        fieldName: this.selectedLabel[2]
      }
      this.$httpRequest({
        type: 'GET',
        uri: '/unit_evc/myEvcRoofFanInfo/file/url',
        payload: data,
        callback: (res) => {
          this.windNumb++
          if (res && res.status === 200) {
            if (res.rel) {
              this.windNumb = 0
              clearTimeout(this.windTimer)
              this.exportLoading = false
              window.open(res.data.downloadUrl)
            } else {
              this.windTimer = setTimeout(() => {
                this.confirmExportDown()
              }, 1000)
            }
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    handleFanExport() { // 风机明细导出
      const start = this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
      const end = this.$moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      this.exportFanDates = [start, end]
      this.fandialogVisible = true
    },
    roofMultiOptOkModal() {
      const { main } = this.roofData
      if (main.isOnline !== 1) {
        message.error('当前设备已离线')
        return
      }
      this.setState({
        visible_duration: true
      })
    },
    roofMultiOptCancel() {
      this.setState({
        roofMultiOpen: false,
        roofMultiClose: false,
        roofChecked: [],
        visible_duration: false
      })
    },
    setOption() {
      const _self = this
      const dataInterfacePageElement = getConfigElement('unit-evcDataInterface')
      this.$httpRequest({
        type: 'get',
        payload: {
          isBuilding: true
        },
        uri: dataInterfacePageElement.getRegionAreaFieldTree && dataInterfacePageElement.getRegionAreaFieldTree.uri,
        callback: (data) => {
          if (data.rel) {
            _self.navFormInfo.fieldList.left.inpLists[0].options = data.data
            _self.submitOption()
          }
        }
      })

      if (!this.buildingPigHouseParam || JSON.stringify(this.buildingPigHouseParam) === '{}') {
        return
      } else {
        this.setState({
          ...this.buildingPigHouseParam,
          memoryParam: {
            ...this.buildingPigHouseParam
          }
        }, () => {
          this.navFormInfo.data.cascader = this.selectedOption
          this.selectedOption.length === 3 && this.submitOption()
        })
      }
    },
    submitOption() {
      if (this.selectedOption.length === 3) {
        if (this.activeTab === 'RoofPlan') {
          this.getRoofPlanData(this.selectedOption) // 获取楼顶界面数据
        } else {
          this.getBlockData(this.selectedOption, this.activeTab) // 获取场区概览列表数据
        }
      } else {
        this.setState({
          loaded: true,
          deviceData: null,
          allSegment: [],
          allFloor: [],
          enableSegment: [], // 可操作的工段
          enableFloor: [] // 可操作的楼层
        })
      }
    },
    // 选择单元加载数据
    handleEvent() {
      let cascader = {}
      if (this.$refs['cascader'].getCheckedNodes().length !== 0) {
        cascader = this.$refs['cascader'].getCheckedNodes()[0]
      } else {
        cascader.path = this.$refs['cascader'].checkedValue
        cascader.pathLabels = []
        cascader.pathLabels = event.path[0].innerText
          .replace(/\s*/g, '')
          .split('/')
      }
      this.selectedOption = cascader.path // value 值的集合
      this.selectedLabel = cascader.pathLabels // 选择的label的集合
      this.setState({
        memoryParam: {
          selectedOption: cascader.path,
          selectedLabel: cascader.pathLabels
        }
      }, () => {
        this.setMemory('buildingPigHouseParam', { ...this.memoryParam })
      })
      this.submitOption()
    },
    getBlockData(selectedOption, block) { // 获取场区概览列表数据
      const _self = this
      this.setState({
        loaded: false
      }, () => {
        this.$httpRequest({
          type: 'get',
          payload: {
            fieldId: selectedOption[2],
            block
          },
          uri: pageElement.getDevicesByFieldForBuilding && pageElement.getDevicesByFieldForBuilding.uri,
          callback: (res) => {
            if (!res.rel) {
              _self.loaded = true
              return
            }
            const data = res.data.deviceList ? res.data.deviceList : []
            const obj_segment = {}
            const obj_floor = {}
            const arr_segment = []
            const arr_floor = []
            data.forEach((item) => {
              if (Object.keys(obj_segment).indexOf(item.roomTypeId) === -1) {
                const obj = {
                  'block': item.block,
                  'floor': item.floor,
                  'segmentName': item.segmentName,
                  'segmentId': item.segmentId,
                  'roomTypeId': item.roomTypeId,
                  'roomTypeName': item.roomTypeName
                }
                arr_segment.push(obj)
              }
              if (Object.keys(obj_floor).indexOf(item.floor) === -1 && item.floor) {
                arr_floor.push(item.floor)
              }
              obj_segment[item.roomTypeId] = item.roomTypeId
              obj_floor[item.floor] = item.floor
            })
            const { chooseSegment, chooseFloor } = _self.$data
            _self.setState({
              loaded: true,
              deviceData: res.data,
              // deviceData: data2.data,
              allSegment: arr_segment,
              allFloor: arr_floor,
              enableSegment: arr_segment, // 可操作的工段
              enableFloor: arr_floor, // 可操作的楼层
              chooseSegment: arr_segment.filter((segment) => {
                let flag = false
                chooseSegment.forEach((item) => {
                  if (segment.roomTypeId === item.roomTypeId) {
                    flag = true
                  }
                })
                return flag
              }),
              chooseFloor: arr_floor.filter((item) => {
                let flag = false
                chooseFloor.forEach((floor) => {
                  if (floor === item.floor) {
                    flag = true
                  }
                })
                return flag
              })
            })
          }
        })
      })
    },
    getRoofPlanData() { // 获取楼顶界面数据
      this.loaded = false
      const _self = this
      this.$httpRequest({
        type: 'get',
        payload: {
          fieldId: _self.selectedOption[2]
        },
        uri: pageElement.getLastestRoofStatusData && pageElement.getLastestRoofStatusData.uri,
        callback: (res) => {
          console.log('// 获取楼顶界面数据----', res)
          if (res.rel) {
            const { main = {}} = res.data
            _self.setState({
              roofData: res.data,
              loaded: true,
              enable_open: main && main.replenishWaterConfig && main.replenishWaterConfig.entrys.length > 0 ? main.replenishWaterConfig.entrys[0].enable : null,
              openTime: main && main.replenishWaterConfig && main.replenishWaterConfig.entrys.length > 0 ? main.replenishWaterConfig.entrys[0].openTime : null,
              closeTime: main && main.replenishWaterConfig && main.replenishWaterConfig.entrys.length > 0 ? main.replenishWaterConfig.entrys[0].closeTime : null,
              pop_enable_open: main && main.drainageWaterConfig && main.drainageWaterConfig.entrys.length > 0 ? main.drainageWaterConfig.entrys[0].enable : null,
              pop_openTime: main && main.drainageWaterConfig && main.drainageWaterConfig.entrys.length > 0 ? main.drainageWaterConfig.entrys[0].openTime : null,
              pop_closeTime: main && main.drainageWaterConfig && main.drainageWaterConfig.entrys.length > 0 ? main.drainageWaterConfig.entrys[0].closeTime : null,
              waterpressSensorPressure1: main && main.waterpressSensorPressure1 ? main.waterpressSensorPressure1 : null,
              waterpressSensorPressure2: main && main.waterpressSensorPressure2 ? main.waterpressSensorPressure2 : null

            }, () => {
              const { main } = _self.roofData
              main && main.deviceId && _self.getLastReportData(main.deviceId)
            })
          } else {
            message.error('获取楼顶数据失败！')
            _self.setState({
              loaded: true
            })
          }
        }
      })
    },
    handleSubPressureOk() {
      const { roofData, activeDev, subDestPressure } = this.$data
      const subDev = roofData && roofData[activeDev] ? roofData[activeDev] : {}
      const deviceId = subDev.deviceId ? subDev.deviceId : null
      const deviceName = subDev.deviceName ? subDev.deviceName : null
      if (deviceId && deviceName) {
        if (!this.valueExist(subDestPressure)) {
          message.error('目标压差不能为空')
          return
        } else {
          this.$httpRequest({
            type: 'put',
            payload: { destPressure: subDestPressure },
            uri: pageElement.subConfig && pageElement.subConfig.uri + `?deviceId=${deviceId}&deviceName=${deviceName}`,
            callback: (res) => {
              if (res && res.rel) {
                message.success(res.message || '指令下发成功')
              } else {
                message.error(res.message || '指令下发失败')
              }
              this.submitOption()
              this.setState({
                subPressureVisible: false,
                subPressureModalVisible: false
              }, () => {
                interval = setInterval(() => { // 设置定时器
                  this.loadbar(interval)
                }, 1000)
              })
            }
          })
        }
      } else {
        message.error('当前设备不存在！')
        this.setState({
          subPressureVisible: false,
          subPressureModalVisible: false
        })
        return
      }
    },
    // 初始化a/b座指令参数
    initInstrucModal() {
      const obj = {
        isCheckedBacTemp: false, // 是否选中后温度补偿
        isCheckedFroTemp: false, // 是否选中前温度补偿
        isCheckedLevel0: false, // 是否选中0级开度
        isCheckedLevel4: false, // 是否选中4级开度
        isCheckedLevelHotExchange: false, // 是否选中热交换开度
        backTemp: undefined, // 后温度补尝
        frontTemp: undefined, // 前温度补偿
        level0: undefined, // 0级开度
        level4: undefined, // 4级开度
        levelHotExchange: undefined, // 热交换开度
        checkedInstructSegment: [], // 指令下发选中的工段
        unit_duration: undefined
      }
      return obj
    },
    // 批量操作下发指令
    handleInstructModalOk() {
      const _self = this
      const {
        isCheckedBacTemp, // 是否选中后温度补偿
        isCheckedFroTemp, // 是否选中前温度补偿
        isCheckedLevel0, // 是否选中0级开度
        isCheckedLevel4, // 是否选中4级开度
        backTemp, // 后温度补尝
        frontTemp, // 前温度补偿
        level0, // 0级开度
        level4, // 4级开度
        levelHotExchange,
        isCheckedLevelHotExchange,
        checkedObj, // 指令下发选中的工段
        deviceData,
        unit_duration
      } = this.$data
      if (!this.valueExist(unit_duration)) {
        return message.error('请输入生效时长!')
      }
      const frontTemp_obj = isCheckedFroTemp ? { 'tempCalibrationValue': frontTemp === undefined ? null : frontTemp } : {}
      const backTemp_obj = isCheckedBacTemp ? { 'tempCalibrationValue': backTemp === undefined ? null : backTemp } : {}
      const config = {
        'indoorBefore': {
          ...frontTemp_obj
        },
        'indoorAfter': {
          ...backTemp_obj
        }
      }
      const level0_obj = {
        'iPig3SRoomMcuDevCtrlType': 'AirInlet',
        'percent': level0 === undefined ? null : level0,
        duration: unit_duration === undefined ? null : unit_duration
      }
      const level4_obj = {
        'iPig3SRoomMcuDevCtrlType': 'AirOutlet',
        'percent': level4 === undefined ? null : level4,
        duration: unit_duration === undefined ? null : unit_duration
      }
      const levelHotExchange_obj = {
        'iPig3SRoomMcuDevCtrlType': 'HotExchange',
        'percent': levelHotExchange === undefined ? null : levelHotExchange,
        duration: unit_duration === undefined ? null : unit_duration
      }
      const arr = []
      isCheckedLevel0 && arr.push(level0_obj)
      isCheckedLevel4 && arr.push(level4_obj)
      isCheckedLevelHotExchange && arr.push(levelHotExchange_obj)
      const fieldId = deviceData.deviceList && deviceData.deviceList.length > 0 ? deviceData.deviceList[0].fieldId : null
      const fieldName = deviceData.deviceList && deviceData.deviceList.length > 0 ? deviceData.deviceList[0].fieldName : null
      let unitNames = []
      let deviceNames = []
      if (deviceData && deviceData.deviceList && deviceData.deviceList.length > 0) {
        const arr_selected = [...deviceData.deviceList.filter((data, index) => {
          if (checkedObj[data.deviceId]) {
            return true
          }
        })]
        unitNames = [...arr_selected].map((item, index) => {
          return `${item.segmentName}${item.unit}`
        })
        deviceNames = [...arr_selected].map((item, index) => {
          return item.deviceName
        })
      }
      if (deviceNames.length < 1) {
        message.error('请选择下发指令的设备')
        return
      }
      const param = {
        fieldId,
        fieldName,
        unitNames,
        deviceNames,
        config,
        ctrl: arr
      }
      this.$httpRequest({
        type: 'put',
        payload: param,
        uri: pageElement.controlParamMulti_Room && pageElement.controlParamMulti_Room.uri,
        callback: (res) => {
          if (res && res.rel) {
            message.success(res.message || '指令下发成功！')
          } else {
            message.error('指令下发失败！')
          }
          _self.setState({
            roofMultiOpen: false,
            roofMultiClose: false,
            isMulti: false,
            roofChecked: [],
            checkedObj: _self.initCheckedObj(deviceData.deviceList),
            isCheckedBacTemp: false, // 是否选中后温度补偿
            isCheckedFroTemp: false, // 是否选中前温度补偿
            isCheckedLevel0: false, // 是否选中0级开度
            isCheckedLevel4: false, // 是否选中4级开度
            isCheckedLevelHotExchange: false, // 是否选中热交换开度
            backTemp: undefined, // 后温度补尝
            frontTemp: undefined, // 前温度补偿
            level0: undefined, // 0级开度
            level4: undefined, // 4级开度
            levelHotExchange: undefined, // 热交换开度
            checkedInstructSegment: [], // 指令下发选中的工段
            unit_duration: undefined
          }, () => {
            _self.submitOption()
          })
        }
      })
      const obj = _self.initInstrucModal()
      _self.setState({
        instructModalVisible: false,
        ...obj
      })
    },
    handleInstructModalCancel() {
      const obj = this.initInstrucModal()
      this.setState({
        instructModalVisible: false,
        ...obj
      })
    },
    // a/b座工段下拉弹窗显示隐藏
    showSFModal(val) {
      this.setState({
        SFModal: true,
        houseItem: val
      })
    },
    // a/b座工段下拉弹窗关闭/取消事件
    handleSFModalCancel() {
      const { chooseSegment, chooseFloor } = this.$data
      this.setState({
        SFModal: false,
        chooseTempSegment: [...chooseSegment],
        chooseTempFloor: [...chooseFloor]
      }, () => {
        this.setEnableSF('setEnableSegment', chooseFloor, chooseSegment)
        this.setEnableSF('setEnableFloor', chooseFloor, chooseSegment)
      })
    },
    // 是否可操作 可操作返回false，不可操作返回true
    isOperate(param, arr, type) {
      if (arr.length > 0) {
        if (type === 'segment') {
          let flag = false
          arr.forEach((item) => { // 判断工段在不在可选工段数组
            if (item.roomTypeId === param) {
              flag = true
            }
          })
          return !flag
        } else if (type === 'floor') {
          if (arr.indexOf(param) !== -1) {
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // a/b座工段下拉弹窗确定事件 记录操作
    handleSFModalOk() {
      const { chooseTempFloor, chooseTempSegment, memoryParam } = this.$data
      this.setState({
        SFModal: false,
        chooseSegment: [...chooseTempSegment],
        chooseFloor: [...chooseTempFloor],
        memoryParam: {
          ...memoryParam,
          chooseSegment: [...chooseTempSegment],
          chooseFloor: [...chooseTempFloor]
        }
      }, () => {
        this.setMemory('buildingPigHouseParam', { ...this.memoryParam })
      })
    },
    // 楼层选择改变
    filterFloorChange(value) {
      this.setEnableSF('setEnableSegment', value, [])
    },
    // 工段选择改变
    filterSegmentChange(value) {
      const allArr = []
      this.allSegment.forEach(a => {
        value.forEach(v => {
          if (a.roomTypeId === v) {
            allArr.push(a)
          }
        })
      })
      this.chooseTempSegment = [...allArr]
      this.setEnableSF('setEnableFloor', [], allArr)
    },
    setEnableSF(type, floors, segments) {
      const { activeTab, activeItem, deviceData, chooseSegment, chooseTempSegment, chooseFloor, chooseTempFloor } = this.$data
      if (deviceData && deviceData.deviceList && deviceData.deviceList.length > 0) {
        const data = this.filterData(deviceData.deviceList, activeItem, activeTab, floors, segments)
        if (type === 'setEnableSegment') {
          this.setState({
            enableSegment: [...data].map((item) => {
              return {
                'block': item.block,
                'floor': item.floor,
                'segmentName': item.segmentName,
                'segmentId': item.segmentId,
                'roomTypeId': item.roomTypeId,
                'roomTypeName': item.roomTypeName
              }
            }),
            chooseSegment: chooseSegment.filter((item) => {
              let flag = false
              data.forEach((segment) => {
                if (item.roomTypeId === segment.roomTypeId) {
                  flag = true
                }
              })
              return flag
            }),
            chooseTempSegment: chooseTempSegment.filter((item) => {
              let flag = false
              data.forEach((segment) => {
                if (item.roomTypeId === segment.roomTypeId) {
                  flag = true
                }
              })
              return flag
            })
          })
        } else {
          this.setState({
            enableFloor: [...data].map((item) => { return item.floor }),
            chooseFloor: chooseFloor.filter((item) => {
              let flag = false
              data.forEach((floor) => {
                if (item === floor.floor) {
                  flag = true
                }
              })
              return flag
            }),
            chooseTempFloor: chooseTempFloor.filter((item) => {
              let flag = false
              data.forEach((floor) => {
                if (item === floor.floor) {
                  flag = true
                }
              })
              return flag
            })
          })
        }
      } else {
        this.setState({
          enableSegment: [],
          enableFloor: []
        })
      }
    },
    // 指令全选操作
    checkAllChange(val) {
      console.log(val)
      const { checkedObj, deviceData: { deviceList }} = this.$data
      const { ...obj } = checkedObj
      if (val) {
        if (deviceList && deviceList.length > 0) {
          deviceList.forEach((item) => {
            if (item.statusOnline === 1) { // 过滤出在线的设备
              obj[item.deviceId] = true
            }
          })
        }
      } else {
        Object.keys(obj).forEach((item, index) => {
          obj[item] = false
        })
      }
      this.setState({
        checkedObj: {
          ...obj
        },
        checkAll: val
      })
    },
    // a/b座批量操作按钮事件
    batchOperate(flag) {
      const { deviceData } = this.$data
      this.setState({
        isMulti: flag,
        checkedObj: flag ? this.initCheckedObj(deviceData.deviceList) : {}
      })
      if (!flag) {
        this.checkAll = flag
      }
    },
    // a/b座下发指令弹出指令弹窗
    instruct() {
      this.setState({
        instructModalVisible: true
      })
    },
    handleCustomModal() {
      const { showParams } = this.$data
      this.setState({
        custom: true,
        modalParams: [...showParams]
      })
    },
    initCheckedObj(arr) {
      const obj = {}
      if (arr && arr.length > 0) {
        arr.forEach((item, index) => {
          obj[item.deviceId] = false
        })
        return obj
      } else {
        return null
      }
    },
    exportFileData() {
      const { selectedOption } = this.$data
      if (selectedOption.length < 3) {
        message.error('请先选择场区！')
      }
      const uri = '/api' + pageElement.zipExport.uri
      derive(uri, { fieldId: selectedOption[2] })
    },
    // a/b座自定义弹窗关闭事件，关闭后自定义生效 记录操作
    handleCustomModalCancel() {
      const { modalParams, memoryParam } = this.$data
      this.setState({
        custom: false,
        showParams: [...modalParams],
        memoryParam: {
          ...memoryParam,
          showParams: [...modalParams]
        }
      }, () => {
        this.setMemory('buildingPigHouseParam', { ...this.memoryParam })
      })
    },
    // 楼顶批量开操作
    handleroofMultiOpen() {
      const { main } = this.roofData
      if (!main) {
        message.error('设备未安装!')
        return
      } else if (Number(main.isOnline) !== 1) {
        message.error('设备离线!')
        return
      } else {
        this.setState({
          roofMultiOpen: true
          // visible_duration: true
        })
      }
    },
    // 楼顶批量关操作
    handleroofMultiClose() {
      const { main } = this.roofData
      if (!main) {
        message.error('设备未安装!')
        return
      } else if (Number(main.isOnline) !== 1) {
        message.error('设备离线!')
        return
      } else {
        this.setState({
          roofMultiClose: true
          // visible_duration: true
        })
      }
    },
    changeTopBtn(item) {
      if (this.selectedOption.length !== 3) {
        return message.error('请选择场区')
      }
      this.activeTab = item
      const { memoryParam } = this.$data
      this.batchOperate(false)
      this.setState({
        memoryParam: {
          ...memoryParam,
          activeTab: item
        }
      }, () => {
        this.setMemory('buildingPigHouseParam', { ...this.memoryParam })
        this.submitOption()
      })
    },
    // 记录上次操作参数
    setMemory(name, value) {
      this.$store.dispatch('buildPigHouse/saveLastSearchParam', {
        name,
        value
      })
    },
    setState(data = {}, call = null) {
      Object.keys(data).forEach(key => {
        this[key] = data[key]
      })
      if (call && typeof call === 'function') {
        call()
      }
    },
    valueExist(val) {
      if (val === undefined || val === null || val === '') {
        return false
      } else {
        return true
      }
    },
    updateDestPressure() {
      this.setState({
        destPressure2: this.destPressure,
        destPressureModalVisible: true
      })
    },
    // 获取主控制器上次上报的目标压差
    getLastReportData(deviceId) {
      const _self = this
      this.$httpRequest({
        type: 'get',
        payload: {
          deviceId
        },
        uri: pageElement.getIPig3SRoofMainRuntimeArgs && pageElement.getIPig3SRoofMainRuntimeArgs.uri,
        callback: (res) => {
          console.log('获取主控制器上次上报的目标压差---', res)
          _self.setState({
            reportTime: res.data ? res.data.reportTime : null,
            pressure: res.data && _self.valueExist(res.data.pressure) ? res.data.pressure : null,
            destPressure: res.data && _self.valueExist(res.data.destPressure) ? res.data.destPressure : null
          })
          if (res?.data?.fansMgrConfig) {
            this.formInfo.data = res?.data?.fansMgrConfig
            this.fansMgrConfig = {
              ...(res?.data?.fansMgrConfig)
            }
          }
        }
      })
    },
    // 楼顶批量开/关操作后批量选择风机和除臭泵操作
    handleMultiChoose(key1, key2) {
      const roof_arr = [...this.roofChecked]
      const str = key1 + '_' + key2
      this.setState({
        roofChecked: roof_arr.indexOf(str) !== -1 ? [...roof_arr.filter((item) => { return item !== str })] : [...roof_arr, str]
      })
    },
    setPressure(roofData, activeDev, param) {
      if (roofData && roofData[activeDev]) {
        this.setState({
          ...param
        })
      } else {
        message.error('设备未安装!')
        return
      }
    },
    // 主补水控制指令下发
    controlInstruct() {
      const _self = this
      const { roofData } = this.$data
      const deviceId = roofData && roofData.main && roofData.main.deviceId ? roofData.main.deviceId : null
      const deviceName = roofData && roofData.main && roofData.main.deviceName ? roofData.main.deviceName : null
      const open_a = roofData && roofData.main && Number(roofData.main || roofData.main.replenishWaterStatusA) === 0 ? 1 : (Number(roofData.main || roofData.main.replenishWaterStatusA) === 1 ? 0 : 1)
      const open_b = roofData && roofData.main && Number(roofData.main || roofData.main.replenishWaterStatusB) === 0 ? 1 : (Number(roofData.main || roofData.main.replenishWaterStatusB) === 1 ? 0 : 1)
      if (deviceId && deviceName) {
        const { duration_water, water_block } = this.$data
        if (!duration_water) {
          message.error('生效时长不能为空')
          return
        }
        const obj = {
          iPig3SRoofDevMainType: 'ReplenishWater',
          open: Number(water_block) === 0 ? open_a : open_b,
          duration: duration_water,
          groupIndex: water_block, // 0:A栋补水,1:B栋补水
          mcuIndex: 1,
          deviceIndex: 1
        }
        this.$httpRequest({
          type: 'put',
          payload: [obj],
          uri: pageElement.control_RoofMain && pageElement.control_RoofMain.uri + `?deviceId=${deviceId}&deviceName=${deviceName}`,
          callback: (res) => {
            if (res.rel) {
              message.success(res.message || '指令下发成功!')
            } else {
              message.error(res.message || '指令下发失败!')
            }
            _self.setState({
              visible_main_duration: false,
              water_block: null,
              duration_water: null
            })
          }
        })
      } else {
        message.error('当前设备不存在！')
        this.setState({
          visible_main_duration: false,
          water_block: null,
          duration_water: null
        })
      }
    },
    // 主控制器开启关闭时间指令下发
    paramInstruct() {
      const { roofData } = this.$data
      const deviceId = roofData && roofData.main && roofData.main.deviceId ? roofData.main.deviceId : null
      const deviceName = roofData && roofData.main && roofData.main.deviceName ? roofData.main.deviceName : null
      const isOnLine = !!(roofData && roofData.main && Number(roofData.main.isOnline) === 1)
      if (!isOnLine) {
        message.error('楼顶主控制器设备离线！')
        return
      }
      if (deviceId && deviceName) {
        const { openTime, closeTime, enable_open } = this.$data
        if (!this.valueExist(enable_open) || !openTime || !closeTime) {
          message.error('开关状态、开始时间和结束时间不能为空')
          return
        }
        const obj = {
          'replenishWaterConfig': {
            'entrys': [
              {
                'enable': enable_open,
                'openTime': openTime,
                'closeTime': closeTime
              }
            ]
          }
        }
        const _self = this
        this.$httpRequest({
          type: 'put',
          payload: obj,
          uri: pageElement.param_RoofMain && pageElement.param_RoofMain.uri + `?deviceId=${deviceId}&deviceName=${deviceName}`,
          callback: (res) => {
            if (res.rel) {
              message.success(res.message || '指令下发成功!')
            } else {
              message.error(res.message || '指令下发失败!')
            }
            _self.setState({
              visible_main_date: false,
              enable_open: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].enable : null,
              openTime: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].openTime : null,
              closeTime: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].closeTime : null
            }, () => {
              _self.submitOption()
            })
          }
        })
      } else {
        message.error('楼顶主控制器设备不存在')
        this.setState({
          visible_main_date: false,
          enable_open: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].enable : null,
          openTime: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].openTime : null,
          closeTime: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].closeTime : null
        })
        return
      }
    },
    // 主控制器排水参数设置指令下发
    popParamInstruct() {
      const { roofData } = this.$data
      const deviceId = roofData && roofData.main && roofData.main.deviceId ? roofData.main.deviceId : null
      const deviceName = roofData && roofData.main && roofData.main.deviceName ? roofData.main.deviceName : null
      const isOnLine = !!(roofData && roofData.main && Number(roofData.main.isOnline) === 1)
      if (!isOnLine) {
        message.error('楼顶主控制器设备离线！')
        return
      }
      if (deviceId && deviceName) {
        const { pop_openTime, pop_closeTime, pop_enable_open } = this.$data
        if (!this.valueExist(pop_enable_open) || !pop_openTime || !pop_closeTime) {
          message.error('开关状态、开始时间和结束时间不能为空')
          return
        }
        const obj = {
          'drainageWaterConfig': {
            'entrys': [
              {
                'enable': pop_enable_open,
                'openTime': pop_openTime,
                'closeTime': pop_closeTime
              }
            ]
          }
        }
        this.$httpRequest({
          type: 'put',
          payload: obj,
          uri: pageElement.param_RoofMain && pageElement.param_RoofMain.uri + `?deviceId=${deviceId}&deviceName=${deviceName}`,
          callback: (res) => {
            if (res.rel) {
              message.success(res.message || '指令下发成功!')
            } else {
              message.error(res.message || '指令下发失败!')
            }
            this.setState({
              visible_main_pop_water: false,
              pop_enable_open: roofData.main && roofData.main.drainageWaterConfig && roofData.main.drainageWaterConfig.entrys.length > 0 ? roofData.main.drainageWaterConfig.entrys[0].enable : null,
              pop_openTime: roofData.main && roofData.main.drainageWaterConfig && roofData.main.drainageWaterConfig.entrys.length > 0 ? roofData.main.drainageWaterConfig.entrys[0].openTime : null,
              pop_closeTime: roofData.main && roofData.main.drainageWaterConfig && roofData.main.drainageWaterConfig.entrys.length > 0 ? roofData.main.drainageWaterConfig.entrys[0].closeTime : null
            }, () => {
              this.submitOption()
            })
          }
        })
      } else {
        message.error('楼顶主控制器设备不存在！')
        this.setState({
          visible_main_pop_water: false,
          pop_enable_open: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].enable : null,
          pop_openTime: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].openTime : null,
          pop_closeTime: roofData.main && roofData.main.replenishWaterConfig && roofData.main.replenishWaterConfig.entrys.length > 0 ? roofData.main.replenishWaterConfig.entrys[0].closeTime : null
        })
        return
      }
    },
    // 楼顶批量开/关操作后确定批量操作
    roofMultiOptOk() {
      const { roofChecked, roofMultiOpen, roofMultiClose, duration } = this.$data
      const { main } = this.roofData
      if (Number(main.isOnline) !== 1) {
        message.error('当前设备已离线')
        return
      }
      const arr = []
      const fanA = ['roofA1SubGroupStatus', 'roofA2SubGroupStatus', 'roofA3SubGroupStatus', 'roofA4SubGroupStatus', 'roofA5SubGroupStatus', 'roofA6SubGroupStatus', 'roofA7SubGroupStatus']
      const fanB = ['roofB1SubGroupStatus', 'roofB2SubGroupStatus', 'roofB3SubGroupStatus', 'roofB4SubGroupStatus', 'roofB5SubGroupStatus', 'roofB6SubGroupStatus', 'roofB7SubGroupStatus']
      const paramMap = {
        'fanGroupOneStatus': 1,
        'fanGroupTwoStatus': 2,
        'fanGroupThreeStatus': 3,
        'fanGroupFourStatus': 4,
        'fanGroupFiveStatus': 5,
        'fanGroupSixStatus': 6,
        'deodorantPumpOneStatus': 1,
        'deodorantPumpTwoStatus': 2,
        'deodorantPumpThreeStatus': 3,
        'deodorantPumpFourStatus': 4
      }
      const flag = roofMultiOpen ? 'open' : (roofMultiClose ? 'close' : null)
      if (flag === null) {
        return
      } else if (flag === 'open') {
        if (!this.valueExist(duration)) {
          message.error('生效时长不能为空')
          return
        }
        roofChecked.forEach((key) => {
          const mode = key.split('_')[0]
          const param = key.split('_')[1]
          let index = null
          if (fanA.indexOf(mode) !== -1) {
            index = fanA.indexOf(mode) + 1
          } else {
            index = fanB.indexOf(mode) + 1
          }
          const arr_obj = {
            'iPig3SRoofDevMainType': (fanA.indexOf(mode) !== -1 || fanB.indexOf(mode) !== -1) ? 'Fan' : 'Deodorize',
            'open': 1, // 0:关，1开
            'duration': duration, // 时间
            'groupIndex': fanA.indexOf(mode) !== -1 ? 0 : 1, // 0:A,1:B
            'mcuIndex': index, // 控制器编号 1～7
            'deviceIndex': paramMap[param] // 每个控制器控制风机编号 1～6
          }
          arr.push(arr_obj)
        })
      } else if (flag === 'close') {
        if (!duration) {
          message.error('生效时长不能为空')
          return
        }
        roofChecked.forEach((key) => {
          const mode = key.split('_')[0]
          const param = key.split('_')[1]
          let index = null
          if (fanA.indexOf(mode) !== -1) {
            index = fanA.indexOf(mode) + 1
          } else {
            index = fanB.indexOf(mode) + 1
          }
          const arr_obj = {
            'iPig3SRoofDevMainType': (fanA.indexOf(mode) !== -1 || fanB.indexOf(mode) !== -1) ? 'Fan' : 'Deodorize',
            'open': 0, // 0:关，1开
            'duration': duration, // 时间
            'groupIndex': fanA.indexOf(mode) !== -1 ? 0 : 1, // 0:A,1:B
            'mcuIndex': index, // 控制器编号 1～7
            'deviceIndex': paramMap[param] // 每个控制器控制风机编号 1～6
          }
          arr.push(arr_obj)
        })
      }
      if (main && main.deviceId && main.deviceName) {
        const _self = this
        this.$httpRequest({
          type: 'put',
          payload: arr,
          uri: pageElement.control_RoofMain && pageElement.control_RoofMain.uri + `?deviceId=${main.deviceId}&deviceName=${main.deviceName}`,
          callback: (res) => {
            if (res && res.rel) {
              message.success(res.message || '指令下发成功')
            } else {
              message.error(res.message || '指令下发失败')
            }
            _self.setState({
              roofMultiOpen: false,
              roofMultiClose: false,
              roofChecked: [],
              visible_duration: false
            }, () => {
              _self.submitOption()
            })
          }
        })
      } else {
        message.error('当前主控制器设备不存在！')
      }
    },
    handleDestPressureOk() {
      const { roofData: { main }, destPressure2 } = this.$data
      const deviceId = main && main.deviceId ? main.deviceId : null
      const deviceName = main && main.deviceName ? main.deviceName : null
      const _self = this
      if (deviceId && deviceName) {
        if (!this.valueExist(destPressure2)) {
          message.error('请输入目标压差！')
        } else {
          this.$httpRequest({
            type: 'put',
            payload: { 'destPressure': destPressure2 },
            uri: pageElement.param_RoofMain && pageElement.param_RoofMain.uri + `?deviceId=${deviceId}&deviceName=${deviceName}`,
            callback: (res) => {
              if (res && res.rel) {
                message.success(res.message)
                interval = setInterval(() => { // 设置定时器
                  _self.loadbar(interval)
                }, 1000)
              } else {
                _self.destPressure2 = 0
                message.error('指令下发失败！')
              }
              _self.submitOption()
              _self.setState({
                destPressureVisible: false,
                destPressureModalVisible: false
              })
            }
          })
        }
      } else {
        message.error('当前设备不存在！')
        this.setState({
          destPressureVisible: false,
          destPressure2: 0,
          destPressureModalVisible: false
        })
        return
      }
    },
    loadbar(interval) { // TODO 弹框 其中会有一个进度条展示
      const { prg, reportTime, roofData: { main }} = this.$data
      const deviceId = main && main.deviceId ? main.deviceId : null
      const _self = this
      if (prg >= 100) {
        clearInterval(interval)
        interval = null
        this.setState({
          loadingModelVisible: false
        }, () => {
          message.error({ content: '参数设置下发超时，请重试！', key: 'loading_abort', duration: 2 })
        })
      } else { // 未到终点，进度自增
        this.$httpRequest({
          type: 'get',
          payload: {
            deviceId
          },
          uri: pageElement.getIPig3SRoofMainRuntimeArgs && pageElement.getIPig3SRoofMainRuntimeArgs.uri,
          callback: (res) => {
            _self.setState({
              reportTime: res.data ? res.data.reportTime : null,
              destPressure: res.data && _self.valueExist(res.data.destPressure) ? res.data.destPressure : null
            })
            const data = res.data
            if (data && data.reportTime !== reportTime) {
              clearInterval(interval)
              interval = null
              _self.setState({
                loadingModelVisible: false,
                reportTime: data.reportTime,
                destPressure: data.destPressure
              }, () => {
                message.success({ content: '参数设置成功!', duration: 2 })
                return
              })
            }
            let cur_prg = 0
            if (prg === 0) {
              cur_prg = prg + 50
            } else if (prg === 50) {
              cur_prg = prg + 30
            } else if (prg === 80) {
              cur_prg = prg + 10
            } else if (prg === 90) {
              cur_prg = prg + 5
            } else {
              cur_prg = prg + 5
            }
            _self.setState({
              prg: cur_prg
            })
          }
        })
      }
    },
    // 计算总数、离线数、告警数、在线数、故障数
    calculate(data, status) {
      if (data && data.length > 0) {
        return data.filter((item) => {
          if (status === 'total') {
            return true
          } else if (status === 'online') {
            return item.statusOnline === 1
          } else if (status === 'offline') {
            return item.statusOnline === 0
          } else if (status === 'error') {
            return item.statusTrouble === 1
          } else if (status === 'alarm') {
            return item.statusWarning === 1
          } else {
            return true
          }
        }).length
      } else {
        return 0
      }
    },
    // 根据条件过滤数据展示
    filterData(data_filter, activeItem, block, floors, segments) {
      const data = this.filterDataByRange(data_filter)
      if (data.length < 1) {
        return []
      } else {
        const data_block = [...data.filter((item) => {
          if (block) {
            return item.block === block
          } else {
            return true
          }
        })]
        const data_floors = [...data_block.filter((item) => {
          if (floors.length > 0) {
            return floors.indexOf(item.floor) !== -1
          } else {
            return true
          }
        })]
        const data_segments = [...data_floors.filter((item) => {
          if (segments.length > 0) {
            let flag = false
            segments.forEach((segment) => {
              if (segment.roomTypeId === item.roomTypeId) {
                flag = true
              }
            })
            return flag
          } else {
            return true
          }
        })]
        const data_last = data_segments.filter((item) => {
          if (activeItem === 'online') {
            return item.statusOnline === 1
          } else if (activeItem === 'offline') {
            return item.statusOnline === 0
          } else if (activeItem === 'alarm') {
            return item.statusWarning === 1
          } else if (activeItem === 'error') {
            return item.statusTrouble === 1
          } else {
            return true
          }
        })
        if (this.filterValue) {
          if (this.filterValue === 'unit') {
            const data_obj = this.filterByFloor(data_last)
            const arr_f1 = [...this.sortData(this.filterValue, data_obj['FLOOR_ONE'])]
            const arr_f2 = [...this.sortData(this.filterValue, data_obj['FLOOR_TWO'])]
            const arr_f3 = [...this.sortData(this.filterValue, data_obj['FLOOR_THREE'])]
            const arr_f4 = [...this.sortData(this.filterValue, data_obj['FLOOR_FOUR'])]
            const arr_f5 = [...this.sortData(this.filterValue, data_obj['FLOOR_FIVE'])]
            const arr_f6 = [...this.sortData(this.filterValue, data_obj['FLOOR_SIX'])]
            return [...arr_f1, ...arr_f2, ...arr_f3, ...arr_f4, ...arr_f5, ...arr_f6]
          } else {
            return this.sortData(this.filterValue, data_last)
          }
        } else {
          return data_last
        }
      }
    },
    filterDataByRange(data) {
      let data_filter = [...data]
      if (this.valueExist(this.minTemp) && this.valueExist(this.maxTemp)) {
        data_filter = [
          ...data_filter.filter((item) => {
            return (
              (item.beforeIndoorTemp >= this.minTemp && item.beforeIndoorTemp <= this.maxTemp) ||
              (item.afterIndoorTemp >= this.minTemp && item.afterIndoorTemp <= this.maxTemp)
            )
          })
        ]
      } else {
        if (this.valueExist(this.minTemp)) {
          data_filter = [
            ...data_filter.filter((item) => {
              return (
                item.beforeIndoorTemp >= this.minTemp ||
                item.afterIndoorTemp >= this.minTemp
              )
            })
          ]
        }
        if (this.valueExist(this.maxTemp)) {
          data_filter = [
            ...data_filter.filter((item) => {
              return (
                item.beforeIndoorTemp <= this.maxTemp ||
                item.afterIndoorTemp <= this.maxTemp
              )
            })
          ]
        }
      }
      if (this.valueExist(this.minAge) && this.valueExist(this.maxAge)) {
        data_filter = [
          ...data_filter.filter((item) => {
            return item.pigDays >= this.minAge && item.pigDays <= this.maxAge
          })
        ]
      } else {
        if (this.valueExist(this.minAge)) {
          data_filter = [
            ...data_filter.filter((item) => {
              return item.pigDays >= this.minAge
            })
          ]
        }
        if (this.valueExist(this.maxAge)) {
          data_filter = [
            ...data_filter.filter((item) => {
              return item.pigDays <= this.maxAge
            })
          ]
        }
      }
      return data_filter
    },
    sortData(type, data) {
      let arr = [...data]
      switch (type) {
        case 'beforeIndoorTemp': arr = [...data.sort((a, b) => {
          return b.beforeIndoorTemp - a.beforeIndoorTemp
        })]; break
        case 'afterIndoorTemp': arr = [...data.sort((a, b) => {
          return b.afterIndoorTemp - a.afterIndoorTemp
        })]; break
        case 'beforeIndoorHumidity': arr = [...data.sort((a, b) => {
          return b.beforeIndoorHumidity - a.beforeIndoorHumidity
        })]; break
        case 'afterIndoorHumidity': arr = [...data.sort((a, b) => {
          return b.afterIndoorHumidity - a.afterIndoorHumidity
        })]; break
        case 'comfort': arr = [...data.sort((a, b) => {
          return b.comfortZoneLevel - a.comfortZoneLevel
        })]; break
        case 'unit': arr = [...this.sortChoosedUnit(data)]; break
        default: break
      }
      return arr
    },
    filterByFloor(data) {
      const obj = {
        'FLOOR_ONE': [],
        'FLOOR_TWO': [],
        'FLOOR_THREE': [],
        'FLOOR_FOUR': [],
        'FLOOR_FIVE': [],
        'FLOOR_SIX': []
      }
      data.forEach((item) => {
        const key = item.floor
        obj[key].push(item)
      })
      return obj
    },
    sortChoosedUnit(list) {
      const obj = {}
      let arr = []
      list.forEach((item, index) => {
        const key = item.segmentName
        const keys = Object.keys(obj)
        obj[key] = keys.indexOf(key) !== -1 ? [...obj[key], item] : [item]
      })
      const values = Object.values(obj)
      if (values && values.length > 0) {
        values.forEach((item) => {
          const array = [
            ...item.sort((a, b) => {
              return a.unit - b.unit
            })
          ]
          arr = [...arr, ...array]
        })
      }
      return arr
    },
    // 在线 离线等的切换 记录操作
    changeItem(val) {
      this.activeItem = val
      this.houseItem = null
      const { memoryParam } = this.$data
      this.setState({
        activeItem: val,
        memoryParam: {
          ...memoryParam,
          activeItem: val
        }
      }, () => {
        this.setMemory('buildingPigHouseParam', { ...this.memoryParam })
      })
    },
    // a/b座指令选择改变
    checkChange(id, val) {
      console.log(id)
      console.log(val)
      const { checkedObj } = this.$data
      this.setState({
        checkedObj: {
          ...checkedObj,
          [id]: val
        }
      }, () => {
        const { checkedObj, deviceData: { deviceList }} = this.$data
        if (deviceList && deviceList.length > 0) {
          const checked = Object.values(checkedObj).filter((item) => { return item })
          const dev = [...deviceList].filter((item) => { return item.statusOnline === 1 })
          if (checked.length > 0 && checked.length === dev.length) {
            this.setState({
              checkAll: true
            })
          } else {
            this.setState({
              checkAll: false
            })
          }
        }
      })
    },
    // 进入单元详情页
    handleDetail(item) {
      sessionStorage.setItem('buildingPigHouseDetail', JSON.stringify({
        deviceData: this.deviceData,
        selectedOption: this.selectedOption,
        selectedLabel: this.selectedLabel,
        block: this.activeTab,
        unitList: this.deviceData.deviceList,
        roomTypeName: item.roomTypeName,
        overview: {
          ...item
        }}))
      this.$router.push({
        name: 'buildingPigHouseDetail',
        params: {
          selectedOption: this.selectedOption,
          selectedLabel: this.selectedLabel,
          roomTypeName: item.roomTypeName,
          unitList: this.deviceData.deviceList,
          overview: {
            ...item
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.pig-house-container{
  .my-input{
    @include box_shadow('inPigBoxShadow1');
    @include background('bpBackGroundColor6');
    @include border_color('bpBorderColor2');
    @include font_color('taskTagFontColor');
    &:focus{
      @include border_color('bpBorderColor3');
    }
  }
  .building-input{
    .el-input__inner{
      height: 30px!important;
      width: 120px!important;
      color: #cdd8f7;
      @include font_color('bpFontColor2');
      line-height: 30px!important;
      border-radius: 2px!important;
      background: rgba(20,71,151,0.3)!important;
      @include background('bpBackGroundColor6');
      border: 1px solid #227fe6!important;
      box-shadow: 0px 0px 10px 0px #217bfc inset!important;
      @include box_shadow('inPigBoxShadow1');
      font-size: 12px!important;
      font-family: SourceHanSansCN, SourceHanSansCN-Normal!important;
      font-weight: Normal!important;
    }
    .allCheck{
      @include font_color('bpFontColor2');
    }
  }
}
.overview-home,
.multi-function-setting,
.multi-unit-setting {
  .dialog {
  }
  .dialog-body {
    min-width: 30%;
    min-height: 30%;
    height: 400px;
  }
  .dialog-hidden {
    display: none;
  }
  .dialog-container {
    padding: 20px;
    // width: 30%;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 350px;
    overflow-y: scroll;
    align-items: flex-start;
    align-content: flex-start;
    // justify-content: space-between;
    &::-webkit-scrollbar {
      display: none;
    }
    .focus-list {
      // width: 100%;
      margin-bottom: 20px;
    }
  }
  .focus-list {
    display: flex;
    height: 36px;
    align-items: center;
    font-size: 12px;
    color: #cdd8f7;
  }
  .focus-txt {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2d3e70;
    // border: 1px solid #20a4fc;
    border-radius: 2px;
    font-size: 14px;
    color: #cdd8f7;
    // width: 100px;
    height: 36px;
    padding: 10px;
    margin-right: 15px;
  }
  .focus-txt-current {
    border: 1px solid #20a4fc;
    color: #20a4fc;
  }
}
.instruct-modal-content {
    .el-input-number {
      line-height: 36px;
      height: 36px;
      overflow: hidden;
      border: 1px solid #475a9a;
      border-radius: 2px;
      .el-input__inner {
        background: #162456;
        border: none;
      }
      .el-input-number__decrease,
      .el-input-number__increase {
        background: #162456 !important;
        // border-left: 1px solid #162456;
        border-bottom: none !important;
        & [class*='el-icon'] {
          color: #ffffff;
        }
      }
      .el-input-number__increase {
        border-left: 1px solid #475a9a;
      }
    }
  }
</style>
<style lang="scss" scoped>
.pig-house-container >>> .btn-blue.el-button:focus {
  background-image: linear-gradient(180deg, #105FB6 0%, #0C4297 100%) !important;
  color: #fff;
}
.batch-box-big{
  display:flex;
  align-items: center;
  margin-bottom: 10px;
}
.is-scrolling-left-btn{
  margin: 0 10px 10px 0;
}
.controller-desc{
  margin-bottom: 10px;
}
.my-input {
  height: 30px;
  width: 65px;
  cursor: pointer;
  text-align: center;
  /* background: rgba(20, 71, 151, 0.3);
  @include background('viewMyInputBackGround'); */
  border: 1px solid #227fe6;
  border-radius: 2px;
  /* box-shadow: 0px 0px 10px 0px #217bfc inset;
  @include box_shadow('viewRadioBoxShadow'); */
  font-size: 12px;
  font-family: SourceHanSansCN, SourceHanSansCN-Normal;
  font-weight: Normal;
  color: #99a3bf;
  @include font-color('viewFontColor1');
}
.my-input:focus{
  outline: none;
  // border: 1px solid #fff
  @include border_color('viewMyInputFocusBorderColor');
  @include font_color('mainFontColor2');
}
.my-input ~ span {
  padding: 0px 2px;
  color: #d8d8d8;
}
/* 去除input[type=number]默认样式 */
.building-input .top-box input[type="number"] {
  -moz-appearance: textfield;
}
.building-input input[type="number"]::-webkit-inner-spin-button,
.building-input input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* 下拉框 */
.building-input >>> .el-input__inner {
  height: 30px!important;
  width: 120px!important;
  color: #cdd8f7!important;
  line-height: 30px!important;
  border-radius: 2px!important;
  background: rgba(20,71,151,0.3)!important;
  border: 1px solid #227fe6!important;
  box-shadow: 0px 0px 10px 0px #217bfc inset!important;
  font-size: 12px!important;
  font-family: SourceHanSansCN, SourceHanSansCN-Normal!important;
  font-weight: Normal!important;
}
/* 下拉框右边图标 */
.building-input >>> .el-input__icon {
  line-height: 30px!important;
}
/* 下拉框底部框上面的箭头 */
.building-input >>> .el-popper[x-placement^=bottom] .popper__arrow::after{
  top:0px!important;
}
.table-container{
  position: relative;
  height: calc(100vh - 332px);
}
.table-container .view-table{
  height:100%;
}
.top-box-ab >>> .el-form {
  margin-bottom: 0px !important;
}
</style>

