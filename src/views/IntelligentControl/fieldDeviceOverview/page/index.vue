<template>
  <div class="field-device-overview" :style="isfullScreen ? 'height:100%' : ''">
    <div class="nav-view">
      <nav-form
        v-show="!isfullScreen"
        class="nav-form"
        :data="navFormInfo.data"
        :field-list="navFormInfo.fieldList"
      >
        <!-- 自定义插槽的使用 -->
        <template v-slot:form-cascader>
          <div>
            <el-cascader
              ref="cascader"
              v-model="navFormInfo.data.cascader"
              clearable
              :options="navFormInfo.fieldList.left.inpLists[0].options"
              :props="{
                checkStrictly:
                  navFormInfo.fieldList.left.inpLists[0].checkStrictly,
                expandTrigger: 'hover',
                label: navFormInfo.fieldList.left.inpLists[0].customLabel
                  ? navFormInfo.fieldList.left.inpLists[0].customLabel
                  : 'label',
                value: navFormInfo.fieldList.left.inpLists[0].customValue
                  ? navFormInfo.fieldList.left.inpLists[0].customValue
                  : 'value'
              }"
              :class="
                navFormInfo.fieldList.left.inpLists[0].checkStrictly ||
                  navFormInfo.fieldList.left.inpLists[0].width
                  ? 'shadow addwidth'
                  : 'shadow '
              "
              filterable
              :placeholder="navFormInfo.fieldList.left.inpLists[0].placeholder"
              :style="{ width: navFormInfo.fieldList.left.inpLists[0].width }"
              @change="handleEvent"
            >
              <template slot-scope="{ data, node }">
                <div
                  v-if="!data.hasOwnProperty('children')"
                  class="custom-data"
                >
                  {{ data.title }}
                  <div
                    v-if="fieldIds.indexOf(data.value) !== -1"
                    class="focus-ico"
                    @click.stop="focus(node, 'noFocus')"
                  >
                    <svg-icon icon-class="focus" />
                  </div>
                  <div
                    v-else
                    class="focus-ico"
                    @click.stop="focus(node, 'focus')"
                  >
                    <svg-icon icon-class="no-focus" />
                  </div>
                </div>
              </template>
            </el-cascader>
          </div>
        </template>
        <!-- <template v-slot:left> -->
        <!-- <div class="top-l">
          <p>
            室外温湿度：<span class="temperature"
              ><svg-icon icon-class="temperature-ico" />{{
                deviceOverviewInfo &&
                deviceOverviewInfo.temperatureOuter !== -100 &&
                deviceOverviewInfo.temperatureOuter !== undefined
                  ? deviceOverviewInfo.temperatureOuter + '℃'
                  : '---'
              }}</span
            ><span class="humi "
              ><svg-icon icon-class="humi-ico" />{{
                deviceOverviewInfo &&
                deviceOverviewInfo.humiditieOuter !== -100 &&
                deviceOverviewInfo.humiditieOuter !== undefined
                  ? deviceOverviewInfo.humiditieOuter + '%'
                  : '---'
              }}</span
            >
          </p>
        </div> -->
        <!-- </template> -->
        <!-- <template v-slot:right> -->
        <!-- <div class="top-l">
              <p><svg-icon icon-class='warn-ico' /> 该场区未配置全场报警推送人，请前往<span class="warn">基础信息维护 — 报警推送管理 — 推送目标维护</span>进行配置</p>
          </div> -->
        <!-- </template> -->
      </nav-form>
      <div v-show="!isfullScreen" class="focus-list focus-flex">
        <div style="flex-shrink: 0;">我的关注：</div>
        <div class="focus-scrollbar">
          <div
            v-for="(item, index) in focusLists"
            :key="index"
            class="focus-list"
          >
            <div
              v-if="index < 20"
              class="focus-txt"
              :class="focusCurrent === item.id ? 'focus-txt-current' : ''"
              @click="currentFocus(item)"
            >
              {{ item.fieldName }}
            </div>
          </div>
        </div>
        <div style="flex-shrink: 0;">
          <button class="btn-border more-focus" @click="dialogDtatus = true">
            <svg-icon icon-class="view-more" />
            所有关注
          </button>
        </div>
        <!-- <div class="more-focus" @click="dialogDtatus = true">
            <svg-icon icon-class="view-more" />
          </div> -->
      </div>
    </div>
    <el-alert
      v-if="!isHasFieldConfigAlarmNoticeUsers"
      title="场区未配置全场报警推送人,请前往 基础信息维护-告警推送管理-推送人员维护 进行配置!"
      type="warning"
      show-icon
    />
    <div v-show="!isfullScreen" class="top-l">
      <el-row :gutter="10" style="margin-left:0;margin-right:0;width:100%">
        <el-col :span="18" style="padding-left:0">
          <div class="weather">
            <div class="weather-head">
              <div class="left">室外气象站</div>
              <p v-if="deviceOverviewInfo && deviceOverviewInfo.outdoorWeatherStation && deviceOverviewInfo.outdoorWeatherStation.length > 0" class="sw">
                <span v-for="(item, index) in deviceOverviewInfo.outdoorWeatherStation" :key="index">
                  <strong v-if="index < 3" style="font-weight:400">{{ item.location ? item.location : '---' }}:
                    <i style="font-style:normal;" class="temperature">{{ item.temperature || item.temperature == 0 ? item.temperature + '℃' : '---' }}</i>
                    /
                    <i style="font-style:normal;" class="humi">{{ item.humidity || item.humidity == 0 ? item.humidity + '%': '---' }}</i>
                  </strong>
                </span>
                <!-- <span>怀孕舍10单元：22.8℃</span>
                <span>怀孕舍10单元：22.8℃</span> -->
              </p>
              <p v-else class="sw">
                <span>暂无数据</span>
              </p>

              <div class="right" @click="dialogOutdoor = true">更多></div>
            </div>
            <div class="weather-head weather-main">
              <div class="left">天气状况</div>
              <div v-if="weatherList.length > 0" class="cut1">
                <span class="date">{{ weatherList[0].newDay || '-' }}今天</span>
                <img class="svg-img" :src="weatherList[0].weatherImg" alt="">
                <div class="container-carrier2-row">
                  <div class="container-carrier2-row-l">
                    <img class="img" src="@/assets/image/unitStatus/weather-wendu.svg">
                    温度
                  </div>
                  <div class="container-carrier2-row-r">{{ weatherList[0].hightemp || '-' }}°<span>/{{ weatherList[0].lowertemp || '-' }}°</span></div>
                </div>
                <div class="container-carrier2-row">
                  <div class="container-carrier2-row-l">
                    <img class="img" src="@/assets/image/unitStatus/weather-fengli.svg">
                    风力
                  </div>
                  <div class="container-carrier2-row-r">{{ weatherList[0].windlevel || '-级' }}</div>
                </div>
                <div class="container-carrier2-row shidu">
                  <div class="container-carrier2-row-l">
                    <img class="img" src="@/assets/image/unitStatus/weather-shidu.svg">
                    湿度
                  </div>
                  <div class="container-carrier2-row-r">{{ weatherList[0].humidity || '-' }}%</div>
                </div>
              </div>
              <p v-else class="sw">
                <span>暂无数据</span>
              </p>
              <div class="right" @click="dialogWeater = true">更多></div>
            </div>
            <!-- <div class="weather-main" style="height:46px">
              <div v-if="weatherList.length !== 0" class="cut1">
                <span class="date">{{ weatherList[0].newDay || '-' }}今天</span>
                <img class="svg-img" :src="weatherList[0].weatherImg" alt="">
                <div class="container-carrier2-row">
                  <div class="container-carrier2-row-l">
                    <img class="img" src="@/assets/image/unitStatus/weather-wendu.svg">
                    温度
                  </div>
                  <div class="container-carrier2-row-r">{{ weatherList[0].hightemp || '-' }}°<span>/{{ weatherList[0].lowertemp || '-' }}°</span></div>
                </div>
                <div class="container-carrier2-row">
                  <div class="container-carrier2-row-l">
                    <img class="img" src="@/assets/image/unitStatus/weather-fengli.svg">
                    风力
                  </div>
                  <div class="container-carrier2-row-r">{{ weatherList[0].windlevel || '-级' }}</div>
                </div>
                <div class="container-carrier2-row shidu">
                  <div class="container-carrier2-row-l">
                    <img class="img" src="@/assets/image/unitStatus/weather-shidu.svg">
                    湿度
                  </div>
                  <div class="container-carrier2-row-r">{{ weatherList[0].humidity || '-' }}%</div>
                </div>
              </div>
              <div
                v-else
                style="height: 100%;display: flex;justify-content: center;
    align-items: center;"
              >
                暂无数据
              </div>
            </div> -->
          </div>
        </el-col>
        <el-col :span="6" style="padding-left:15px;padding-right:0">
          <div class="leader-info weather">
            <div class="weather-head">
              <div class="title left">场长信息：</div>
              <div class="icon-main" style="display:flex">
                <div class="edit" style="margin-left:10px;cursor: pointer;">
                  <div
                    v-if="!editLeaderInfo"
                    class="ico"
                    @click="editLeaderInfo = true"
                  >
                    <svg-icon icon-class="edit" />
                  </div>
                  <div v-else class="ico" @click="saveLeaderInfo">
                    <svg-icon icon-class="save" />
                  </div>
                </div>
                <!-- <el-popconfirm
                  v-if="LeaderInfo.fieldLeaderPhone && LeaderInfo.fieldLeaderName"
                  title="确定删除场长信息吗？"
                  @onConfirm="deleteLeaderInfo"
                >
                  <div slot="reference" class="edit ico" style="margin-left:10px;cursor: pointer;">
                    <svg-icon icon-class="delete" />
                  </div>
                </el-popconfirm> -->
              </div>
            </div>
            <div class="leader-main" style="display:flex;padding:5px 0;">
              <div class="name">
                <div class="ico"><svg-icon icon-class="view-people" /></div>
                <div class="name-info">
                  <div v-if="!editLeaderInfo" class="defalt">
                    {{ LeaderInfo ? LeaderInfo.fieldLeaderName : "" }}
                  </div>
                  <div v-else class="input">
                    <input v-model="LeaderInfo.fieldLeaderName" type="text">
                  </div>
                </div>
              </div>
              <div class="phone">
                <div class="ico"><svg-icon icon-class="view-phone" /></div>
                <div class="phone">
                  <div v-if="!editLeaderInfo" class="defalt">
                    {{ LeaderInfo ? LeaderInfo.fieldLeaderPhone : "" }}
                  </div>
                  <div v-else class="input">
                    <input
                      v-model="LeaderInfo.fieldLeaderPhone"
                      style="BACKGROUND-COLOR: transparent;"
                      type="text"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div
      class="dialog"
      :class="dialogDtatus ? 'dialog-block' : 'dialog-hidden'"
    >
      <div class="dialog-body Highlight">
        <div class="dialog-head">
          <span>我的关注</span>
          <div class="dialog-head-close" @click="close">
            <i class="iconfont">&#xe61a;</i>
          </div>
        </div>
        <div class="dialog-container">
          <div
            v-for="(item, index) in focusLists"
            :key="index"
            class="focus-list"
          >
            <div
              class="focus-txt"
              :class="focusCurrent === item.id ? 'focus-txt-current' : ''"
              @click="confirm(item)"
            >
              {{ item.fieldName }}
            </div>
          </div>
        </div>
        <!-- <div class="dialog-foot">
          <button-list
            :btn-list="btnList"
            @btn-added="confirm"
            @btn-edit="close"
          />
        </div> -->
      </div>
      <div class="dialog-close" @click="close" />
    </div>
    <div
      class="dialog"
      :class="dialogOutdoor ? 'dialog-block' : 'dialog-hidden'"
    >
      <div class="dialog-body Highlight">
        <div class="dialog-head">
          <span>室外气象站</span>
          <div class="dialog-head-close" @click="dialogOutdoor = false">
            <i class="iconfont">&#xe61a;</i>
          </div>
        </div>
        <div class="dialog-container dialog-weater dialog-weater1">
          <template v-if="outdoorWeatherList.length > 0">
            <div class="weather-list1 weather-list1cor">
              <p>位置</p>
              <p>当前温湿度</p>
              <p>温度范围</p>
              <p>湿度范围</p>
            </div>
            <div
              v-for="(item, index) in outdoorWeatherList"
              :key="index"
              class="weather-list1"
            >
              <p>{{ item.location ? item.location : '---' }}</p>
              <p><span style="color: #1FBFFF;">{{ item.temperature || item.temperature == 0 ? item.temperature + '℃' : '---' }}</span> / <span style="color: #1FFFA0;">{{ item.humidity || item.humidity == 0 ? item.humidity + '%': '---' }}</span></p>
              <!-- <p>{{ item.temperature }}℃  / {{ item.humidity }}%</p> -->
              <p>{{ item.tempMin || item.tempMin == 0 ? item.tempMin + '℃' : '---' }}  ~ {{ item.tempMax || item.tempMax == 0 ? item.tempMax + '℃' : '---' }} </p>
              <p>{{ item.humiMin || item.humiMin == 0 ? item.humiMin + '%' : '---' }}  ~ {{ item.humiMax || item.humiMax == 0 ? item.humiMax + '%' : '---' }} </p>
            </div>
          </template>
          <template v-else>
            <div
              style="    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;"
            >
              <img style="max-width:300px;height:180px" :src="noData | noDataFile('noData', 'svg')" alt="">
            </div>
          </template>
          <!-- <el-button
            class="btn-blue weater-close"
            @click="dialogOutdoor = false"
          >关闭</el-button> -->
        </div>
        <!-- <div class="dialog-foot">
          <button-list
            :btn-list="btnList"
            @btn-added="confirm"
            @btn-edit="close"
          />
        </div> -->
      </div>
      <div class="dialog-close" @click="dialogOutdoor = false" />
    </div>

    <div
      class="dialog"
      :class="dialogWeater ? 'dialog-block' : 'dialog-hidden'"
    >
      <div class="dialog-body Highlight">
        <div class="dialog-head">
          <span>更多天气</span>
          <div class="dialog-head-close" @click="dialogWeater = false">
            <i class="iconfont">&#xe61a;</i>
          </div>
        </div>
        <div class="dialog-container dialog-weater">
          <template v-if="weatherList.length !== 0">
            <div
              v-for="(item, index) in weatherList"
              :key="index"
              class="weather-list"
            >
              <div class="weather-main" style="height:46px">
                <div class="cut1">
                  <div class="container-carrier2-row date-row">
                    <span
                      class="date"
                    >{{ item.newDay || "-" }}{{ item.date }}</span>
                    <img class="svg-img" :src="item.weatherImg" alt="">
                  </div>
                  <div class="container-carrier2-row wendu-row">
                    <div class="container-carrier2-row-l">
                      <img
                        class="img"
                        src="@/assets/image/unitStatus/weather-wendu.svg"
                      >
                      温度
                    </div>
                    <div class="container-carrier2-row-r">
                      {{ item.hightemp || "-" }}°<span>/{{ item.lowertemp || "-" }}°</span>
                    </div>
                  </div>
                  <div class="container-carrier2-row fengli-row">
                    <div class="container-carrier2-row-l">
                      <img
                        class="img"
                        src="@/assets/image/unitStatus/weather-fengli.svg"
                      >
                      风力
                    </div>
                    <div class="container-carrier2-row-r">
                      {{ item.windlevel || "-级" }}
                    </div>
                  </div>
                  <div class="container-carrier2-row shidu">
                    <div class="container-carrier2-row-l">
                      <img
                        class="img"
                        src="@/assets/image/unitStatus/weather-shidu.svg"
                      >
                      湿度
                    </div>
                    <div class="container-carrier2-row-r">
                      {{ item.humidity || "-" }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              style="    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;"
            >
              <img style="max-width:300px;height:180px" :src="noData | noDataFile('noData', 'svg')" alt="">
            </div>
          </template>
          <!-- <el-button
            class="btn-blue weater-close"
            @click="dialogWeater = false"
          >关闭</el-button> -->
        </div>
        <!-- <div class="dialog-foot">
          <button-list
            :btn-list="btnList"
            @btn-added="confirm"
            @btn-edit="close"
          />
        </div> -->
      </div>
      <div class="dialog-close" @click="dialogWeater = false" />
    </div>

    <!-- 、、、 -->
    <el-row
      :gutter="20"
      class="overview-home-main"
      :style="isfullScreen ? 'height:100%' : ''"
    >
      <el-col
        v-loading="loading"
        :span="isfullScreen ? (isfullScreenAll ? 24 : 18) : 18"
        class="view-height"
        :style="isfullScreen ? 'height:100%' : ''"
      >
        <div
          class="titleHighlight view-height"
          :style="isfullScreen ? 'height:100%' : ''"
        >
          <h3 class="short-title">单元信息</h3>
          <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane
                v-for="(item, index) in table"
                :key="index"
                :label="item.name"
                :name="item.val"
              >
                <span slot="label" class="tab-t">{{ item.name }}</span>
                <el-scrollbar class="radio-scrollbar">
                  <div class="radio">
                    <el-button
                      v-for="(j, k) in item.radio"
                      :key="k"
                      :class="{ active: currentSort == k }"
                      @click="active(j, k)"
                    >
                      <svg-icon v-if="k !== 0" :icon-class="j.icon" />
                      {{ j.name }}({{ j.number }})</el-button>
                  </div>
                  <div class="option">
                    <div class="filter default">
                      <el-select
                        v-model="filterValue"
                        style="min-width: 120px"
                        placeholder="请选择"
                        @change="sortChange"
                      >
                        <el-option
                          v-for="item in filterOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                    <div
                      class="layout"
                      @click="
                        () => {
                          if (viewDisplay === 'panel') {
                            viewDisplay = 'table';
                          } else {
                            viewDisplay = 'panel';
                          }
                        }
                      "
                    >
                      <el-tooltip
                        class=""
                        effect="dark"
                        :content="viewDisplay === 'table' ? '卡片' : '表格'"
                        placement="top-start"
                      >
                        <svg-icon
                          style="font-size: 24px"
                          icon-class="view-layout"
                        />
                      </el-tooltip>
                    </div>
                    <div class="export-data layout" @click="exportData">
                      <el-tooltip
                        class=""
                        effect="dark"
                        content="导出"
                        placement="top-start"
                      >
                        <svg-icon
                          style="font-size: 24px"
                          icon-class="oview-export"
                        />
                      </el-tooltip>
                    </div>
                    <div
                      v-show="!isfullScreen"
                      class="full-screen"
                      @click="checkFullScreen"
                    >
                      <el-tooltip
                        class=""
                        effect="dark"
                        content="全屏"
                        placement="top-start"
                      >
                        <svg-icon
                          style="font-size: 24px"
                          icon-class="full-screen"
                        />
                      </el-tooltip>
                    </div>
                    <div
                      v-show="isfullScreen"
                      class="full-screen"
                      @click="checkFullScreen"
                    >
                      <el-tooltip
                        class=""
                        effect="dark"
                        content="退出全屏"
                        placement="top-start"
                      >
                        <svg-icon
                          style="font-size: 24px"
                          icon-class="shirk-screen"
                        />
                      </el-tooltip>
                    </div>
                  </div>
                </el-scrollbar>
                <el-scrollbar
                  v-if="pigHouseLists.length !== 0 && viewDisplay === 'panel'"
                  :ref="'homeWarpScrollbar' + index"
                  class="home-warp-scrollbar"
                  :class="isfullScreen ? 'scrollbar-full' : ''"
                  style="height:100%;"
                >
                  <div ref="homeWrap" class="home-warp pane-wrap">
                    <el-col
                      v-for="(data, k) in pigHouseLists"
                      :key="k"
                      :lg="8"
                      :xl="6"
                    >
                      <div
                        class="home-item"
                        :style="
                          data.statusWarning === 1
                            ? 'border: 2px solid #FF5656!important;'
                            : ''
                        "
                        @click="link(data)"
                      >
                        <div class="item-title">
                          <div class="name">
                            <!-- <div class="room"> -->
                            {{
                              data.roomTypeName
                                ? data.roomTypeName + data.unit
                                : "---"
                            }}
                            <!-- </div> -->
                            <!-- <div class="unit"> -->
                            <!-- {{data.unit}} -->
                            <!-- </div> -->
                          </div>
                          <!-- <svg-icon :icon-class="item.status"></svg-icon> -->
                          <div class="icon-box">
                            <svg-icon
                              class="icon-item"
                              :icon-class="
                                data.statusOnline === 1
                                  ? 'online-ico'
                                  : 'offline-ico'
                              "
                            />
                            <!-- <svg-icon
                              v-if="data.statusWarning === 1"
                              slot="reference"
                              class="icon-item"
                              icon-class="warn-num"
                            /> -->
                            <el-popover
                              :key="data.deviceId"
                              placement="top-start"
                              title="告警详情"
                              trigger="hover"
                              @show="getContent(data)"
                            >
                              <AlarmBox
                                v-loading="isAlarmLoading"
                                :info="alarmDatas"
                              />
                              <svg-icon
                                v-if="data.statusWarning === 1"
                                slot="reference"
                                class="icon-item"
                                icon-class="warn-num"
                              />
                            </el-popover>
                            <svg-icon
                              v-if="data.isEmptyUnit === 1"
                              class="icon-item"
                              icon-class="empty-ico"
                            />
                            <svg-icon
                              v-if="data.isAlarmSuspend === 1"
                              class="icon-item"
                              icon-class="stop-alarm"
                            />
                            <svg-icon
                              v-if="data.isParamLock === true"
                              class="icon-item"
                              icon-class="lock-ico"
                            />
                          </div>
                        </div>
                        <div v-if="viewDisplay === 'panel'" class="item-main">
                          <div class="item-imgs">
                            <div class="item-img">
                              <div class="ico">
                                <div class="ico-img">
                                  <svg-icon icon-class="fan-ico" />
                                  <div class="num">
                                    {{ data.constantFanNum || "0" }}
                                  </div>
                                </div>
                              </div>
                              <div class="info">定速</div>
                            </div>
                            <div class="item-img">
                              <div class="ico">
                                <div class="ico-img">
                                  <svg-icon icon-class="fan-ico" />
                                  <div class="num">
                                    {{ data.trenchFanNum || "0" }}
                                  </div>
                                </div>
                              </div>
                              <div class="info">地沟</div>
                            </div>
                            <div class="item-img">
                              <div class="ico">
                                <div class="ico-img">
                                  <svg-icon icon-class="fan-ico" />
                                  <div class="num">
                                    {{ data.hotChangeFanNum || "0" }}
                                  </div>
                                </div>
                              </div>
                              <div class="info">热交换</div>
                            </div>
                            <div class="item-img">
                              <div class="ico">
                                <div class="ico-img">
                                  <svg-icon icon-class="fan-ico" />
                                  <div class="num">
                                    {{ data.endFanNum || "0" }}
                                  </div>
                                </div>
                              </div>
                              <div class="info">端部</div>
                            </div>
                          </div>
                          <!-- <div class="detail">
                            <div class="deathRateWeek">
                              <div
                                class="num"
                                :style="viewColor(data.deathRateWeek)"
                              >
                                {{ data.deathRateWeek || '---' }}
                              </div>
                              <div class="info">周死亡率</div>
                            </div>
                            <div class="deathRateDay">
                              <div
                                class="num"
                                :style="viewColor(data.deathRateDay)"
                              >
                                {{ data.deathRateDay || '---' }}
                              </div>
                              <div class="info">日死亡率</div>
                            </div>
                            <div class="deathRateTotal">
                              <div
                                class="num"
                                :style="viewColor(data.deathRateTotal)"
                              >
                                {{ data.deathRateTotal || '---' }}
                              </div>
                              <div class="info">累计死亡率</div>
                            </div>
                          </div> -->
                          <div class="fanGear">
                            风机档位：{{ data.fanGear || "---" }}
                            <span v-if="data && data.suspendMinutes" style="margin-left:15px;">暂停时长：{{ data.suspendMinutes }}分钟</span>
                          </div>
                          <div class="item-t">
                            <div>
                              <span>前</span>
                              <span>{{
                                data.temperatureInner1 &&
                                  data.temperatureInner1 !== -100
                                  ? data.temperatureInner1 + "°C"
                                  : "---"
                              }}</span>
                              <span>{{
                                data.humiditieInner1 &&
                                  data.humiditieInner1 !== -100
                                  ? data.humiditieInner1 + "%"
                                  : "---"
                              }}</span>
                            </div>
                            <div>
                              <span>后</span>
                              <span>{{
                                data.temperatureInner2 &&
                                  data.temperatureInner2 !== -100
                                  ? data.temperatureInner2 + "°C"
                                  : "---"
                              }}</span>
                              <span>{{
                                data.humiditieInner2 &&
                                  data.humiditieInner2 !== -100
                                  ? data.humiditieInner2 + "%"
                                  : "---"
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </div>
                </el-scrollbar>
                <div
                  v-else-if="
                    pigHouseLists.length !== 0 && viewDisplay === 'table'
                  "
                  class="home-warp"
                  style="height: calc(100vh - 446px);width:100%"
                  :class="isfullScreen ? 'scrollbar-full' : ''"
                >
                  <view-table
                    ref="tableData"
                    :table-data="pigHouseLists"
                    @handleRowClick="handleRowClick"
                  />
                </div>
                <div
                  v-else
                  style="height: calc(100vh - 446px);display: flex;
    justify-content: center;
    align-items: center;"
                  class="home-warp-none"
                >
                  <img style="max-width:300px;height:180px" :src="noData | noDataFile('noData', 'svg')" alt="">
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
      <div
        v-if="isfullScreen"
        class="isfullScreenAllIcon"
        @click="isfullScreenAll = !isfullScreenAll"
      >
        <img v-show="!isfullScreenAll" src="@/assets/image/fold-show.png">
        <img v-show="isfullScreenAll" src="@/assets/image/fold-hidden.png">
      </div>
      <el-col
        v-loading="loading"
        :span="isfullScreen ? (isfullScreenAll ? 0.1 : 6) : 6"
        class="view-height"
        style="overflow: hidden;"
        :style="isfullScreen ? 'height:100%' : ''"
      >
        <div
          class="main-right view-height titleHighlight"
          :style="isfullScreen ? 'height:100%' : ''"
        >
          <h3 class="short-title">报警信息</h3>
          <div class="right-tab overfolw" :style="{'height': alarmInfo.length === 0 ? '100%' : 'calc(100% - 50px)','display': alarmInfo.length === 0 ? 'initial' : 'block'}">
            <!-- <div
              class="right-tab-bg"
              @mouseenter="clearTimes"
              @mouseleave="reloadTimes"
              @mousedown="move"
            > -->
            <div v-if="alarmInfo.length === 0" class="warn-none" :style="{'height': alarmInfo.length === 0 ? '94%' : 'calc(100vh - 315px)'}">
              <img style="max-width:300px;" :src="noData | noDataFile('noData', 'svg')" alt="">
            </div>
            <!-- <vue-seamless-scroll v-else :data="alarmInfo" class="seamless-warp overfolw" :class-option="classOption"> -->
            <div class="seamless-warp overfolw">
              <div v-for="(item, index) in alarmInfo" :key="index">
                <p class="title">
                  <span class="prefix">|</span> {{ Object.keys(item)[0] }}
                </p>
                <ul v-for="(j, k) in Object.values(item)[0]" :key="k">
                  <li>
                    <el-tooltip
                      class="item"
                      :visible-arrow="false"
                      popper-class="view-tooltip"
                      effect="dark"
                      placement="left"
                    >
                      <div slot="content" class="content">
                        {{ j.name }} - {{ j.info }}
                        <div class="nabla-right" />
                      </div>
                      <!-- <div
                      class="option"
                      @click.stop.prevent="fieldList.head.handleClick"
                    >
                      <svg-icon
                        class="waring-icon"
                        :icon-class="fieldList.head.optionIcon"
                      />
                      {{ fieldList.head.option }}
                    </div> -->
                      <span>{{ j.name }} - {{ j.info }}</span>
                    </el-tooltip>
                  </li>
                </ul>
              </div>
              <!-- </vue-seamless-scroll> -->
            </div>
            <!-- </div> -->
            <!-- <el-scrollbar class="ul-scrollbar"> -->
            <!-- <div v-if="alarmInfo.length === 0" class="warn-none">
                暂无报警信息
              </div> -->
            <!-- <div v-for="(item, index) in alarmInfo" v-else :key="index">
                <p class="title">
                  <span class="prefix">|</span> {{ Object.keys(item)[0] }}
                </p>
                <ul>
                  <li v-for="(j, k) in Object.values(item)[0]" :key="k">
                    {{ j.name }} - {{ j.info }}
                  </li>
                </ul>
              </div> -->
            <!-- </el-scrollbar> -->
          </div>
          <div class="cut" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// TODO:WebSocket
// const stompClient = null
import {
  getRegionAreaFieldTree,
  getAlarmInfosByField,
  // getAlarmInfosByFieldV4,
  isFieldConfigAlarmNoticeUsers,
  getDevicesByField,
  addFocus,
  cancelFocus,
  focusList,
  getLeaderInfo,
  updateFieldLeaderInfo
  // exportTable
} from '@/http/api/fieldDeviceOverview'
import { getListWeather, getOutdoorWeatherStationByDeviceIds } from '@/http/api/fieldInfo'
import { derive } from '@/http/api/exportData/export'
import weatherService from '@/lib/service/weather-service'
// TODO:WebSocket
// import { createWebSocket, closeWebSocket } from '../../A.Public/utils/websocket'
import { collection } from '@/common/utils/array'
// import buttonList from '@/components/ElementComponent/button'
import navForm from '@/components/commonComponent/navForm'
// import viewTable from '../common/components/viewTable/viewTable'
import viewTable from '../common/components/viewTable'
// import vueSeamlessScroll from 'vue-seamless-scroll'
import {
  radioList,
  initRadioList
} from '@/views/IntelligentControl/fieldDeviceOverview/common/mock'
// import noData from '@/assets/image/page/noData.png'
import { collectionMany } from '@/common/utils/array'
import Dialog from '@/components/dialog/dialog.js'
import EmptySetup from '@/views/IntelligentControl/fieldDeviceOverview/common/components/EmptySetup'
import WarnSetup from '@/views/IntelligentControl/fieldDeviceOverview/common/components/WarnSetup'
import { mapGetters } from 'vuex'
import { getConfigElement } from '@/utils/overtService'
import AlarmBox from '@/components/alarm-box/index'
const pageElement = getConfigElement('fieldDeviceOverview')
export default {
  components: {
    navForm,
    AlarmBox,
    // buttonList,
    viewTable
    // vueSeamlessScroll
  },
  watch: {
    cascadervalue(newVal, old) {
      // console.log(newVal, 'newval')
    }
  },
  provide() {
    return {
      overview: this
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'fullScreen']),
    isfullScreen() {
      return this.fullScreen
    },
    classOption() {
      return {
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 0, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      }
    }
  },
  data() {
    return {
      noData: null,
      isAddLeader: false,
      isfullScreenAll: true,
      // 当前时间
      currentTime: '',
      weatherList: [],
      outdoorWeatherList: [],
      isAlarmLoading: false,
      alarmDatas: [],
      regionId: this.$route.params.regionId,
      areaId: this.$route.params.areaId,
      fieldId: this.$route.params.fieldId,
      isHasFieldConfigAlarmNoticeUsers: true,
      refreshInterval: '',
      cascadervalue: this.$refs.cascader && this.$refs.cascader.checkedValue,
      loading: false,
      isShowLoading: false,
      filterOptions: [
        {
          value: 'unit',
          label: '单元'
        },
        {
          value: 'batchNumber',
          label: '批次'
        },
        {
          value: 'firmwareVersion',
          label: '版本号'
        },
        {
          value: 'comfort',
          label: '舒适度'
        },
        {
          value: 'temperatureInner1',
          label: '室内前温度'
        },
        {
          value: 'humiditieInner1',
          label: '室内前湿度'
        },
        {
          value: 'temperatureInner2',
          label: '室内后温度'
        },
        {
          value: 'humiditieInner2',
          label: '室内后湿度'
        }
      ],
      filterValue: 'unit',
      // pigHouseLists,
      editLeaderInfo: false,
      LeaderInfo: {
        fieldLeaderName: '',
        fieldLeaderPhone: ''
      },
      dialogDtatus: false,
      dialogWeater: false,
      dialogOutdoor: false,
      btnList: [
        {
          name: '取消',
          class: 'btn-border',
          size: '60',
          event: 'edit'
        },
        {
          name: '保存',
          class: 'btn-blue',
          size: '60',
          event: 'added'
        }
      ],
      viewDisplay: 'table',
      pigHouseLists: [],
      fieldIds: [],
      focusLists: [],
      focusCurrent: '',
      top: 0,
      positionY: 0,
      // tabFilterList: pigHouseLists,
      tabFilterList: [],
      selectedOption: [],
      copySelectedOption: [],
      // selectedOption: ['-11', '-101', '-1001'],
      selectedLabel: '',
      copySelectedLabel: '',
      hasConfigureNotifier: true,
      alarmInfo: [],
      timeHeight: null,
      deviceOverviewInfo: '',
      deviceList: '',
      navFormInfo: {
        data: {
          cascader: ''
        },
        fieldList: {
          left: {
            inpLists: [
              // {
              //   key: 'cascader',
              //   type: 'cascader',
              //   className: 'shadow',
              //   placeholder: '大区 / 区域 / 场区',
              //   width: '300px',
              //   customLabel: 'title',
              //   customValue: '',
              //   options: [],
              //   // handleChange: (val) => {
              //   //   // console.log('更改的大区选择', val)
              //   //   this.selectedOption = val
              //   // }
              // },
              {
                key: 'cascader',
                type: 'slot',
                className: 'shadow',
                placeholder: '大区 / 区域 / 场区',
                width: '300px',
                customLabel: 'title',
                customValue: '',
                options: []
              },
              {
                type: 'button',
                innerText: '查询',
                className: 'btn-blue',
                handleClick: () => {
                  // // console.log('查询',this.navFormInfo)
                  if (document.querySelector('.home-warp-scrollbar')) {
                    this.$nextTick(() => {
                      this.table.forEach((item, index) => {
                        if (this.$refs.tableData) {
                          this.$refs[
                            'homeWarpScrollbar' + index
                          ][0].wrap.scrollTop = 0
                        }
                      })
                    })
                  }
                  if (document.querySelector('.home-warp')) {
                    this.$nextTick(() => {
                      this.table.forEach((item, index) => {
                        if (this.$refs.tableData) {
                          this.$refs.tableData[
                            index
                          ].$children[0].bodyWrapper.scrollTop = 0
                        }
                      })
                    })
                  }
                  this.isShowLoading = true
                  this.copySelectedOption = this.selectedOption
                  this.copySelectedLabel = this.selectedLabel
                  // TODO:WebSocket
                  // closeWebSocket(stompClient)
                  // createWebSocket(this.selectedOption[2], (data) => {
                  //   // console.log('获取的WebSocket', data)
                  //   // this.updateDeviceList(data)
                  //   // this.refreshIntervalFun()
                  // }, (client) => {
                  //   stompClient = client
                  // })
                  // // console.log('获取的当前ref', this.$refs['cascader'].inputValue.replace(/\s*/g, '')
                  //   .split('/'))
                  // if (this.$refs['cascader'].inputValue.replace(/\s*/g, '').split('/')[2].indexOf('公猪站') !== -1) {
                  //   // console.log('公猪站场区')
                  // } else {
                  //   // console.log('非公猪站场区')
                  // }
                  // console.log('handleClick选中的级联', this.selectedLabel)
                  this.submitOption()
                  // this.getBaseInfo()
                }
              },
              {
                type: 'button',
                innerText: '空圈设置',
                authCode: 'fieldDeviceOverview:configEmptyStyUnitsForField',
                className: 'btn-border',
                handleClick: () => {
                  this.setEmptyCircle()
                }
              },
              {
                type: 'button',
                innerText: '暂停报警设置',
                authCode: 'fieldDeviceOverview:addAlarmSuspendForField',
                className: 'btn-blue',
                handleClick: () => {
                  // // console.log('获取的报警设置', this.selectedOption)
                  if (this.selectedOption.length !== 0) {
                    // // console.log('暂停报警设置')
                    if (this.isHasFieldConfigAlarmNoticeUsers) {
                      this.setWarnSetup()
                    } else {
                      this.$confirm(
                        '是否前往配置?',
                        '该场区未设置全场告警推送人',
                        {
                          confirmButtonText: '前往配置',
                          confirmButtonClass: 'btn-blue btn-blue-confirm',
                          cancelButtonText: '取 消',
                          // cancelButtonClass: 'btn-border',
                          // confirmButtonClass: 'btn-blue',
                          type: 'warning'
                        }
                      ).then(() => {
                        this.$router.push({
                          path:
                            '/unit-evc/baseInfo/alarmManagement/targetMaintenance'
                        })
                      })
                    }
                  } else {
                    this.$message.error('请选择场区！')
                  }
                }
              }
            ]
          }
        }
      },
      currentSort: 0,
      // tab可以选择默认
      activeName: 'all',
      table: [{ val: 'all', name: '全部类型', radio: radioList }],
      selection: ''
    }
  },
  created() {
  },
  mounted() {
    // this.$nextTick(() => {
    //   // console.log('获取当前选择的场区信息', this.$refs['cascader'].getCheckedNodes())
    // })
    // console.log('获取的vuex的状态', this.$store)
    const infos = JSON.parse(
      sessionStorage.getItem('fieldDeviceOverviewDetail')
    )
    if (this.regionId && this.areaId && this.fieldId) {
      this.selectedOption = [this.regionId, this.areaId, this.fieldId]
      this.copySelectedOption = [this.regionId, this.areaId, this.fieldId]
      // console.log('aaaaaaaaaaaaaaaaaaaaaa', this.selectedOption)
      this.navFormInfo.data.cascader = [
        this.regionId,
        this.areaId,
        this.fieldId
      ]
      this.isShowLoading = true
      this.submitOption()
      // this.getBaseInfo()
    } else if (
      infos &&
      infos.overview &&
      infos.overview.regionId &&
      infos.overview.areaId &&
      infos.overview.fieldId
    ) {
      // 保留上次 查询信息
      // console.log('获取的infos', infos)
      this.selectedOption = [
        infos.overview.regionId,
        infos.overview.areaId,
        infos.overview.fieldId
      ]
      this.copySelectedOption = [
        infos.overview.regionId,
        infos.overview.areaId,
        infos.overview.fieldId
      ]
      this.selectedLabel = infos.selectedLabel
      this.navFormInfo.data.cascader = [
        infos.overview.regionId,
        infos.overview.areaId,
        infos.overview.fieldId
      ]
      this.loading = true
      this.submitOption()
    }
    // console.log('bbbbbbbbbbbbbbbbbbbbbb', this.selectedOption)
    // const pageElement = getConfigElement('fieldDeviceOverview')
    // console.log('权限', pageElement)

    // console.log('mock模拟的数据', this.pigHouseLists)
    getRegionAreaFieldTree().then(res => {
      // console.log('获取的场区数据', res)
      this.navFormInfo.fieldList.left.inpLists[0].options = res.data
      // // console.log('获取的大区id',this.fieldIds)
    })
    this.getFocusList()
    this.table = [{ val: 'all', name: '全部类型', radio: initRadioList }]
    // console.log('当前的table', this.table)
    // this.table[0].radio.forEach((item) => {
    //   // // console.log('遍历的数据',item);
    //   if (item.name === '全部') {
    //     item.number = pigHouseLists.length
    //   } else {
    //     item.number = collectionMany(pigHouseLists, item.icon, 'status').length
    //   }
    // })
  },

  destroyed() {
    this.clearTimes()
    this.clearRefreshInterval()
    // console.log('页面离开之后', this)
  },

  methods: {
    getCurrentTime(d) {
      const date = d ? new Date(d) : new Date()
      const Y = date.getFullYear()
      const M =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      const hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const mm =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      const ss =
        date.getSeconds() < 10 ? '0' + date.getDate() : date.getSeconds()
      const time = Y + '-' + M + '-' + D + ' ' + hh + ':' + mm + ':' + ss
      return time
    },
    nDate(t) {
      const date1 = new Date()
      const date2 = new Date(date1)
      date2.setDate(date1.getDate() + t)
      const day =
        date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()
      const time2 =
        date2.getFullYear() + '-' + `${(date2.getMonth() + 1) > 10 ? (date2.getMonth() + 1) : '0' + (date2.getMonth() + 1)}` + '-' + day
      return time2
    },
    getWeek(dateString) {
      const dateArray = dateString.split('-')
      const date = new Date(
        dateArray[0],
        parseInt(dateArray[1] - 1),
        dateArray[2]
      )
      return '周' + '日一二三四五六'.charAt(date.getDay())
    },
    // 天气信息
    async getWeatherData() {
      // console.log('获取天气信息----------------')
      this.currentTime = this.getCurrentTime('')
      // this.loadingWeather = true
      const data = {
        endDay: this.nDate(4),
        fieldId: this.selectedOption[2],
        startDay: this.currentTime.split(' ')[0]
      }
      await getListWeather(data)
        .then(res => {
          // this.loadingWeather = false
          if (res && res.status === 200 && res.data) {
            const arr = JSON.parse(JSON.stringify(res.data.rows))
            for (const i of arr) {
              i.weatherImg = weatherService.getWeatherImg(i.weather)
              i.date = this.getWeek(i.day)
              i.newDay =
                i.day.split('-')[1] + '月' + i.day.split('-')[2] + '日'
            }
            // // console.log('获取的天气this.weatherList2', this.weatherList, arr)
            // arr[0].newDay = '今天'
            this.weatherList = arr
            // console.log('获取的天气this.weatherList3', this.weatherList)
          } else {
            this.$message({ message: res.message, type: 'warning' })
          }
        })
        .catch(() => {
          // this.loadingWeather = false
        })
      // await getDevicesreportTime({ fieldId: this.selectedOption[2] }).then(
      //   res => {
      //     // this.loadingWeather = false
      //     // console.log(res)
      //     if (res && res.status === 200 && res.data) {
      //       // console.log(res.data)
      //     }
      //   }
      // )
    },
    getContent(info) {
      this.alarmDatas = []
      this.isAlarmLoading = true
      this.$httpRequest({
        type: 'get',
        payload: { deviceId: info.deviceId },
        uri:
          pageElement.getDeviceAlarmDetails &&
          pageElement.getDeviceAlarmDetails.uri,
        callback: data => {
          this.isAlarmLoading = false
          if (data.data.total > 0) {
            this.alarmDatas = data.data.rows
            // console.log(this.alarmDatas, 'alarm datas')
          }
        }
      })
    },
    viewColor(val) {
      if (!val) {
        // return 'color:red'
      } else if (val < 0.25) {
        return 'color:#03C785'
      } else if (val >= 0.25 && val < 0.5) {
        return 'color:#E6D300'
      } else if (val > 0.5) {
        return 'color:#FF5656'
      }
    },
    checkFullScreen() {
      this.isfullScreenAll = true
      this.$store.dispatch('checkFullScreen')
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
        values.forEach(item => {
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
    sortChange(event) {
      // // console.log('排序的内容', event, this.pigHouseLists)
      // let arr = [
      //   ...this.pigHouseLists.sort((a, b) => {
      //     return b.temperatureInner1 - a.temperatureInner1
      //   }),
      // ]
      switch (event) {
        case 'unit':
          this.pigHouseLists = [...this.sortChoosedUnit(this.pigHouseLists)]
          break
        case 'temperatureInner1':
          this.pigHouseLists = [
            ...this.pigHouseLists.sort((a, b) => {
              return b.temperatureInner1 - a.temperatureInner1
            })
          ]
          break
        case 'temperatureInner2':
          this.pigHouseLists = [
            ...this.pigHouseLists.sort((a, b) => {
              return b.temperatureInner2 - a.temperatureInner2
            })
          ]
          break
        case 'humiditieInner1':
          this.pigHouseLists = [
            ...this.pigHouseLists.sort((a, b) => {
              return b.humiditieInner1 - a.humiditieInner1
            })
          ]
          break
        case 'humiditieInner2':
          this.pigHouseLists = [
            ...this.pigHouseLists.sort((a, b) => {
              return b.humiditieInner2 - a.humiditieInner2
            })
          ]
          break
        case 'batchNumber':
          this.pigHouseLists = [
            ...this.pigHouseLists.sort((a, b) => {
              return b.batchNumber - a.batchNumber
            })
          ]
          break
        case 'comfort':
          this.pigHouseLists = [
            ...this.pigHouseLists.sort((a, b) => {
              return b.comfortZoneLevel - a.comfortZoneLevel
            })
          ]
          break
        case 'firmwareVersion':
          this.pigHouseLists = [
            ...this.pigHouseLists.sort((a, b) => {
              return a.firmwareVersion - b.firmwareVersion
            })
          ]
          break
        default:
          break
      }
    },
    confirm(item) {
      this.dialogDtatus = false
      this.currentFocus(item)
    },
    close() {
      this.dialogDtatus = false
    },
    currentFocus(item) {
      if (document.querySelector('.home-warp-scrollbar')) {
        this.$nextTick(() => {
          this.table.forEach((item, index) => {
            this.$refs['homeWarpScrollbar' + index][0].wrap.scrollTop = 0
            if (this.$refs.tableData) {
              this.$refs.tableData.bodyWrapper.scrollTop = 0
            }
          })
        })
      }
      if (document.querySelector('.home-warp')) {
        this.$nextTick(() => {
          this.table.forEach((item, index) => {
            if (this.$refs.tableData) {
              this.$refs.tableData[
                index
              ].$children[0].bodyWrapper.scrollTop = 0
            }
          })
        })
      }
      // console.log('当前选中的item', item)
      this.focusCurrent = item.id
      this.navFormInfo.data.cascader = this.copySelectedOption = this.selectedOption = [
        item.regionId,
        item.areaId,
        item.fieldId
      ]
      // console.log(
      //   'this.navFormInfo.data.cascader',
      //   this.navFormInfo.data.cascader
      // )
      this.copySelectedLabel = this.selectedLabel = [
        item.regionName,
        item.areaName,
        item.fieldName
      ]
      this.isShowLoading = true
      this.submitOption()
      // this.getBaseInfo()
    },
    saveLeaderInfo() {
      if (this.selectedOption[2]) {
        if (
          !this.LeaderInfo.fieldLeaderName ||
          !this.LeaderInfo.fieldLeaderPhone
        ) {
          this.$message.error('场长名称和电话不能为空!')
        } else {
          if (this.isAddLeader) {
            this.$httpRequest({
              type: 'post',
              payload: {
                fieldId: this.selectedOption[2],
                fieldLeaderName: this.LeaderInfo.fieldLeaderName,
                fieldLeaderPhone: this.LeaderInfo.fieldLeaderPhone
              },
              uri: pageElement.addFieldLeader && pageElement.addFieldLeader.uri,
              callback: res => {
                this.$message.success('新增场长信息成功')
                // console.log('返回的场长信息', res)
                this.LeaderInfo.fieldLeaderName = res.data.fieldLeaderName
                this.LeaderInfo.fieldLeaderPhone = res.data.fieldLeaderPhone
                this.editLeaderInfo = false
              }
            })
          } else {
            const data = {
              fieldId: this.selectedOption[2],
              fieldLeaderName: this.LeaderInfo.fieldLeaderName,
              fieldLeaderPhone: this.LeaderInfo.fieldLeaderPhone
            }
            updateFieldLeaderInfo(data).then(res => {
              // console.log('更新场长信息', res)
              this.$message.success('修改场长信息成功')
              this.LeaderInfo.fieldLeaderName = res.data.fieldLeaderName
              this.LeaderInfo.fieldLeaderPhone = res.data.fieldLeaderPhone
              this.editLeaderInfo = false
            })
          }
        }
      } else {
        this.$message.error('请选择场区')
      }
    },
    deleteLeaderInfo() {
      if (
        !(
          pageElement &&
          pageElement.deleteFieldLeader &&
          pageElement.deleteFieldLeader.uri
        )
      ) {
        this.$message.error('暂无获取场长信息权限!')
        return
      }
      if (this.selectedOption.length === 3) {
        this.$httpRequest({
          type: 'get',
          payload: {
            fieldId: this.selectedOption[2]
          },
          uri:
            pageElement.deleteFieldLeader && pageElement.deleteFieldLeader.uri,
          callback: () => {
            // this.getUser(fieldId)
            this.LeaderInfo.fieldLeaderName = ''
            this.LeaderInfo.fieldLeaderPhone = ''
            this.isAddLeader = true
          }
        })
      } else {
        this.$message.error('请先选择场区!')
      }
    },
    getFocusList() {
      focusList().then(res => {
        // console.log('获取的关注列表', res)
        this.focusLists = res.data
        this.fieldIds =
          res.data && res.data.length > 0
            ? res.data.map(item => {
              // console.log(item)
              return item.fieldId
            })
            : []
        // console.log('getFocusList -> fieldIds', this.fieldIds)
      })
    },
    focus(node, val) {
      // console.log('获取的关注的节点', node)
      if (val !== 'noFocus') {
        const data = {
          regionId: node.path[0],
          regionName: node.pathLabels[0],
          areaId: node.path[1],
          areaName: node.pathLabels[1],
          fieldId: node.path[2],
          fieldName: node.pathLabels[2]
        }
        addFocus(data)
          .then(res => {
            this.$message.success(res.message)
            // this.fieldIds = [...this.fieldIds,res.data]
            this.getFocusList()
          })
          .catch(() => {
            // if (err.status === 500) {
            //   this.$message.error('服务器错误!')
            // } else {
            //   this.$message.error(err.message)
            // }
          })
      } else {
        // console.log(collection(this.focusLists, node.value, 'fieldId'))
        cancelFocus({
          attentionId: collection(this.focusLists, node.value, 'fieldId').id
        }).then(res => {
          this.$message.success(res.message)
          // this.fieldIds = [...this.fieldIds,res.data]
          this.getFocusList()
        })
      }
    },
    handleEvent() {
      // console.log(this.$refs['cascader'])
      const cascader = {}
      this.focusCurrent = ''
      // console.log(
      //   '获取的ref',
      //   this.$refs['cascader'],
      //   event,
      //   this.$refs['cascader'].getCheckedNodes()
      // )
      // if (this.$refs['cascader'].getCheckedNodes().length !== 0) {
      //   cascader = this.$refs['cascader'].getCheckedNodes()[0]
      // } else {
      cascader.path = this.$refs['cascader'].checkedValue
      cascader.pathLabels = []
      cascader.pathLabels = this.$refs['cascader'].getCheckedNodes()[0]
        ? this.$refs['cascader'].getCheckedNodes()[0].pathLabels
        : event.path[0].innerText.replace(/\s*/g, '').split('/')
      // }
      // this.$refs['cascader'].inputValue.replace(/\s*/g, '').split('/')
      // event.path[0].innerText
      //   .replace(/\s*/g, '')
      //   .split('/')
      // }
      // // console.log(
      //   'handleEvent -> cascader',
      //   this.$refs['cascader'],
      //   cascader.pathLabels
      // )
      // console.log('cascader.path', cascader.path)
      // console.log('cascader.pathLabels', cascader.pathLabels)
      this.selectedOption = cascader.path
      this.selectedLabel = cascader.pathLabels
      this.$store.dispatch('IntelligentControl/saveLastSearchParam', {
        selectedOption: cascader.path,
        selectedLabel: cascader.pathLabels
      })
      // console.log(this.navFormInfo.data.cascader)
    },
    active(item, index) {
      // console.log('状态的点击事件', item, index)
      // console.log('当前的大区', this.navFormInfo.data)
      if (item.name === '全部') {
        this.pigHouseLists = this.tabFilterList
      } else {
        // this.pigHouseLists = collectionMany(
        //   this.tabFilterList,
        //   item.icon,
        //   'status'
        // )
        switch (item.name) {
          case '在线':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              1,
              'statusOnline'
            )
            break
          case '离线':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              0,
              'statusOnline'
            )
            break
          case '报警':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              1,
              'statusWarning'
            )
            break
          case '空圈':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              1,
              'isEmptyUnit'
            )
            break
          case '暂停报警':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              1,
              'isAlarmSuspend'
            )
            break
          case '参数锁定':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              true,
              'isParamLock'
            )
            break
          case '刷圈':
            this.pigHouseLists = collectionMany(
              this.tabFilterList,
              1,
              'isSweepUnit'
            )
            break
        }
      }
      this.currentSort = index
    },
    link(item) {
      this.copySelectedLabel = this.selectedLabel = [
        item.regionName,
        item.areaName,
        item.fieldName
      ]
      // // console.log('获取得详情的内容11111111111', item)
      this.clearTimes()
      this.clearRefreshInterval()
      sessionStorage.setItem(
        'fieldDeviceOverviewDetail',
        JSON.stringify({
          unitList: this.pigHouseLists,
          overview: item,
          selectedOption:
            this.copySelectedOption.length !== 0
              ? this.copySelectedOption
              : this.selectedOption,
          // selectedLabel: this.copySelectedLabel.length !== 0 ? this.copySelectedLabel : this.selectedLabel
          selectedLabel: [item.regionName, item.areaName, item.fieldName]
        })
      )
      // TODO:新控制器协议构建
      // if (item.fieldName.indexOf('公猪站') !== -1) {
      if (item.isBoar === 1) { // 公猪站
        this.$router.push({
          // name: 'intelligentControlOverview',
          name: 'intelligentControlOverviewV4',
          params: {
            unitList: this.pigHouseLists,
            overview: item,
            selectedOption:
              this.copySelectedOption.length !== 0
                ? this.copySelectedOption
                : this.selectedOption,
            selectedLabel:
              this.copySelectedLabel.length !== 0
                ? this.copySelectedLabel
                : this.selectedLabel
          }
        })
      } else {
        this.$router.push({
          name: 'intelligentControlOverview',
          // name: 'intelligentControlOverviewV3',
          params: {
            unitList: this.pigHouseLists,
            overview: item,
            selectedOption:
              this.copySelectedOption.length !== 0
                ? this.copySelectedOption
                : this.selectedOption,
            selectedLabel:
              this.copySelectedLabel.length !== 0
                ? this.copySelectedLabel
                : this.selectedLabel
          }
        })
      }
    },
    handleRowClick(event) {
      // // console.log('表格点击事件', event)
      this.link(event)
    },
    // tab的点击事件
    handleClick(tab, event) {
      // // console.log('tab点击事件', tab)
      this.currentSort = 0
      if (tab.label === '全部类型') {
        this.pigHouseLists = this.tabFilterList = this.deviceList
      } else {
        this.pigHouseLists = this.tabFilterList = collectionMany(
          this.deviceList,
          tab.name,
          'roomTypeId'
        )
      }
      this.table[tab.index].radio.forEach(item => {
        switch (item.name) {
          case '全部':
            // console.log('获取的状态值', item, this.tabFilterList.length)
            item.number = this.tabFilterList.length
            break
          case '在线':
            item.number = collectionMany(
              this.tabFilterList,
              1,
              'statusOnline'
            ).length
            break
          case '离线':
            item.number = collectionMany(
              this.tabFilterList,
              0,
              'statusOnline'
            ).length
            break
          case '报警':
            item.number = collectionMany(
              this.tabFilterList,
              1,
              'statusWarning'
            ).length
            break
          case '空圈':
            item.number = collectionMany(
              this.tabFilterList,
              1,
              'isEmptyUnit'
            ).length
            break
          case '暂停报警':
            item.number = collectionMany(
              this.tabFilterList,
              1,
              'isAlarmSuspend'
            ).length
            break
          case '参数锁定':
            item.number = collectionMany(
              this.tabFilterList,
              true,
              'isParamLock'
            ).length
            break
          case '刷圈':
            item.number = collectionMany(
              this.tabFilterList,
              1,
              'isSweepUnit'
            ).length
            break
        }
      })
      this.$nextTick(() => { this.sortChange('unit') })
    },
    // 自动刷新
    refreshIntervalFun() {
      this.clearRefreshInterval()
      this.isShowLoading = false
      this.refreshInterval = setInterval(() => {
        this.submitOption()
      }, 180000)
    },
    clearRefreshInterval() {
      clearInterval(this.refreshInterval)
    },
    // 基础信息查询
    getBaseInfo() {
      getLeaderInfo({ fieldId: this.selectedOption[2] }).then(res => {
        // console.log('获取的场长信息', res)
        this.LeaderInfo = res.data
          ? res.data
          : { fieldLeaderName: '', fieldLeaderPhone: '' }
        if (
          this.LeaderInfo.fieldLeaderName &&
          this.LeaderInfo.fieldLeaderPhone
        ) {
          // console.log('')
          this.isAddLeader = false
        } else {
          this.isAddLeader = true
        }
      })
      isFieldConfigAlarmNoticeUsers({
        regionId: this.selectedOption[0],
        areaId: this.selectedOption[1],
        fieldId: this.selectedOption[2]
      }).then(res => {
        // console.log('查询场区是否配置整场告警通知推送接收人员', res)
        this.isHasFieldConfigAlarmNoticeUsers = res.data
      })
    },
    exportData() {
      // if (this.selectedOption.length !== 0) {
      //   const url = exportTable(pageElement.exportOverviewStatusByField.uri, { fieldId: this.selectedOption[2] })
      //   window.open(url)
      //   // console.log('获取的导出的url', url)
      // } else {
      //   this.$message.error('请选择场区！')
      // }
      if (this.selectedOption.length !== 3) {
        this.$message({
          showClose: true,
          message: '请先选择场区',
          type: 'warning'
        })
      } else {
        derive('/api/unit_evc/equipment/exportOverviewDataByField', {
          fieldId: this.selectedOption[2]
        })
      }
    },
    // 查询
    submitOption() {
      // // console.log('当前选中的copySelectedLabel和selectedLabel', this.copySelectedLabel, this.selectedLabel)
      // console.log('获取当前选择的场区信息', this.selectedLabel)
      if (this.selectedOption.length !== 0) {
        if (this.isShowLoading) {
          this.loading = true
        }
        this.getBaseInfo()
        this.getWeatherData()
        // if (this.selectedLabel[2].indexOf('公猪站') !== -1) {
        //   getAlarmInfosByFieldV4(this.selectedOption[2]).then(res => {
        //     // console.log('获取的告警信息', res)
        //     this.top = 0
        //     this.alarmInfo = res.data && res.data.length > 0 ? res.data : []
        //     // console.log('alarmInfo', this.alarmInfo)
        //     // this.reloadTimes()
        //     this.refreshIntervalFun()
        //   })
        // } else {
        getAlarmInfosByField(this.selectedOption[2]).then(res => {
          // console.log('获取的告警信息', res)
          this.top = 0
          this.alarmInfo = res.data && res.data.length > 0 ? res.data : []
          // console.log('alarmInfo', this.alarmInfo)
          // this.reloadTimes()
          this.refreshIntervalFun()
        })
        // }
        // getLeaderInfo({ fieldId: this.selectedOption[2] }).then((res) => {
        //   // console.log('获取的场长信息', res)
        //   this.LeaderInfo = res.data
        // })
        // isFieldConfigAlarmNoticeUsers({
        //   regionId: this.selectedOption[0],
        //   areaId: this.selectedOption[1],
        //   fieldId: this.selectedOption[2]
        // }).then((res) => {
        //   // console.log('查询场区是否配置整场告警通知推送接收人员', res)
        // })
        this.outdoorWeatherList = []
        getDevicesByField({ fieldId: this.selectedOption[2] })
          .then(res => {
            this.loading = false
            this.table = [{ val: 'all', name: '全部类型', radio: radioList }]
            this.deviceOverviewInfo = res.data
            if (res?.data?.outdoorWeatherStation?.length > 0) { // 这里改变一下--
              this.getoutdoorWeatherList(res.data.outdoorWeatherStation)
            }
            this.pigHouseLists = this.tabFilterList = this.deviceList =
              res.data && res.data.deviceList ? res.data.deviceList : []
            this.table.push(...this.getTabs(this.deviceList))
            this.activeName = 'all'
            this.handleClick({ label: '全部类型', index: 0 })
            this.refreshIntervalFun()
          })
          .catch(() => {
            this.loading = false
            // if (error.status === 500) {
            //   this.$message.error('服务器错误!')
            // } else {
            //   this.$message.error(error.message)
            // }
          })
      } else {
        this.$message.error('请选择场区！')
      }
    },
    getoutdoorWeatherList(list = []) {
      if (!list) {
        return false
      }
      const deviceIds = []
      list.map(item => deviceIds.push(item.deviceId))
      const format = 'yyyy-MM-DD'
      const params = {
        deviceIds: deviceIds ? deviceIds.join(',') : '',
        startTime: this.$moment().subtract(0, 'days').format(format),
        endTime: this.$moment().subtract(-1, 'days').format(format)
      }
      getOutdoorWeatherStationByDeviceIds(params).then(res => {
        // console.log(res)
        if (res.status === 200 && res.rel) {
          this.outdoorWeatherList = res.data
        }
      })
    },
    getTabs(data) {
      const arr = []
      data.forEach(item => {
        if (item.roomTypeId && item.roomTypeName) {
          if (
            JSON.stringify(arr).indexOf(
              JSON.stringify({
                val: item.roomTypeId,
                name: item.roomTypeName,
                radio: radioList
              })
            ) === -1
          ) {
            arr.push({
              val: item.roomTypeId,
              name: item.roomTypeName,
              radio: radioList
            })
          }
        }
      })
      return arr
    },

    // 空圈
    setEmptyCircle() {
      if (this.navFormInfo.data.cascader) {
        const options = {
          rows: this.navFormInfo.data.cascader,
          closeDialog: () => {},
          handleOk: e => {
            this.submitOption()
            // console.log(12312313)
          },
          childs: EmptySetup
        }
        Dialog(options)
      } else {
        this.$message.error('请选择场区！')
      }
    },
    //
    setWarnSetup() {
      const options = {
        rows: this.navFormInfo.data.cascader,
        closeDialog: () => {},
        handleOk: e => {
          this.submitOption()
        },
        childs: WarnSetup
      }
      Dialog(options)
    },
    clearTimes() {
      window.clearInterval(this.timeHeight)
    },

    reloadTimes() {
      this.conditionScroll()
    },
    move(e) {
      const dom = document.getElementsByClassName('right-tab')[0]
      const bgheight = document.getElementsByClassName('right-tab-bg')[0]
        .offsetHeight
      // const odiv = e.target // 获取目标元素
      const disY = e.clientY
      document.onmousemove = e => {
        // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        const top = e.clientY - disY
        this.positionY = top
        if (this.top + this.positionY < 0) {
          dom.scrollTop = 0
        } else if (this.top + this.positionY >= bgheight) {
          dom.scrollTop = bgheight - this.top
        } else {
          dom.scrollTop = this.top + this.positionY
        }
        // 绑定元素位置到positionX和positionY上面
        // this.positionX = top
        // 移动当前元素
        // odiv.style.top = top + 'px'
      }
      document.onmouseup = e => {
        this.top =
          this.top + this.positionY < 0 ? 0 : this.top + this.positionY
        document.onmousemove = null
        document.onmouseup = null
      }
    },

    conditionScroll() {
      this.clearTimes()
      const dom = document.getElementsByClassName('right-tab')[0]
      const domHeight = document.getElementsByClassName('right-tab')[0]
        .offsetHeight
      const bgheight = document.getElementsByClassName('right-tab-bg')[0]
        .offsetHeight
      if (bgheight <= domHeight) {
        return
      }
      this.timeHeight = setInterval(
        function() {
          this.top += 1
          dom.scrollTop = this.top
          if (dom.scrollHeight - dom.scrollTop === domHeight) {
            this.top = 0
          } else if (this.top + domHeight >= bgheight) {
            this.top = 0
          }
        }.bind(this),
        20
      )
    }
  },

  beforeRouteLeave(to, from, next) {
    //  this.targetName = to.name  // 提示框点击确认后跳转的 路由
    //  if (this.checkEdit()) { // 是否对页面进行了编辑
    //     this.dialogVisible = true    // 打开离开页面的提示框
    //     next(false)
    //   } else {
    //     this.dialogVisible = false
    //     next()
    //   }
    this.clearTimes()
    this.clearRefreshInterval()
    // console.log('路由离开之前', this)
    next()
  }
}
</script>
<style lang="scss">
.el-popover__title {
    color: #fff;
    @include font_color('inPigFontColor');
}
.dialog-weater {
  .weater-close {
    position: absolute;
    bottom: 30px;
    right: 45px;
  }
  .weather-list {
    width: 100%;
  }
  .weather-list1 {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid rgba(221, 221, 221, 0.2);
    border-right: 1px solid rgba(221, 221, 221, 0.2);
    border-left: 1px solid rgba(221, 221, 221, 0.2);
    text-align: left;
    p {
      padding: 0 10px;
      flex: 1;
    }
  }
  .weather-list1cor {
    background: #15315E;
    @include background_color('inPigBackGroundColor10');
    border-top: 1px solid rgba(221, 221, 221, 0.2);
  }
  .weather-main {
    font-size: 12px;
    .date {
      font-size: 12px;
      color: #cdd8f7;
      @include font_color('mainFontColor11')
    }
    .cut1 {
      display: flex;
      align-items: center;
      white-space: nowrap;
      padding: 5px 0;
      // border-right: solid 1px ;
      // border-right: 1px solid #2f3872;
      // padding-right: 60px;
      .svg-img {
        // margin-left: 40px;
        // margin-right: 60px;
        margin-left: 10px;
        margin-right: 20px;
        width: 40px;
        height: 25px;
      }
      .shidu {
        width: 20%;
        &::after {
          display: none;
        }
      }
      .wendu-row {
        width: 20%;
      }
      .fengli-row {
        // flex: 1.5;
        width: 40%;
      }
      .date-row {
        widows: 20%;
        &::after {
          display: none;
        }
      }
      .container-carrier2-row {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
        // margin-r: 20px;
        padding: 0 20px;
        // flex: 1;
        &::after {
          position: absolute;
          right: 0;
          margin-top: 5px;
          content: " ";
          height: 24px;
          width: 1px;
          background: #2f3872;
          color: #2f3872;
          // position: relative;
          // right: 10px;
          // left: 5px;
          // margin: 0 20px;
          // margin-left: 10px;
          // margin-right: 30px;
        }
        .container-carrier2-row-l {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #0e759f;
          // margin-right: 50px;
        }
        .container-carrier2-row-r {
          display: flex;
          align-items: center;
          font-size: 20px;
          color: #1fbfff;
          span {
            font-size: 12px;
          }
        }
        .img {
          margin-right: 10px;
        }
        span {
          padding: 0;
        }
      }
    }
  }
}
// .dialog-weater1 {
  // border: 1px solid #15315E;
// }
// 样式没问题
.el-popover__title {
  color: #fff;
}
.el-alert--warning.is-light {
  background: rgba(253, 246, 236, 0.2);
}
.view-tooltip {
  background: #364687 !important;
  position: relative;

  .nabla-right {
    position: absolute;
    top: 12px;
    right: -7px;
    z-index: 99999999;
    width: 0px;
    height: 0px;
    border-left: 7px solid #364687;
    border-bottom: 7px solid transparent;
    border-top: 7px solid transparent;
  }
}
.cut {
  height: 20px;
}
.field-device-overview {
  // height: calc(100vh - 128px);
  overflow: hidden;
  .focus-scrollbar {
    // min-width: 100px;
    display: -webkit-box;
    margin-right: 5px;
    max-width: calc(100vw - 1100px);
    &::-webkit-scrollbar {
      height: 0 !important;
    }
  }
  .logManagement {
    flex-wrap: nowrap !important;
  }
  .overview-home-main {
    height: calc(100vh - 279px);
    position: relative;
  }
  .isfullScreenAllIcon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(-50%);
    // background: brown;
    // width: 10px;
    // height: 30px;
    z-index: 6666;
    cursor: pointer;
    img {
      display: block;
      width: 20px;
      height: auto;
    }
  }
  .el-tabs__header {
    margin-top: -10px;
    padding-left: 10px;
  }
  .el-tabs__nav-wrap::after {
    // background-color: #1a3166;
    @include background_color('mainTitleBorderColor');
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
  }
  .el-tabs {
    .el-tabs__item.is-active,
    .el-tabs__item {
      font-size: 14px;
    }
  }
  .radio-scrollbar {
    padding-left: 10px;
    padding-right: 10px;
    .el-scrollbar__view {
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow-x: auto;
    }
    .el-scrollbar__wrap::-webkit-scrollbar {
      display: none;
    }
    .el-scrollbar__wrap {
      margin-bottom: 0!important;
    }
    .option {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .layout {
        cursor: pointer;
        margin: 0 5px;
      }
      .full-screen {
        cursor: pointer;
        margin-left: 5px;
      }
    }
  }
}
.field-device-overview,
.multi-function-setting,
.multi-unit-setting {
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
    // color: #cdd8f7;
    @include font-color('mainFontColor11');
  }
  .focus-txt {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    @include background_color('focusBkColor');
    @include font-color('formColor');
    border-radius: 2px;
    font-size: 14px;
    height: 36px;
    padding: 10px;
    margin-right: 15px;
  }
  .focus-txt-current {
    border: 1px solid #20a4fc;
    color: #20a4fc;
  }
}
</style>
<style lang="scss" scoped>
@import "@/style/_handle.scss";
.weather {
  // background: linear-gradient(
  //   225deg,
  //   rgba(43, 60, 122, 0.5),
  //   rgba(28, 42, 110, 0.5)
  // );
  @include background("overviewBackGround");
  // border: 1px solid #2f3872;
  border: 1px solid;
  @include border_color("overviewBorderColor");
  border-radius: 4px 4px 4px 0px 4px;
  // padding: 8px 0;
  .weather-head {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    // border-bottom: solid 1px #2f3872;
    border-bottom: solid 1px;
    @include border_color("overviewBorderColor");
    .left {
      font-weight: bold;
      @include font_color("overviewFontColor1");
    }
    .sw {
      position: absolute;
      left: 100px;
      width: 75%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sw1 {
      position: absolute;
      left: 100px;
      width: 75%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .right {
      font-size: 12px;
      color: #20a4fc;
      cursor: pointer;
    }
  }
  .weather-main {
    .cut1 {
      display: flex;
      align-items: center;
      white-space: nowrap;
      padding: 0;
      justify-content: space-between;
      position: absolute;
      left: 100px;
      width: 75%;
      // border-right: solid 1px ;
      // border-right: 1px solid #2f3872;
      // padding-right: 60px;
      .svg-img {
        // margin-left: 40px;
        // margin-right: 60px;
        margin-left: 1%;
        margin-right: 4%;
        width: 40px;
        height: 25px;
      }
      .shidu {
        &::after {
          display: none;
        }
      }
      .container-carrier2-row {
        display: flex;
        justify-content: space-around;
        white-space: nowrap;
        flex: 1;
        &::after {
          margin-top: 5px;
          content: " ";
          height: 24px;
          width: 1px;
          background: #2f3872;
          color: #2f3872;
          // margin-left: 30px;
          // margin-right: 30px;
        }
        .container-carrier2-row-l {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #0e759f;
          margin-right: 50px;
        }
        .container-carrier2-row-r {
          display: flex;
          align-items: center;
          font-size: 20px;
          color: #1fbfff;
          span {
            font-size: 12px;
          }
        }
        .img {
          margin-right: 10px;
        }
        span {
          padding: 0;
        }
      }
    }
  }
}
.leader-main {
  display: flex;
  // justify-content: space-between;
  justify-content: center;
  padding: 1px !important;
}
.focus-scrollbar {
  text-align: center;
  // white-space: nowrap;
  overflow-x: scroll;
  overflow-y: auto;
  margin-right: 5px;
}
.nav-view {
  display: flex;
  align-items: center;
  // margin-bottom: 10px;
}
.view-height {
  height: 100%;
}
.seamless-warp {
  height: 100%;
  overflow: auto;
}
// @media screen and (max-width: 1600px) {
//     .nav-view {
//         // background-color:lightblue;
//         display: block;
//     }
// }
.focus-flex {
  margin-top: -10px;
  margin-bottom: 10px;
  // flex: 1;
  // justify-content: space-between;
  // .left{
  //       display: flex;
  // align-items: center;
  // }
}
.scrollbar-full {
  height: calc(100vh - 200px) !important;
  .el-scrollbar__wrap .el-scrollbar__view,
  .el-scrollbar__wrap .el-scrollbar__view .home-warp{
    height: 100%;
  }
}
.home-warp-scrollbar {
  height: calc(100vh - 446px);
  overflow-x: hidden;
  // TODO：展示框布局
  // padding-bottom: 20px;
  .home-warp-none {
    // color: #cdd8f7;
    @include font_color("overviewFontColor2");
    height: calc(100vh - 446px);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.custom-data {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.focus-ico {
  // padding: 20px;
  font-size: 16px;
}
.top-l {
  font-size: 14px;
  // color: #cdd8f7;
  @include font_color("overviewFontColor2");
  line-height: 36px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  span {
    padding: 0 15px;
  }
  .temperature {
    color: #1fbfff;
  }
  .humi {
    color: #1fffa0;
  }
  .warn {
    color: #1fbfff;
    padding: 0;
  }
  .leader-info {
    // display: flex;
    .name,
    .phone {
      display: flex;
    }
    .name {
      margin-right: 20px;
    }
    .ico {
      padding: 0 5px;
      // margin-right: 4px;
    }
    .input {
      input {
        padding: 0 10px;
        // max-width: 110px;
        width: 100%;
        height: 26px;
        // color: #fff;
        @include font_color("overviewFontColor1");
        background: none;
        outline: none;
        // border: solid 1px #409eff;
        border: solid 1px #409eff;
        border-radius: 2px;
      }
    }
  }
}

.more-focus {
  cursor: pointer;
  // position: absolute;
  // right: 10px;
  padding: 8px 20px;
}
.radio {
  margin-right: 10px;
  height: 40px;
  display: flex;
  justify-content: end;
  // margin-bottom: 10px;
  button[type="button"] {
    padding: 3px 7px;
    font-size: 12px;
    background: transparent;
    // border: 1px solid #42548b;
    border: 1px solid;
    @include border_color('viewRadioColor');
    @include font-color('taskTagFontColor');
    padding: 0 5px;
    height: 24px;
  }
  button.active[type="button"] {
    color: #1fbfff !important;
    background: rgba(9, 30, 64, 0);
    border: 1px solid #1fbfff;
    // box-shadow: inset 0 0 10px 0 #217bfc;
    @include box_shadow('viewRadioColor');
  }
}
.pane-wrap {
  height: calc(100vh - 470px);
  overflow-y: scroll;
}
.home-warp {
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;

  > div {
    margin: 10px 0;
  }
}
.titleHighlight {
  // border-radius: 20px;
  padding-bottom: 15px;
}
.home-item {
  border: 2px solid transparent;
  @include border_color('cardBorderColor');
  // background-image: linear-gradient(225deg, #2b3c7a 0%, #1b265b 100%);
  @include background_image('viewBackGroundImage1');
  // box-shadow: 0 2px 20px 0 #04082d;
  @include box_shadow('viewBoxShadow1');
  border-radius: 4px;
  // color: #cdd8f7;
  @include font-color('mainFontColor12');
  box-sizing: border-box;
  cursor: pointer;
  min-width: 212px;
  &:hover {
    // border: 2px solid #10aeff;
    .item-main {
      // background-image: linear-gradient(225deg, #5166b3 0%, #334391 100%);
      @include background_image('viewBackGroundImage2');
    }
  }
  // > div {
  //   padding: 0 20px;
  // }
  .detail {
    display: flex;
    text-align: center;
    margin-top: 10px;
    // justify-content: center;
    .info {
      font-size: 10px;
      color: #99a3bf;
    }
    .num {
      font-size: 12px;
      color: #99a3bf;
    }
    .deathRateWeek {
      flex: 1;
      // .num {
      //   color: #ff5656;
      // }
    }
    .deathRateDay {
      flex: 1;
      // .num {
      //   color: #03c785;
      // }
    }
    .deathRateTotal {
      flex: 1;
      // .num {
      //   color: #e6d300;
      // }
    }
  }
  .icon-box {
    .icon-item {
      margin-left: 10px;
    }
  }
  .item-title {
    padding: 0 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background: #2e3e7c;
    @include background_color('viewBackGround6');
    @include font_color('cardTitleColor');
    font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
    font-weight: 700;
    line-height: 34px;
    height: 34px;
    font-size: 14px;
  }
  .item-main {
    padding: 0 14px;
    padding-top: 10px;
    .item-imgs {
      display: flex;
    }
    .item-img {
      flex: 1;
      text-align: center;
      .ico {
        display: flex;
        justify-content: center;
        font-size: 10px;
        // width: 28px;
        .num {
          position: absolute;
          font-size: 10px;
          top: 0;
          right: -5px;
          border-radius: 50%;
          @include font_color('cardNumColor');
          background: #10aeff;
          width: 14px;
          height: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .ico-img {
          position: relative;
          font-size: 28px;
          width: 28px;
          // height: 28px;
        }
      }
      .info {
        font-size: 10px;
        // color: #99a3bf;
        @include font_color('cardContentColor');
      }
    }
  }
  .fanGear {
    // background: #2e3e7c;
    // margin: 10px 0;
    margin-top: 10px;
    padding: 5px;
    // border-radius: 4px;
    font-size: 10px;
    text-align: center;
    border-bottom: 1px solid #374990;
    @include border_color('cardFanBorderColor');
  }
  .item-t {
    // background: #2e3e7c;
    display: flex;
    justify-content: space-between;
    // padding: 0 15px;
    span {
      margin: 0 5px;
    }
    // border-bottom: 1px solid #374990;
  }
  .item-t,
  .item-b {
    line-height: 34px;
    font-size: 10px;
    // color: #cdd8f7;
    @include font_color('mainFontColor12');
    > p {
      // font-size: 12px;
    }
    > div {
      display: flex;
      justify-content: space-between;
      // font-size: 12px;
    }
  }
}
.main-right {
  width: 100%;
  // height: calc(100vh - 220px);
  // height: 100%;
  .warning {
    width: 100%;
    padding: 20px 5px;
    background-image: linear-gradient(225deg, #2c4190 0%, #1d2a69 100%);
    border-radius: 8px;
    border-radius: 8px;
    display: flex;
    .warning-item {
      width: 50%;
      display: flex;
      text-align: left;
      .number {
        font-size: 30px;
        color: #8ea0ea;
      }
      .name {
        font-size: 14px;
        color: #8ea0ea;
      }
      .waring-icon {
        width: 40px;
        height: 43px;
        margin: 10px;
      }
    }
  }
  .right-tab {
    // padding-left: 10px;
    width: 100%;
    // margin-top: 10px;
    box-sizing: content-box;
    // padding-bottom: 30px;
    height: 100%;
    flex: 1;
    overflow-y: auto;
    // TODO:设备概览报警信息滚动
    // overflow-y: scroll;
    height: calc(100% - 50px);
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    .title {
      font-size: 16px;
      // color: #cdd8f7;
      @include font-color('mainFontColor12');
      margin: 10px 0;
      text-align: left;
      .prefix {
        margin-right: 10px;
      }
    }
    .right-tab-bg {
      width: 100%;
      height: auto;
      -webkit-touch-callout: none; /*系统默认菜单被禁用*/
      -webkit-user-select: none; /*webkit浏览器*/
      -khtml-user-select: none; /*早期浏览器*/
      -moz-user-select: none; /*火狐*/
      -ms-user-select: none; /*IE10*/
      user-select: none;
    }
    .ul-scrollbar {
      height: calc(100vh - 315px);
      overflow-x: hidden;
      .title {
        font-size: 16px;
        // color: #cdd8f7;
        @include font-color('mainFontColor12');
        margin: 10px 0;
        text-align: left;
        .prefix {
          margin-right: 10px;
        }
      }
    }
    .warn-none {
      // height: calc(100vh - 315px);
      overflow-x: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .tab-t {
      position: relative;
      > i {
        padding: 3px 5px;
        background: #e45353;
        color: #fff;
        position: absolute;
        top: 0;
        right: -25px;
        font-style: normal;
        font-size: 10px;
        line-height: 10px;
        border-radius: 10px;
      }
    }
    li {
      list-style: inside;
      font-size: 14px;
      // color: #cdd8f7;
      @include font-color('mainFontColor12');
      overflow: hidden;
      line-height: 40px;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    li:hover {
      color: #3e9aff;
    }
  }
}
.empty-setup {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vh;
  position: fixed;
  top: 30vh;
  z-index: 9999999;
}
div.popContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999998;
}
</style>
